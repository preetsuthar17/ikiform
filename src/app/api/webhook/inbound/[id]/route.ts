import { type NextRequest, NextResponse } from 'next/server';
import {
  deleteInboundMapping,
  updateInboundMapping,
} from '@/lib/webhooks/inbound';

// --- Inbound Webhook Mapping Update/Delete API ---

// PUT /api/webhook/inbound/[id] - Update inbound mapping
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    if (!body) {
      return NextResponse.json(
        { error: 'Missing request body' },
        { status: 400 }
      );
    }
    const mapping = await updateInboundMapping((await params).id, body);
    return NextResponse.json(mapping);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update inbound mapping' },
      { status: 400 }
    );
  }
}

// DELETE /api/webhook/inbound/[id] - Delete inbound mapping
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await deleteInboundMapping((await params).id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete inbound mapping' },
      { status: 400 }
    );
  }
}
