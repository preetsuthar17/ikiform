import { type NextRequest, NextResponse } from 'next/server';
import { getWebhookLogs } from '@/lib/webhooks/outbound';

export async function GET(req: NextRequest) {
  const startTime = Date.now();
  console.log(
    `[WEBHOOK API] GET /api/webhook/logs - Started at ${new Date().toISOString()}`
  );

  try {
    const { searchParams } = new URL(req.url);
    const webhookId = searchParams.get('webhookId') || undefined;
    const formId = searchParams.get('formId') || undefined;
    const accountId = searchParams.get('accountId') || undefined;

    console.log(
      `[WEBHOOK API] GET /api/webhook/logs - Params: webhookId=${webhookId}, formId=${formId}, accountId=${accountId}`
    );

    const logs = await getWebhookLogs({ webhookId, formId, accountId });

    const duration = Date.now() - startTime;
    console.log(
      `[WEBHOOK API] GET /api/webhook/logs - Success: Found ${logs.length} logs in ${duration}ms`
    );

    return NextResponse.json(logs);
  } catch (error: unknown) {
    const duration = Date.now() - startTime;
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch webhook logs';
    console.error(
      `[WEBHOOK API] GET /api/webhook/logs - Error after ${duration}ms:`,
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
