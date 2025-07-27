import { type NextRequest, NextResponse } from 'next/server';
import { getWebhookLogs } from '@/lib/webhooks/outbound';

// --- Webhook Logs API ---

// GET /api/webhook/logs - List delivery logs (by webhook/form/account)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const webhookId = searchParams.get('webhookId') || undefined;
    const formId = searchParams.get('formId') || undefined;
    const accountId = searchParams.get('accountId') || undefined;
    const logs = await getWebhookLogs({ webhookId, formId, accountId });
    return NextResponse.json(logs);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch webhook logs' },
      { status: 400 }
    );
  }
}
