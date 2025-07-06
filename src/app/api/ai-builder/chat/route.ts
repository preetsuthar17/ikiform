import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { formsDbServer } from "@/lib/database";
import { requirePremium } from "@/lib/utils/premium-check";

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check premium status
    const premiumCheck = await requirePremium(user.id);
    if (!premiumCheck.hasPremium) {
      return premiumCheck.error;
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");
    const limit = parseInt(searchParams.get("limit") || "50");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Get chat history for the session
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
  } catch (error) {
    console.error("Error fetching AI Builder chat history:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check premium status
    const premiumCheck = await requirePremium(user.id);
    if (!premiumCheck.hasPremium) {
      return premiumCheck.error;
    }

    const body = await req.json();
    const { sessionId, role, content, metadata = {} } = body;

    if (!sessionId || !role || !content) {
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

    // Save the message
    const savedMessage = await formsDbServer.saveAIBuilderMessage(
      user.id,
      sessionId,
      role,
      content,
      metadata
    );

    return NextResponse.json({
      success: true,
      data: savedMessage,
    });
  } catch (error) {
    console.error("Error saving AI Builder message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
