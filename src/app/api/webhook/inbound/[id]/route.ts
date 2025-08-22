import { type NextRequest, NextResponse } from 'next/server';
import {
  deleteInboundMapping,
  updateInboundMapping,
} from '@/lib/webhooks/inbound';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  const mappingId = (await params).id;
  console.log(`[WEBHOOK API] PUT /api/webhook/inbound/${mappingId} - Started at ${new Date().toISOString()}`);
  
  try {
    const body = await req.json();
    console.log(`[WEBHOOK API] PUT /api/webhook/inbound/${mappingId} - Request body:`, JSON.stringify(body, null, 2));
    
    if (!body) {
      console.error(`[WEBHOOK API] PUT /api/webhook/inbound/${mappingId} - Missing request body`);
      return NextResponse.json(
        { error: 'Missing request body' },
        { status: 400 }
      );
    }
    
    const mapping = await updateInboundMapping(mappingId, body);
    
    const duration = Date.now() - startTime;
    console.log(`[WEBHOOK API] PUT /api/webhook/inbound/${mappingId} - Success: Updated mapping in ${duration}ms`);
    
    return NextResponse.json(mapping);
  } catch (error: unknown) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Failed to update inbound mapping';
    console.error(`[WEBHOOK API] PUT /api/webhook/inbound/${mappingId} - Error after ${duration}ms:`, errorMessage);
    
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
  const mappingId = (await params).id;
  console.log(`[WEBHOOK API] DELETE /api/webhook/inbound/${mappingId} - Started at ${new Date().toISOString()}`);
  
  try {
    await deleteInboundMapping(mappingId);
    
    const duration = Date.now() - startTime;
    console.log(`[WEBHOOK API] DELETE /api/webhook/inbound/${mappingId} - Success: Deleted mapping in ${duration}ms`);
    
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete inbound mapping';
    console.error(`[WEBHOOK API] DELETE /api/webhook/inbound/${mappingId} - Error after ${duration}ms:`, errorMessage);
    
    return NextResponse.json(
      {
        error: errorMessage,
      },
      { status: 400 }
    );
  }
}
