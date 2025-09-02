import { type NextRequest, NextResponse } from "next/server";
import { formsDbServer } from "@/lib/database";
import { requirePremium } from "@/lib/utils/premium-check";
import { sanitizeString } from "@/lib/utils/sanitize";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const premiumCheck = await requirePremium(user.id);
    if (!premiumCheck.hasPremium) {
      return (
        premiumCheck.error ||
        NextResponse.json({ error: "Premium required" }, { status: 403 })
      );
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    const chatHistory = await formsDbServer.getAIBuilderChatHistory(
      user.id,
      sessionId
    );

    return NextResponse.json({
      success: true,
      data: {
        sessionId,
        messages: chatHistory,
        count: chatHistory.length,
      },
    });
  } catch (_error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const premiumCheck = await requirePremium(user.id);
    if (!premiumCheck.hasPremium) {
      return (
        premiumCheck.error ||
        NextResponse.json({ error: "Premium required" }, { status: 403 })
      );
    }

    const body = await req.json();
    const { sessionId, role, content, metadata = {} } = body;

    if (!(sessionId && role && content)) {
      return NextResponse.json(
        { error: "Session ID, role, and content are required" },
        { status: 400 }
      );
    }

    if (!["user", "assistant", "system"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be 'user', 'assistant', or 'system'" },
        { status: 400 }
      );
    }

    const sanitizedContent = sanitizeString(content);

    const savedMessage = await formsDbServer.saveAIBuilderMessage(
      user.id,
      sessionId,
      role,
      sanitizedContent,
      metadata
    );

    return NextResponse.json({
      success: true,
      data: savedMessage,
    });
  } catch (_error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
