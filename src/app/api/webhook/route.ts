import { type NextRequest, NextResponse } from 'next/server';
import { createWebhook, getWebhooks } from '@/lib/webhooks/outbound';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();
  console.log(`[WEBHOOK API] GET /api/webhook - Started at ${new Date().toISOString()}`);
  
  try {
    const { searchParams } = new URL(req.url);
    const formId = searchParams.get('formId') || undefined;
    const accountId = searchParams.get('accountId') || undefined;
    
    console.log(`[WEBHOOK API] GET /api/webhook - Params: formId=${formId}, accountId=${accountId}`);
    
    const webhooks = await getWebhooks({ formId, accountId });
    
    const duration = Date.now() - startTime;
    console.log(`[WEBHOOK API] GET /api/webhook - Success: Found ${webhooks.length} webhooks in ${duration}ms`);
    
    return NextResponse.json(webhooks);
  } catch (error: unknown) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Failed to list webhooks';
    console.error(`[WEBHOOK API] GET /api/webhook - Error after ${duration}ms:`, errorMessage);
    
    return NextResponse.json(
      {
        error: errorMessage,
      },
      { status: 400 }
    );
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();
  console.log(`[WEBHOOK API] POST /api/webhook - Started at ${new Date().toISOString()}`);
  
  try {
    const body = await req.json();
    console.log(`[WEBHOOK API] POST /api/webhook - Request body:`, JSON.stringify(body, null, 2));

    const webhook = await createWebhook(body);
    
    const duration = Date.now() - startTime;
    console.log(`[WEBHOOK API] POST /api/webhook - Success: Created webhook ${webhook.id} in ${duration}ms`);
    
    return NextResponse.json(webhook, { status: 201 });
  } catch (error: unknown) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Failed to create webhook';
    console.error(`[WEBHOOK API] POST /api/webhook - Error after ${duration}ms:`, errorMessage);
    
    return NextResponse.json(
      {
        error: errorMessage,
      },
      { status: 400 }
    );
  }
}
