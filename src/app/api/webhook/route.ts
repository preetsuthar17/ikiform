import { type NextRequest, NextResponse } from 'next/server';
import { createWebhook, getWebhooks } from '@/lib/webhooks/outbound';

// --- Outbound Webhook Management API ---

// GET /api/webhook - List webhooks (by form/account)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const formId = searchParams.get('formId') || undefined;
    const accountId = searchParams.get('accountId') || undefined;
    const webhooks = await getWebhooks({ formId, accountId });
    return NextResponse.json(webhooks);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to list webhooks' },
      { status: 400 }
    );
  }
}

// POST /api/webhook - Create a new webhook
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Optionally: validate with Zod here
    const webhook = await createWebhook(body);
    return NextResponse.json(webhook, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create webhook' },
      { status: 400 }
    );
  }
}
