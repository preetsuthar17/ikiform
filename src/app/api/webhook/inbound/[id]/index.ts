import { type NextRequest, NextResponse } from "next/server";
import { formsDbServer } from "@/lib/database";
import { createAdminClient } from "@/utils/supabase/admin";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const mappingId = (await params).id;
    const supabase = createAdminClient();

    const { data: mapping, error } = await supabase
      .from("inbound_webhook_mappings")
      .select("*")
      .eq("id", mappingId)
      .single();
    if (error || !mapping) {
      return NextResponse.json(
        { error: "Inbound mapping not found" },
        { status: 404 },
      );
    }
    if (!mapping.enabled) {
      return NextResponse.json(
        { error: "Inbound mapping is disabled" },
        { status: 403 },
      );
    }

    if (mapping.secret) {
      const headerSecret = req.headers.get("x-inbound-secret");
      if (!headerSecret || headerSecret !== mapping.secret) {
        return NextResponse.json(
          { error: "Invalid or missing secret" },
          { status: 401 },
        );
      }
    }

    const incoming = await req.json();
    const mappingRules = mapping.mapping_rules || {};
    const mapped: Record<string, unknown> = {};
    for (const [external, formField] of Object.entries(mappingRules)) {
      mapped[formField as string] = incoming[external as string];
    }

    const result = await formsDbServer.submitForm(
      mapping.target_form_id,
      mapped,
    );
    return NextResponse.json({ success: true, submission: result });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to process inbound webhook",
      },
      { status: 400 },
    );
  }
}
