import { cohere } from "@ai-sdk/cohere";
import { streamText } from "ai";
import { NextRequest } from "next/server";

// SECURITY NOTE: This file contains the AI system prompt which should not be exposed publicly.
// The prompt is designed to generate form schemas and should be kept secure.

// Read the system prompt from an environment variable
const systemPrompt =
  process.env.AI_FORM_SYSTEM_PROMPT ||
  "You are an expert form builder AI. Always output ONLY the JSON schema for a form, never any explanation, markdown, or extra text.";

// Cache for API key validation
let apiKeyValid: boolean | null = null;

// Pre-compiled regex for better performance
const JSON_EXTRACT_REGEX = /\{[\s\S]*\}/;

// Input validation schemas
const MAX_MESSAGE_LENGTH = 2000;
const MAX_MESSAGES = 10;

interface FormMessage {
  role: string;
  content: string;
}

interface FormRequest {
  messages: FormMessage[];
}

// Fast JSON extraction with better error handling
function extractFirstJson(text: string): any | null {
  try {
    // First try to parse the entire text as JSON
    return JSON.parse(text);
  } catch {
    // If that fails, try to extract JSON from text
    const match = text.match(JSON_EXTRACT_REGEX);
    if (!match) return null;

    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

// Validate and sanitize messages
function validateAndSanitizeMessages(messages: any[]): FormMessage[] {
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

// Create error response
function createErrorResponse(message: string, status: number = 500) {
  return new Response(JSON.stringify({ error: message }), {
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

// Create success response
function createSuccessResponse(data: any) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    if (apiKeyValid === null) {
      apiKeyValid = !!process.env.COHERE_API_KEY;
    }
    if (!apiKeyValid) {
      console.error("Cohere API key not configured");
      return createErrorResponse("AI service temporarily unavailable", 503);
    }

    let requestData: FormRequest;
    try {
      requestData = await req.json();
    } catch {
      return createErrorResponse("Invalid JSON in request body", 400);
    }

    let sanitizedMessages: FormMessage[];
    try {
      sanitizedMessages = validateAndSanitizeMessages(requestData.messages);
    } catch (error) {
      return createErrorResponse(
        error instanceof Error ? error.message : "Invalid request format",
        400
      );
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
    let fullText = "";
    let foundJson: any = null;

    // Create a ReadableStream to forward chunks
    const responseStream = new ReadableStream({
      async start(controller) {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const chunk =
            typeof value === "string" ? value : new TextDecoder().decode(value);
          fullText += chunk;
          controller.enqueue(encoder.encode(chunk));
          if (!foundJson) {
            try {
              const match = fullText.match(JSON_EXTRACT_REGEX);
              if (match) foundJson = JSON.parse(match[0]);
            } catch {}
          }
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
    console.error("Unexpected error in AI route:", error);
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
