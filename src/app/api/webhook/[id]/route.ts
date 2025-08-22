import { type NextRequest, NextResponse } from 'next/server';
import { deleteWebhook, updateWebhook } from '@/lib/webhooks/outbound';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  const webhookId = (await params).id;
  console.log(
    `[WEBHOOK API] PUT /api/webhook/${webhookId} - Started at ${new Date().toISOString()}`
  );

  try {
    const body = await req.json();
    console.log(
      `[WEBHOOK API] PUT /api/webhook/${webhookId} - Request body:`,
      JSON.stringify(body, null, 2)
    );

    const webhook = await updateWebhook(webhookId, body);

    const duration = Date.now() - startTime;
    console.log(
      `[WEBHOOK API] PUT /api/webhook/${webhookId} - Success: Updated webhook in ${duration}ms`
    );

    return NextResponse.json(webhook);
  } catch (error: unknown) {
    const duration = Date.now() - startTime;
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to update webhook';
    console.error(
      `[WEBHOOK API] PUT /api/webhook/${webhookId} - Error after ${duration}ms:`,
      errorMessage
    );

    return NextResponse.json(
      {
        error: errorMessage,
      },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  const webhookId = (await params).id;
  console.log(
    `[WEBHOOK API] DELETE /api/webhook/${webhookId} - Started at ${new Date().toISOString()}`
  );

  try {
    await deleteWebhook(webhookId);

    const duration = Date.now() - startTime;
    console.log(
      `[WEBHOOK API] DELETE /api/webhook/${webhookId} - Success: Deleted webhook in ${duration}ms`
    );

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const duration = Date.now() - startTime;
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to delete webhook';
    console.error(
      `[WEBHOOK API] DELETE /api/webhook/${webhookId} - Error after ${duration}ms:`,
      errorMessage
    );

    return NextResponse.json(
      {
        error: errorMessage,
      },
      { status: 400 }
    );
  }
}
