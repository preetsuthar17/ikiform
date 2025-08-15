import { type NextRequest, NextResponse } from 'next/server';
import {
  createInboundMapping,
  getInboundMappings,
} from '@/lib/webhooks/inbound';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const targetFormId = searchParams.get('targetFormId') || undefined;
    const mappings = await getInboundMappings({ targetFormId });
    return NextResponse.json(mappings);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to list inbound mappings',
      },
      { status: 400 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

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
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to create inbound mapping',
      },
      { status: 400 }
    );
  }
}
