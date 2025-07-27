import { type NextRequest, NextResponse } from 'next/server';
import { formsDbServer } from '@/lib/database';
import { createAdminClient } from '@/utils/supabase/admin';

// --- Inbound Webhook Receiver API ---

// POST /api/webhook/inbound/[id] - Receive and process inbound webhook
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const mappingId = (await params).id;
    const supabase = createAdminClient();
    // 1. Fetch the inbound mapping
    const { data: mapping, error } = await supabase
      .from('inbound_webhook_mappings')
      .select('*')
      .eq('id', mappingId)
      .single();
    if (error || !mapping) {
      return NextResponse.json(
        { error: 'Inbound mapping not found' },
        { status: 404 }
      );
    }
    if (!mapping.enabled) {
      return NextResponse.json(
        { error: 'Inbound mapping is disabled' },
        { status: 403 }
      );
    }
    // 2. Validate secret if set
    if (mapping.secret) {
      const headerSecret = req.headers.get('x-inbound-secret');
      if (!headerSecret || headerSecret !== mapping.secret) {
        return NextResponse.json(
          { error: 'Invalid or missing secret' },
          { status: 401 }
        );
      }
    }
    // 3. Parse and map payload
    const incoming = await req.json();
    const mappingRules = mapping.mapping_rules || {};
    const mapped: Record<string, unknown> = {};
    for (const [external, formField] of Object.entries(mappingRules)) {
      mapped[formField as string] = incoming[external as string];
    }
    // 4. Submit to target form
    const result = await formsDbServer.submitForm(
      mapping.target_form_id,
      mapped
    );
    return NextResponse.json({ success: true, submission: result });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to process inbound webhook',
      },
      { status: 400 }
    );
  }
}
