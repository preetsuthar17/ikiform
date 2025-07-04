import { cohere } from "@ai-sdk/cohere";
import { streamText } from "ai";
import { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { formsDb } from "@/lib/database";

const systemPrompt = process.env.ANALYTICS_AI_SYSTEM_PROMPT;

let apiKeyValid: boolean | null = null;

// Input validation
const MAX_MESSAGE_LENGTH = 2000;
const MAX_MESSAGES = 20;

function createErrorResponse(message: string, status: number = 500) {
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
  messages: any[],
): { role: string; content: string }[] {
  if (
    !Array.isArray(messages) ||
    messages.length === 0 ||
    messages.length > MAX_MESSAGES
  ) {
    throw new Error("Invalid messages array");
  }
  return messages.map((msg) => {
    if (!msg.role || typeof msg.content !== "string") {
      throw new Error("Invalid message format");
    }
    return {
      role: msg.role,
      content: msg.content.slice(0, MAX_MESSAGE_LENGTH),
    };
  });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "global";
  const rate = await checkRateLimit(ip);

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

    if (!formId || !context) {
      return createErrorResponse("Missing form ID or context data", 400);
    }

    let sanitizedMessages: { role: string; content: string }[];
    try {
      sanitizedMessages = validateAndSanitizeMessages(messages);
    } catch (error) {
      return createErrorResponse(
        error instanceof Error ? error.message : "Invalid request format",
        400,
      );
    }

    // Create context string from form data
    const contextString = `
    FORM INFORMATION:
    - Form ID: ${context.form.id}
    - Form Title: ${context.form.title}
    - Form Description: ${context.form.description}
    - Is Published: ${context.form.is_published}
    - Created: ${context.form.created_at}
    - Updated: ${context.form.updated_at}
    - Total Fields: ${context.form.schema.fields.length}
    
    FORM SCHEMA:
    ${JSON.stringify(context.form.schema, null, 2)}
    
    ANALYTICS SUMMARY:
    - Total Submissions: ${context.analytics.totalSubmissions}
    - Completion Rate: ${context.analytics.completionRate}%
    - Recent Submissions (30 days): ${context.analytics.recentSubmissions}
    - Most Active Day: ${context.analytics.mostActiveDay || "N/A"}
    
    SUBMISSION DATA:
    ${JSON.stringify(context.submissions.slice(0, 50), null, 2)}
    
    ${
      context.submissions.length > 50
        ? `... and ${context.submissions.length - 50} more submissions`
        : ""
    }
    `;

    const stream = await streamText({
      model: cohere("command"),
      messages: [
        {
          role: "system",
          content: systemPrompt || "You are a helpful analytics assistant.",
        },
        {
          role: "system",
          content: `Here's the form data context: ${contextString}`,
        },
        ...sanitizedMessages.map((msg) => ({
          ...msg,
          role: msg.role as "system" | "user" | "assistant" | "data",
        })),
      ],
      temperature: 0.1,
      maxTokens: 300,
      topP: 0.8,
    });

    // Stream the response
    const encoder = new TextEncoder();
    const { textStream } = stream;
    const reader = textStream.getReader();
    const responseStream = new ReadableStream({
      async start(controller) {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const chunk =
            typeof value === "string" ? value : new TextDecoder().decode(value);
          controller.enqueue(encoder.encode(chunk));
        }
        controller.close();
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
      },
    });
  } catch (error) {
    console.error("Analytics chat error:", error);
    return createErrorResponse("Internal server error");
  }
}

// Health check endpoint
export async function GET() {
  return new Response(
    JSON.stringify({
      status: "healthy",
      service: "analytics-chat-ai",
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
}
