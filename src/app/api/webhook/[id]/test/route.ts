import { type NextRequest, NextResponse } from 'next/server';
import { testWebhook } from '@/lib/webhooks/outbound';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  const webhookId = (await params).id;
  console.log(`[WEBHOOK API] POST /api/webhook/${webhookId}/test - Started at ${new Date().toISOString()}`);
  
  try {
    let samplePayload: unknown;
    try {
      samplePayload = await req.json();
      console.log(`[WEBHOOK API] POST /api/webhook/${webhookId}/test - Sample payload:`, JSON.stringify(samplePayload, null, 2));
    } catch {
      console.log(`[WEBHOOK API] POST /api/webhook/${webhookId}/test - No sample payload provided`);
    }
    
    const result = await testWebhook(webhookId, samplePayload);
    
    const duration = Date.now() - startTime;
    console.log(`[WEBHOOK API] POST /api/webhook/${webhookId}/test - Success: Test completed in ${duration}ms`);
    
    return NextResponse.json(result);
  } catch (error: unknown) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Failed to test webhook';
    console.error(`[WEBHOOK API] POST /api/webhook/${webhookId}/test - Error after ${duration}ms:`, errorMessage);
    
    return NextResponse.json(
      {
        error: errorMessage,
      },
      { status: 400 }
    );
  }
}
