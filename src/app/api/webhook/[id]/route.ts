import { type NextRequest, NextResponse } from 'next/server';
import { deleteWebhook, updateWebhook } from '@/lib/webhooks/outbound';

// --- Outbound Webhook Update/Delete API ---

// PUT /api/webhook/[id] - Update a webhook
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const webhook = await updateWebhook((await params).id, body);
    return NextResponse.json(webhook);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update webhook' },
      { status: 400 }
    );
  }
}

// DELETE /api/webhook/[id] - Delete a webhook
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await deleteWebhook((await params).id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete webhook' },
      { status: 400 }
    );
  }
}
