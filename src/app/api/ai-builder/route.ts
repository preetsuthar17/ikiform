import { cohere } from "@ai-sdk/cohere";
import { streamText } from "ai";
import { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/forms";
import { createClient } from "@/utils/supabase/server";
import { formsDbServer } from "@/lib/database";
import { v4 as uuidv4 } from "uuid";

const systemPrompt =
  process.env.AI_FORM_SYSTEM_PROMPT ||
  "You are an expert form builder AI. Always output ONLY the JSON schema for a form, never any explanation, markdown, or extra text.";

let apiKeyValid: boolean | null = null;

// Input validation schemas
const MAX_MESSAGE_LENGTH = 2000;
const MAX_MESSAGES = 10;

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
  messages: any[]
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
      }
    );
  }

  try {
    // Check authentication
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return createErrorResponse("Unauthorized", 401);
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

    let sanitizedMessages: { role: string; content: string }[];
    try {
      sanitizedMessages = validateAndSanitizeMessages(requestData.messages);
    } catch (error) {
      return createErrorResponse(
        error instanceof Error ? error.message : "Invalid request format",
        400
      );
    }

    // Generate or use provided session ID
    const sessionId = requestData.sessionId || uuidv4();

    // Get the last user message to save
    const lastUserMessage = sanitizedMessages[sanitizedMessages.length - 1];

    // Save the user message
    if (lastUserMessage && lastUserMessage.role === "user") {
      try {
        await formsDbServer.saveAIBuilderMessage(
          user.id,
          sessionId,
          "user",
          lastUserMessage.content,
          {
            timestamp: new Date().toISOString(),
            ip: ip,
            userAgent: req.headers.get("user-agent") || "",
          }
        );
      } catch (error) {
        console.error("Error saving user message:", error);
        // Don't fail the request if saving fails
      }
    }

    const stream = await streamText({
      model: cohere("command"),
      messages: [
        { role: "system", content: systemPrompt },
        ...sanitizedMessages.map((msg) => ({
          ...msg,
          role: msg.role as "system" | "user" | "assistant" | "data",
        })),
      ],
      temperature: 0.3,
      maxTokens: 1750,
      topP: 0.9,
    });

    // Stream the response to the client as it comes in
    const encoder = new TextEncoder();
    const { textStream } = stream;
    const reader = textStream.getReader();

    // Collect the AI response for saving
    let aiResponse = "";

    const responseStream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            const chunk =
              typeof value === "string"
                ? value
                : new TextDecoder().decode(value);
            aiResponse += chunk;
            controller.enqueue(encoder.encode(chunk));
          }

          // Save the AI response after streaming is complete
          if (aiResponse.trim()) {
            try {
              await formsDbServer.saveAIBuilderMessage(
                user.id,
                sessionId,
                "assistant",
                aiResponse,
                {
                  timestamp: new Date().toISOString(),
                  model: "cohere/command",
                  temperature: 0.3,
                  maxTokens: 1750,
                  topP: 0.9,
                }
              );
            } catch (error) {
              console.error("Error saving AI response:", error);
            }
          }

          controller.close();
        } catch (error) {
          console.error("Error in AI Builder stream:", error);
          controller.error(error);
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
    console.error("AI Builder API error:", error);
    return createErrorResponse("Internal server error");
  }
}

// Optional: Add a GET handler for health checks
export async function GET() {
  return new Response(
    JSON.stringify({
      status: "healthy",
      service: "form-builder-ai",
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
