import { createGroq } from "@ai-sdk/groq";
import { streamText } from "ai";
import type { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { formsDbServer } from "@/lib/database";
import { checkRateLimit, type RateLimitSettings } from "@/lib/forms/server";
import { requirePremium } from "@/lib/utils/premium-check";
import {
	detectPromptInjection,
	filterSystemMessages,
	sanitizeForPromptInjection,
} from "@/lib/utils/prompt-injection";
import { sanitizeString } from "@/lib/utils/sanitize";
import { createClient } from "@/utils/supabase/server";

const systemPrompt =
	process.env.AI_FORM_SYSTEM_PROMPT ||
	"You are an expert form builder AI. Always output ONLY the JSON schema for a form, never any explanation, markdown, or extra text. If the form is multi-step (has more than one step or block), always set 'multiStep': true in the schema's settings object.";

let apiKeyValid: boolean | null = null;
const groq = createGroq({
	apiKey: process.env.GROQ_API_KEY,
});

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

type AiMessage = { role: string; content: string };

function validateAndSanitizeMessages(messages: AiMessage[]): AiMessage[] {
	if (!Array.isArray(messages) || messages.length === 0) {
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
				"Invalid input detected. Please rephrase your request without using system instructions or prompt manipulation.",
			);
		}

		return {
			role: msg.role,
			content: sanitized,
		};
	});
}

const AiBuilderRateLimit: RateLimitSettings = {
	enabled: true,
	maxSubmissions: 20,
	window: "5 m",
};

async function authenticateAndCheckPremium(
	req: NextRequest,
): Promise<{ user: any } | { error: Response }> {
	const supabase = await createClient();
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();
	if (authError || !user) {
		return { error: createErrorResponse("Unauthorized", 401) };
	}
	const premiumCheck = await requirePremium(user.id);
	if (!premiumCheck.hasPremium) {
		return { error: createErrorResponse("Premium subscription required", 403) };
	}
	return { user };
}

function validateApiKey(): Response | null {
	if (apiKeyValid === null) {
		apiKeyValid = !!process.env.GROQ_API_KEY;
	}
	if (!apiKeyValid) {
		return createErrorResponse("AI service temporarily unavailable", 503);
	}
	return null;
}

async function parseAndSanitizeRequest(req: NextRequest): Promise<
	| {
			sanitizedMessages: { role: string; content: string }[];
			sessionId?: string;
	  }
	| { error: Response }
> {
	type RequestData = {
		messages: { role: string; content: string }[];
		sessionId?: string;
	};
	let requestData: RequestData;
	try {
		requestData = await req.json();
	} catch {
		return { error: createErrorResponse("Invalid JSON in request body", 400) };
	}
	let sanitizedMessages: { role: string; content: string }[];
	try {
		sanitizedMessages = validateAndSanitizeMessages(requestData.messages);
	} catch (error) {
		return {
			error: createErrorResponse(
				error instanceof Error ? error.message : "Invalid request format",
				400,
			),
		};
	}
	return { sanitizedMessages, sessionId: requestData.sessionId };
}

async function saveMessageAsync(
	userId: string,
	sessionId: string,
	role: "user" | "assistant" | "system",
	content: string,
	metadata: any,
) {
	try {
		await formsDbServer.saveAIBuilderMessage(
			userId,
			sessionId,
			role,
			content,
			metadata,
		);
	} catch (error) {
		console.error(`Error saving ${role} message:`, error);
	}
}

function getGroqModel() {
	const modelPreference = process.env.GROQ_MODEL || "fastest";

	switch (modelPreference) {
		case "fastest":
			return "llama-3.1-8b-instant";
		case "balanced":
			return "llama-3.1-70b-versatile";
		case "quality":
			return "llama-3.2-90b-text-preview";
		case "fast":
		default:
			return "llama-3.1-8b-instant";
	}
}

async function streamAiResponse({
	sanitizedMessages,
	user,
	sessionId,
	req,
	ip,
}: {
	sanitizedMessages: { role: string; content: string }[];
	user: { id: string };
	sessionId: string;
	req: NextRequest;
	ip: string;
}) {
	const modelName = getGroqModel();

	const stream = await streamText({
		model: groq(modelName),
		messages: [
			{ role: "system", content: systemPrompt },
			...sanitizedMessages
				.filter((msg) => msg.role !== "system")
				.map((msg) => ({
					...msg,
					role: msg.role as "user" | "assistant",
				})),
		],
		temperature: 0.1,

		topP: 0.9,
		frequencyPenalty: 0,
		presencePenalty: 0,
	});

	let aiResponse = "";
	const encoder = new TextEncoder();
	const signal: AbortSignal | undefined = (req as any)?.signal;

	const responseStream = new ReadableStream({
		async start(controller) {
			let isClosed = false;

			const abort = () => {
				if (!isClosed) {
					try {
						controller.close();
					} catch {}
					isClosed = true;
				}
			};

			let abortListener: (() => void) | undefined;
			if (signal) {
				if (signal.aborted) {
					abort();
					return;
				}
				abortListener = abort;
				signal.addEventListener("abort", abortListener, { once: true });
			}

			try {
				for await (const chunk of stream.textStream) {
					if (isClosed || (signal && signal.aborted)) break;
					aiResponse += chunk;

					if (!isClosed) {
						try {
							controller.enqueue(encoder.encode(chunk));
						} catch {
							isClosed = true;
						}
					}
				}

				if (!isClosed && aiResponse.trim()) {
					saveMessageAsync(user.id, sessionId, "assistant", aiResponse, {
						timestamp: new Date().toISOString(),
						model: modelName,
						temperature: 0.1,
						provider: "groq",
					});
				}

				if (!isClosed) {
					controller.close();
					isClosed = true;
				}
			} catch (error) {
				console.error("Groq streaming error:", error);
				if (!isClosed) {
					controller.error(error as any);
					isClosed = true;
				}
			} finally {
				if (signal && abortListener) {
					try {
						signal.removeEventListener("abort", abortListener);
					} catch {}
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
			"X-Model": modelName,

			"Transfer-Encoding": "chunked",
			Connection: "keep-alive",
		},
	});
}

export async function POST(req: NextRequest): Promise<Response> {
	const ip = req.headers.get("x-forwarded-for") || "global";
	const rate = await checkRateLimit(ip, AiBuilderRateLimit);
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
			},
		);
	}

	try {
		const authResult = await authenticateAndCheckPremium(req);
		if ("error" in authResult) return authResult.error;
		const user = authResult.user;

		const apiKeyError = validateApiKey();
		if (apiKeyError) return apiKeyError;

		const parseResult = await parseAndSanitizeRequest(req);
		if ("error" in parseResult) return parseResult.error;
		const sanitizedMessages = parseResult.sanitizedMessages;
		const sessionId = parseResult.sessionId;

		const sid = sessionId || uuidv4();

		const lastUserMessage = sanitizedMessages.at(-1);

		if (lastUserMessage && lastUserMessage.role === "user") {
			saveMessageAsync(user.id, sid, "user", lastUserMessage.content, {
				timestamp: new Date().toISOString(),
				ip,
				userAgent: req.headers.get("user-agent") || "",
			});
		}

		return await streamAiResponse({
			sanitizedMessages,
			user,
			sessionId: sid,
			req,
			ip,
		});
	} catch (error) {
		console.error("AI Builder API error:", error);
		return createErrorResponse("Internal server error");
	}
}

export async function GET(): Promise<Response> {
	return new Response(
		JSON.stringify({
			status: "healthy",
			service: "form-builder-ai",
			timestamp: new Date().toISOString(),
			provider: "groq",
			model: getGroqModel(),
			available_models: [
				"llama-3.1-8b-instant (fastest)",
				"llama-3.1-70b-versatile (balanced)",
				"llama-3.2-90b-text-preview (highest quality)",
			],
		}),
		{
			status: 200,
			headers: { "Content-Type": "application/json" },
		},
	);
}
