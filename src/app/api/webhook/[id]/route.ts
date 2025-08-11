import { type NextRequest, NextResponse } from "next/server";
import { deleteWebhook, updateWebhook } from "@/lib/webhooks/outbound";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const body = await req.json();
    const webhook = await updateWebhook((await params).id, body);
    return NextResponse.json(webhook);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to update webhook",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await deleteWebhook((await params).id);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to delete webhook",
      },
      { status: 400 },
    );
  }
}
