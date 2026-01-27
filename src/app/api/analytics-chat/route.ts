import { cohere } from "@ai-sdk/cohere";
import { streamText } from "ai";
import type { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { formsDbServer } from "@/lib/database";
import { checkRateLimit, type RateLimitSettings } from "@/lib/forms/server";
import { requirePremium } from "@/lib/utils/premium-check";
import {
	detectPromptInjection,
	filterSystemMessages,
} from "@/lib/utils/prompt-injection";
import { sanitizeString } from "@/lib/utils/sanitize";
import { createClient } from "@/utils/supabase/server";

const systemPrompt = process.env.ANALYTICS_AI_SYSTEM_PROMPT;

const chatRateLimitSettings: RateLimitSettings = {
	enabled: true,
	maxSubmissions: 20,
	window: "5 m",
};

let apiKeyValid: boolean | null = null;

const MAX_MESSAGES = 20;

interface ConversationAnalysis {
	hasFollowUpQuestions: boolean;
	referencesLastResponse: boolean;
	topicsDiscussed: string[];
	lastAIResponse: string | null;
	lastUserMessage: string | null;
	conversationTurns: number;
	needsContext: boolean;
	contextualHints: string[];
	hasDirectRequest: boolean;
}

function createErrorResponse(message: string, status = 500) {
	return new Response(JSON.stringify({ success: false, message }), {
		status,
		headers: {
			"Content-Type": "application/json",
			"Cache-Control": "no-store",
			"X-Content-Type-Options": "nosniff",
			"X-Frame-Options": "DENY",
			"X-XSS-Protection": "1; mode=block",
		},
	});
}

function validateAndSanitizeMessages(
	messages: any[]
): { role: string; content: string }[] {
	if (
		!Array.isArray(messages) ||
		messages.length === 0 ||
		messages.length > MAX_MESSAGES
	) {
		throw new Error("Invalid messages array");
	}

	const filtered = filterSystemMessages(messages);

	return filtered.map((msg) => {
		if (!msg.role || typeof msg.content !== "string") {
			throw new Error("Invalid message format");
		}

		const sanitized = sanitizeString(msg.content);

		if (detectPromptInjection(sanitized)) {
			throw new Error(
				"Invalid input detected. Please rephrase your request without using system instructions or prompt manipulation."
			);
		}

		return {
			role: msg.role,
			content: sanitized,
		};
	});
}

function analyzeConversation(
	messages: { role: string; content: string }[]
): ConversationAnalysis {
	const userMessages = messages.filter((msg) => msg.role === "user");
	const assistantMessages = messages.filter((msg) => msg.role === "assistant");

	const lastUserMessage =
		userMessages[userMessages.length - 1]?.content || null;
	const lastAiResponse =
		assistantMessages[assistantMessages.length - 1]?.content || null;

	const followUpKeywords = [
		"what about",
		"how about",
		"and what",
		"also",
		"additionally",
		"furthermore",
		"can you also",
		"what else",
		"more about",
		"tell me more",
		"expand on",
		"regarding that",
		"about that",
		"from that",
		"based on that",
		"following up",
		"continue",
		"next",
		"then",
		"after that",
		"similarly",
		"likewise",
		"in relation to",
		"concerning",
		"as for",
		"with respect to",
	];

	const referenceKeywords = [
		"you mentioned",
		"you said",
		"you showed",
		"from your response",
		"your analysis",
		"that data",
		"those numbers",
		"that metric",
		"that field",
		"that insight",
		"the previous",
		"earlier you",
		"before you",
		"last time",
		"above",
		"that trend",
		"that pattern",
		"that issue",
		"that recommendation",
		"them",
		"these",
		"those",
		"it",
		"this",
	];

	const directActionKeywords = [
		"list",
		"show",
		"display",
		"give me",
		"tell me",
		"what are",
		"how many",
		"describe",
		"explain",
		"break down",
		"summarize",
		"detail",
		"enumerate",
	];

	const topicKeywords = {
		completion: ["completion", "complete", "finished", "submit"],
		conversion: ["conversion", "convert", "funnel", "drop-off", "abandon"],
		fields: ["field", "input", "question", "element", "component"],
		trends: ["trend", "pattern", "over time", "daily", "weekly", "monthly"],
		performance: ["performance", "optimize", "improve", "best", "worst"],
		users: ["user", "visitor", "respondent", "participant", "audience"],
		analytics: ["analytics", "data", "metrics", "statistics", "numbers"],
		time: ["time", "date", "when", "hour", "day", "week", "month"],
		comparison: ["compare", "versus", "vs", "difference", "between"],
		insights: ["insight", "recommendation", "suggestion", "advice", "tip"],
	};

	const currentMessage = lastUserMessage?.toLowerCase() || "";
	const previousMessages = messages
		.slice(-5)
		.map((m) => m.content.toLowerCase())
		.join(" ");

	const hasFollowUpQuestions = followUpKeywords.some((keyword) =>
		currentMessage.includes(keyword.toLowerCase())
	);

	const referencesLastResponse = referenceKeywords.some((keyword) =>
		currentMessage.includes(keyword.toLowerCase())
	);

	const isDirectRequest = directActionKeywords.some((keyword) =>
		currentMessage.includes(keyword.toLowerCase())
	);

	const topicsDiscussed = Object.entries(topicKeywords)
		.filter(([_, keywords]) =>
			keywords.some((keyword) =>
				previousMessages.includes(keyword.toLowerCase())
			)
		)
		.map(([topic, _]) => topic);

	const needsContext =
		hasFollowUpQuestions ||
		referencesLastResponse ||
		currentMessage.includes("that") ||
		currentMessage.includes("it") ||
		currentMessage.includes("this") ||
		currentMessage.includes("these") ||
		currentMessage.includes("them");

	const contextualHints = [];
	if (hasFollowUpQuestions) {
		contextualHints.push("User is asking a follow-up question");
	}
	if (referencesLastResponse) {
		contextualHints.push("User is referencing your previous response");
	}
	if (isDirectRequest) {
		contextualHints.push(
			"User is making a direct request for information - be specific and helpful"
		);
	}
	if (topicsDiscussed.length > 0) {
		contextualHints.push(`Previous topics: ${topicsDiscussed.join(", ")}`);
	}
	if (needsContext && lastAiResponse) {
		contextualHints.push("User may be referring to previous analysis");
	}

	return {
		hasFollowUpQuestions,
		referencesLastResponse,
		topicsDiscussed,
		lastAIResponse: lastAiResponse,
		lastUserMessage,
		conversationTurns: Math.floor(messages.length / 2),
		needsContext,
		contextualHints,
		hasDirectRequest: isDirectRequest,
	};
}

export async function POST(req: NextRequest): Promise<Response> {
	const ip = req.headers.get("x-forwarded-for") || "global";
	const rate = await checkRateLimit(ip, chatRateLimitSettings);

	if (!rate.success) {
		const retryAfter = rate.reset
			? Math.ceil((rate.reset - Date.now()) / 1000)
			: 30;
		return new Response(
			JSON.stringify({
				success: false,
				message: "Too many requests. Please try again later.",
			}),
			{
				status: 429,
				headers: { "Retry-After": retryAfter.toString() },
			}
		);
	}

	try {
		const supabase = await createClient();
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			return createErrorResponse("Unauthorized", 401);
		}

		const premiumCheck = await requirePremium(user.id);
		if (!premiumCheck.hasPremium) {
			return (
				premiumCheck.error ||
				createErrorResponse("Premium subscription required", 403)
			);
		}

		if (apiKeyValid === null) {
			apiKeyValid = !!process.env.COHERE_API_KEY;
		}
		if (!apiKeyValid) {
			return createErrorResponse("AI service temporarily unavailable", 503);
		}

		let requestData: any;
		try {
			requestData = await req.json();
		} catch {
			return createErrorResponse("Invalid JSON in request body", 400);
		}

		const { messages, formId, context } = requestData;

		if (!(formId && context)) {
			return createErrorResponse("Missing form ID or context data", 400);
		}

		let sanitizedMessages: { role: string; content: string }[];
		try {
			sanitizedMessages = validateAndSanitizeMessages(messages);
		} catch (error) {
			return createErrorResponse(
				error instanceof Error ? error.message : "Invalid request format",
				400
			);
		}

		const sessionId = requestData.sessionId || uuidv4();

		const lastUserMessage = sanitizedMessages[sanitizedMessages.length - 1];

		if (lastUserMessage && lastUserMessage.role === "user") {
			try {
				await formsDbServer.saveAIAnalyticsMessage(
					user.id,
					formId,
					sessionId,
					"user",
					lastUserMessage.content,
					{
						timestamp: new Date().toISOString(),
						ip,
						userAgent: req.headers.get("user-agent") || "",
						contextSnapshot: {
							totalSubmissions: context.analytics?.totalSubmissions || 0,
							completionRate: context.analytics?.completionRate || 0,
							averageTime: context.analytics?.averageTime || 0,
						},
					}
				);
			} catch (error) {
				console.error("Error saving user message:", error);
			}
		}

		const conversationAnalysis = analyzeConversation(sanitizedMessages);

		const now = new Date();
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
		const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
		const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

		const todaySubmissions = context.submissions.filter(
			(sub: any) => new Date(sub.submitted_at) >= today
		).length;

		const yesterdaySubmissions = context.submissions.filter((sub: any) => {
			const subDate = new Date(sub.submitted_at);
			return subDate >= yesterday && subDate < today;
		}).length;

		const thisWeekSubmissions = context.submissions.filter(
			(sub: any) => new Date(sub.submitted_at) >= weekAgo
		).length;

		const thisMonthSubmissions = context.submissions.filter(
			(sub: any) => new Date(sub.submitted_at) >= monthAgo
		).length;

		const contextString = `
    CONVERSATION CONTEXT & MEMORY:
    - Conversation Turns: ${conversationAnalysis.conversationTurns}
    - Has Follow-up Questions: ${conversationAnalysis.hasFollowUpQuestions}
    - References Last Response: ${conversationAnalysis.referencesLastResponse}
    - Topics Previously Discussed: ${
			conversationAnalysis.topicsDiscussed.join(", ") || "None"
		}
    - Needs Context: ${conversationAnalysis.needsContext}
    - Contextual Hints: ${
			conversationAnalysis.contextualHints.join("; ") || "None"
		}
    
    PREVIOUS AI RESPONSE (for reference):
    ${
			conversationAnalysis.lastAIResponse
				? `"${conversationAnalysis.lastAIResponse}"`
				: "No previous response"
		}
    
    LAST USER MESSAGE:
    ${
			conversationAnalysis.lastUserMessage
				? `"${conversationAnalysis.lastUserMessage}"`
				: "No previous message"
		}
    
    CURRENT DATE & TIME CONTEXT:
    - Current Date: ${now.toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		})}
    - Current Time: ${now.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			timeZoneName: "short",
		})}
    - UTC Timestamp: ${now.toISOString()}
    - Day of Week: ${now.toLocaleDateString("en-US", { weekday: "long" })}
    - Current Hour: ${now.getHours()}:00
    - Time Zone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}
    
    LIVE SUBMISSION METRICS:
    - Submissions Today (${today.toLocaleDateString()}): ${todaySubmissions}
    - Submissions Yesterday: ${yesterdaySubmissions}
    - Submissions This Week (last 7 days): ${thisWeekSubmissions}
    - Submissions This Month (last 30 days): ${thisMonthSubmissions}
    - Days Since Form Created: ${Math.floor(
			(now.getTime() - new Date(context.form.created_at).getTime()) /
				(1000 * 60 * 60 * 24)
		)}
    - Days Since Last Update: ${Math.floor(
			(now.getTime() - new Date(context.form.updated_at).getTime()) /
				(1000 * 60 * 60 * 24)
		)}
    
    FORM INFORMATION:
    - Form ID: ${context.form.id}
    - Form Title: ${context.form.title}
    - Form Description: ${context.form.description}
    - Is Published: ${context.form.is_published}
    - Created: ${context.form.created_at}
    - Updated: ${context.form.updated_at}
    - Total Fields: ${context.form.schema.fields?.length || 0}
    - Form Type: ${
			context.form.schema.settings?.multiStep ? "Multi-Step" : "Single Page"
		}
    
    FORM SCHEMA:
    ${JSON.stringify(context.form.schema, null, 2)}
    
    COMPREHENSIVE ANALYTICS SUMMARY:
    - Total Submissions: ${context.analytics.totalSubmissions}
    - Completion Rate: ${context.analytics.completionRate}%
    - Recent Submissions (30 days): ${context.analytics.recentSubmissions}
    - Most Active Day: ${context.analytics.mostActiveDay || "N/A"}
    - Last Submission: ${context.analytics.lastSubmission || "N/A"}
    - Average Daily Submissions: ${context.analytics.avgSubmissionsPerDay || 0}
    - Bounce Rate: ${context.analytics.bounceRate || 0}%
    - Peak Hour: ${context.analytics.peakHour || "N/A"}
    - Unique Response Values: ${context.analytics.uniqueResponses || 0}
    
    FIELD ANALYTICS:
    ${
			context.analytics.fieldAnalytics
				? JSON.stringify(context.analytics.fieldAnalytics, null, 2)
				: "No field analytics available"
		}
    
    TOP PERFORMING FIELDS:
    ${
			context.analytics.topFields
				? context.analytics.topFields
						.map(
							(field: any, index: number) =>
								`${index + 1}. ${field[1].label}: ${
									field[1].completionRate
								}% completion (${field[1].totalResponses} responses)`
						)
						.join("\n")
				: "No field performance data available"
		}
    
    FIELDS NEEDING ATTENTION:
    ${
			context.analytics.worstFields
				? context.analytics.worstFields
						.map(
							(field: any, index: number) =>
								`${index + 1}. ${field[1].label}: ${
									field[1].completionRate
								}% completion (${field[1].totalResponses} responses)`
						)
						.join("\n")
				: "All fields performing well"
		}
    
    SUBMISSION TRENDS (Last 7 Days):
    ${
			context.analytics.submissionTrends
				? Object.entries(context.analytics.submissionTrends)
						.map(([date, count]) => `${date}: ${count} submissions`)
						.join("\n")
				: "No trend data available"
		}
    
    CONVERSION FUNNEL (Multi-step forms):
    ${
			context.analytics.conversionFunnel
				? context.analytics.conversionFunnel
						.map(
							(step: any, index: number) =>
								`Step ${index + 1} - ${step.stepName}: ${step.completedCount}/${
									context.analytics.totalSubmissions
								} (${step.conversionRate}%)`
						)
						.join("\n")
				: "Not a multi-step form or no funnel data"
		}
    
    SUBMISSION DATA SAMPLE:
    ${JSON.stringify(
			context.submissions.slice(0, 10).map((sub: any) => ({
				...sub,
				submission_data: Object.fromEntries(
					Object.entries(sub.submission_data).map(([key, value]) => {
						if (typeof value === "object" && value !== null) {
							return [
								key,
								Array.isArray(value)
									? JSON.stringify(value)
									: JSON.stringify(value),
							];
						}

						return [key, value];
					})
				),
			})),
			null,
			2
		)}
    ${
			context.submissions.length > 10
				? `... and ${
						context.submissions.length - 10
					} more submissions (showing first 10 for context)`
				: ""
		}
    
    WEBSITE FIELD DATA FROM ALL RESPONSES:
    ${context.submissions
			.map((sub: any) => {
				const website = sub.submission_data?.website;

				if (typeof website === "object" && website !== null) {
					return JSON.stringify(website);
				}
				return website !== undefined ? String(website) : "";
			})
			.filter((v: string) => v)
			.join("\n")}
    `;

		const stream = await streamText({
			model: cohere("command-r7b-12-2024"),
			messages: [
				{
					role: "system",
					content:
						systemPrompt ||
						"You are Kiko, a helpful analytics assistant specialized in form analytics. You have access to live date/time information and can provide time-aware insights. When users ask about 'today', 'yesterday', 'this week', etc., use the provided current date context. Always use specific dates and times when relevant. Provide clear, actionable insights based on the form data with specific numbers and percentages. Be concise but informative.",
				},
				{
					role: "system",
					content: `DIRECT RESPONSE MODE:
          
          Context Analysis: ${
						conversationAnalysis.contextualHints.join("; ") || "None"
					}
          
          ${
						conversationAnalysis.needsContext
							? "USER REFERENCING PREVIOUS CONTENT - Connect to earlier discussion."
							: ""
					}
          ${
						conversationAnalysis.hasFollowUpQuestions
							? "FOLLOW-UP QUESTION - Build on previous analysis."
							: ""
					}
          ${
						conversationAnalysis.referencesLastResponse
							? "REFERENCING YOUR PREVIOUS RESPONSE - Make connections explicit."
							: ""
					}
          ${
						conversationAnalysis.hasDirectRequest
							? "DIRECT REQUEST - Show the requested data immediately."
							: ""
					}
          
          Previous AI Response: ${
						conversationAnalysis.lastAIResponse
							? `"${conversationAnalysis.lastAIResponse.slice(0, 200)}..."`
							: "None"
					}
          
          RULES:
          - No pleasantries, just answers
          - Show actual submission data when requested
          - Use conversation context for pronouns (it, that, them, those)
          - Build on previous responses, don't restart
          - This is their own form data - show everything they ask for
          
          Here's the comprehensive form analytics context: ${contextString}`,
				},
				...sanitizedMessages
					.filter((msg) => msg.role !== "system")
					.map((msg) => ({
						...msg,
						role: msg.role as "user" | "assistant",
					})),
			],
			temperature: 0.1,
			topP: 0.8,
		});

		const encoder = new TextEncoder();
		const { textStream } = stream;
		const reader = textStream.getReader();

		let aiResponse = "";

		const responseStream = new ReadableStream({
			async start(controller) {
				try {
					while (true) {
						const { value, done } = await reader.read();
						if (done) break;

						if (controller.desiredSize === null) {
							break;
						}

						const chunk =
							typeof value === "string"
								? value
								: new TextDecoder().decode(value);
						aiResponse += chunk;

						try {
							controller.enqueue(encoder.encode(chunk));
						} catch (error) {
							if (
								error instanceof Error &&
								error.message.includes("Controller is already closed")
							) {
								break;
							}
							throw error;
						}
					}

					if (aiResponse.trim()) {
						try {
							await formsDbServer.saveAIAnalyticsMessage(
								user.id,
								formId,
								sessionId,
								"assistant",
								aiResponse,
								{
									timestamp: new Date().toISOString(),
									model: "groq/llama-3.1-8b-instant",
									temperature: 0.3,
									maxTokens: 1500,
									topP: 0.9,
									conversationAnalysis: {
										hasFollowUpQuestions:
											conversationAnalysis.hasFollowUpQuestions,
										referencesLastResponse:
											conversationAnalysis.referencesLastResponse,
										topicsDiscussed: conversationAnalysis.topicsDiscussed,
										conversationTurns: conversationAnalysis.conversationTurns,
										needsContext: conversationAnalysis.needsContext,
										contextualHints: conversationAnalysis.contextualHints,
										hasDirectRequest: conversationAnalysis.hasDirectRequest,
									},
								}
							);
						} catch (error) {
							console.error("Error saving AI response:", error);
						}
					}

					if (controller.desiredSize !== null) {
						controller.close();
					}
				} catch (error) {
					console.error("Error in Analytics chat stream:", error);

					if (controller.desiredSize !== null) {
						controller.error(error);
					}
				}
			},
		});

		return new Response(responseStream, {
			status: 200,
			headers: {
				"Content-Type": "text/plain; charset=utf-8",
				"Cache-Control": "no-store",
				"X-Content-Type-Options": "nosniff",
				"X-Frame-Options": "DENY",
				"X-XSS-Protection": "1; mode=block",
				"X-Session-ID": sessionId,
			},
		});
	} catch (error) {
		console.error("Analytics chat error:", error);
		return createErrorResponse("Internal server error");
	}
}

export async function GET(): Promise<Response> {
	return new Response(
		JSON.stringify({
			status: "healthy",
			service: "analytics-chat-ai",
			timestamp: new Date().toISOString(),
		}),
		{
			status: 200,
			headers: { "Content-Type": "application/json" },
		}
	);
}
