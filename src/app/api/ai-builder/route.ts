import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import type { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { formsDbServer } from '@/lib/database';
import { checkRateLimit, type RateLimitSettings } from '@/lib/forms';
import { requirePremium } from '@/lib/utils/premium-check';
import { sanitizeString } from '@/lib/utils/sanitize';
import { createClient } from '@/utils/supabase/server';

const systemPrompt =
  process.env.AI_FORM_SYSTEM_PROMPT ||
  "You are an expert form builder AI. Always output ONLY the JSON schema for a form, never any explanation, markdown, or extra text. If the form is multi-step (has more than one step or block), always set 'multiStep': true in the schema's settings object.";

let apiKeyValid: boolean | null = null;

function createErrorResponse(message: string, status = 500) {
  return new Response(JSON.stringify({ success: false, message }), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
    },
  });
}

type AIMessage = { role: string; content: string };

function validateAndSanitizeMessages(messages: AIMessage[]): AIMessage[] {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error('Invalid messages array');
  }
  return messages.map((msg) => {
    if (!msg.role || typeof msg.content !== 'string') {
      throw new Error('Invalid message format');
    }
    return {
      role: msg.role,
      content: sanitizeString(msg.content),
    };
  });
}

const AIBuilderRateLimit: RateLimitSettings = {
  enabled: true,
  maxSubmissions: 10,
  window: '5 m',
};

// --- Helper functions for POST ---
async function authenticateAndCheckPremium(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: createErrorResponse('Unauthorized', 401) };
  }
  const premiumCheck = await requirePremium(user.id);
  if (!premiumCheck.hasPremium) {
    return { error: createErrorResponse('Premium subscription required', 403) };
  }
  return { user };
}

function validateApiKey() {
  if (apiKeyValid === null) {
    apiKeyValid = !!process.env.GROQ_API_KEY;
  }
  if (!apiKeyValid) {
    return createErrorResponse('AI service temporarily unavailable', 503);
  }
  return null;
}

async function parseAndSanitizeRequest(req: NextRequest) {
  type RequestData = {
    messages: { role: string; content: string }[];
    sessionId?: string;
  };
  let requestData: RequestData;
  try {
    requestData = await req.json();
  } catch {
    return { error: createErrorResponse('Invalid JSON in request body', 400) };
  }
  let sanitizedMessages: { role: string; content: string }[];
  try {
    sanitizedMessages = validateAndSanitizeMessages(requestData.messages);
  } catch (error) {
    return {
      error: createErrorResponse(
        error instanceof Error ? error.message : 'Invalid request format',
        400
      ),
    };
  }
  return { sanitizedMessages, sessionId: requestData.sessionId };
}

async function streamAIResponse({
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
  const stream = await streamText({
    model: groq('llama-3.1-8b-instant'),
    messages: [
      { role: 'system', content: systemPrompt },
      ...sanitizedMessages.map((msg) => ({
        ...msg,
        role: msg.role as 'system' | 'user' | 'assistant' | 'data',
      })),
    ],
    temperature: 0.3,
  });
  const encoder = new TextEncoder();
  const { textStream } = stream;
  const reader = textStream.getReader();
  let aiResponse = '';
  // Avoid await in loop: collect all chunks, then process
  const chunks: Uint8Array[] = [];
  let done = false;
  while (!done) {
    // eslint-disable-next-line no-await-in-loop
    const { value, done: isDone } = await reader.read();
    done = isDone;
    if (value) {
      const chunk =
        typeof value === 'string' ? value : new TextDecoder().decode(value);
      aiResponse += chunk;
      chunks.push(encoder.encode(chunk));
    }
  }
  // Save the AI response after streaming is complete
  if (aiResponse.trim()) {
    try {
      await formsDbServer.saveAIBuilderMessage(
        user.id,
        sessionId,
        'assistant',
        aiResponse,
        {
          timestamp: new Date().toISOString(),
          model: 'groq/llama3-70b-8192',
          temperature: 0.3,
        }
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error saving AI response:', error);
    }
  }
  const responseStream = new ReadableStream({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(chunk);
      }
      controller.close();
    },
  });
  return new Response(responseStream, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'X-Session-ID': sessionId,
    },
  });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'global';
  const rate = await checkRateLimit(ip, AIBuilderRateLimit);
  if (!rate.success) {
    const retryAfter = rate.reset
      ? Math.ceil((rate.reset - Date.now()) / 1000)
      : 30;
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Too many requests. Please try again later.',
      }),
      {
        status: 429,
        headers: { 'Retry-After': retryAfter.toString() },
      }
    );
  }
  try {
    const authResult = await authenticateAndCheckPremium(req);
    if ('error' in authResult) return authResult.error;
    const user = authResult.user;
    const apiKeyError = validateApiKey();
    if (apiKeyError) return apiKeyError;
    const parseResult = await parseAndSanitizeRequest(req);
    if ('error' in parseResult) return parseResult.error;
    const sanitizedMessages = parseResult.sanitizedMessages;
    const sessionId = parseResult.sessionId;
    // Generate or use provided session ID
    const sid = sessionId || uuidv4();
    // Get the last user message to save
    const lastUserMessage = sanitizedMessages.at(-1);
    // Save the user message
    if (lastUserMessage && lastUserMessage.role === 'user') {
      try {
        await formsDbServer.saveAIBuilderMessage(
          user.id,
          sid,
          'user',
          lastUserMessage.content,
          {
            timestamp: new Date().toISOString(),
            ip,
            userAgent: req.headers.get('user-agent') || '',
          }
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error saving user message:', error);
        // Don't fail the request if saving fails
      }
    }
    return await streamAIResponse({
      sanitizedMessages,
      user,
      sessionId: sid,
      req,
      ip,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('AI Builder API error:', error);
    return createErrorResponse('Internal server error');
  }
}

// Optional: Add a GET handler for health checks
export async function GET() {
  return new Response(
    JSON.stringify({
      status: 'healthy',
      service: 'form-builder-ai',
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
