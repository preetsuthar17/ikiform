import { type NextRequest, NextResponse } from 'next/server';
import {
  createInboundMapping,
  getInboundMappings,
} from '@/lib/webhooks/inbound';

// --- Inbound Webhook Mapping Management API ---

// GET /api/webhook/inbound - List inbound mappings (optionally filter by targetFormId)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const targetFormId = searchParams.get('targetFormId') || undefined;
    const mappings = await getInboundMappings({ targetFormId });
    return NextResponse.json(mappings);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to list inbound mappings' },
      { status: 400 }
    );
  }
}

// POST /api/webhook/inbound - Create inbound mapping
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Basic validation
    if (!(body.endpoint && body.targetFormId && body.mappingRules)) {
      return NextResponse.json(
        {
          error:
            'Missing required fields: endpoint, targetFormId, mappingRules',
        },
        { status: 400 }
      );
    }
    const mapping = await createInboundMapping(body);
    return NextResponse.json(mapping, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create inbound mapping' },
      { status: 400 }
    );
  }
}
