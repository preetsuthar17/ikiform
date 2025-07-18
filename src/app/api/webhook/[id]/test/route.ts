import { NextRequest, NextResponse } from "next/server";
import { testWebhook } from "@/lib/webhooks/outbound";

// --- Outbound Webhook Test API ---

// POST /api/webhook/[id]/test - Test a webhook (send sample payload)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    let samplePayload = undefined;
    try {
      samplePayload = await req.json();
    } catch {}
    const result = await testWebhook((await params).id, samplePayload);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to test webhook" },
      { status: 400 }
    );
  }
}
