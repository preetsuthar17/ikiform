import { type NextRequest, NextResponse } from "next/server";
import { testWebhook } from "@/lib/webhooks/outbound";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    let samplePayload: unknown;
    try {
      samplePayload = await req.json();
    } catch {}
    const result = await testWebhook((await params).id, samplePayload);
    return NextResponse.json(result);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to test webhook",
      },
      { status: 400 },
    );
  }
}
