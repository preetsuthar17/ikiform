import { type NextRequest, NextResponse } from "next/server";
import { formsDbServer } from "@/lib/database";
import {
  checkDuplicateSubmission,
  extractEmailFromSubmissionData,
  generateIdentifier,
  recordSubmission,
} from "@/lib/forms/duplicate-prevention";
import { createAdminClient } from "@/utils/supabase/admin";

interface InboundWebhookMapping {
  id: string;
  endpoint: string;
  target_form_id: string;
  mapping_rules: Record<string, string>;
  secret?: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  const mappingId = (await params).id;
  console.log(
    `[WEBHOOK API] POST /api/webhook/inbound/${mappingId} - Started at ${new Date().toISOString()}`
  );

  try {
    const supabase = createAdminClient();

    const { data: mapping, error } = await supabase
      .from("inbound_webhook_mappings")
      .select("*")
      .eq("id", mappingId)
      .single<InboundWebhookMapping>();

    if (error || !mapping) {
      console.error(
        `[WEBHOOK API] POST /api/webhook/inbound/${mappingId} - Mapping not found:`,
        error
      );
      return NextResponse.json(
        { error: "Inbound mapping not found" },
        { status: 404 }
      );
    }

    console.log(
      `[WEBHOOK API] POST /api/webhook/inbound/${mappingId} - Found mapping for form: ${mapping.target_form_id}`
    );

    if (!mapping.enabled) {
      console.error(
        `[WEBHOOK API] POST /api/webhook/inbound/${mappingId} - Mapping is disabled`
      );
      return NextResponse.json(
        { error: "Inbound mapping is disabled" },
        { status: 403 }
      );
    }

    if (mapping.secret) {
      const headerSecret = req.headers.get("x-inbound-secret");
      if (!headerSecret || headerSecret !== mapping.secret) {
        console.error(
          `[WEBHOOK API] POST /api/webhook/inbound/${mappingId} - Invalid or missing secret`
        );
        return NextResponse.json(
          { error: "Invalid or missing secret" },
          { status: 401 }
        );
      }
      console.log(
        `[WEBHOOK API] POST /api/webhook/inbound/${mappingId} - Secret validation passed`
      );
    }

    const incoming = await req.json();
    console.log(
      `[WEBHOOK API] POST /api/webhook/inbound/${mappingId} - Incoming payload:`,
      JSON.stringify(incoming, null, 2)
    );

    const mappingRules = mapping.mapping_rules || {};
    const mapped: Record<string, unknown> = {};
    for (const [external, formField] of Object.entries(mappingRules)) {
      mapped[formField as string] = incoming[external as string];
    }

    console.log(
      `[WEBHOOK API] POST /api/webhook/inbound/${mappingId} - Mapped data:`,
      JSON.stringify(mapped, null, 2)
    );

    const form = await formsDbServer.getPublicForm(mapping.target_form_id);
    if (!form) {
      console.error(
        `[WEBHOOK API] POST /api/webhook/inbound/${mappingId} - Form not found: ${mapping.target_form_id}`
      );
      return NextResponse.json(
        { error: "Target form not found" },
        { status: 404 }
      );
    }

    const duplicatePrevention = form.schema.settings.duplicatePrevention;
    if (duplicatePrevention?.enabled) {
      const ipAddress =
        req.headers.get("x-forwarded-for")?.split(",")[0] ||
        req.headers.get("x-real-ip") ||
        "webhook";
      const email = extractEmailFromSubmissionData(mapped);
      const sessionId = `webhook_${mappingId}_${Date.now()}`;

      const identifier = generateIdentifier(
        duplicatePrevention.strategy || "ip",
        ipAddress,
        email,
        sessionId
      );

      const duplicateCheck = await checkDuplicateSubmission(
        mapping.target_form_id,
        identifier,
        duplicatePrevention
      );

      if (duplicateCheck.isDuplicate) {
        console.error(
          `[WEBHOOK API] POST /api/webhook/inbound/${mappingId} - Duplicate submission detected`
        );
        return NextResponse.json(
          {
            error: "Duplicate submission detected",
            message: duplicatePrevention.message,
            timeRemaining: duplicateCheck.timeRemaining,
            attemptsRemaining: duplicateCheck.attemptsRemaining,
          },
          { status: 409 }
        );
      }
    }

    const result = await formsDbServer.submitForm(
      mapping.target_form_id,
      mapped
    );

    // Record submission for duplicate prevention
    if (duplicatePrevention?.enabled) {
      const ipAddress =
        req.headers.get("x-forwarded-for")?.split(",")[0] ||
        req.headers.get("x-real-ip") ||
        "webhook";
      const email = extractEmailFromSubmissionData(mapped);
      const sessionId = `webhook_${mappingId}_${Date.now()}`;

      const identifier = generateIdentifier(
        duplicatePrevention.strategy || "ip",
        ipAddress,
        email,
        sessionId
      );

      recordSubmission(
        mapping.target_form_id,
        identifier,
        duplicatePrevention
      ).catch((e) =>
        console.error(
          "[Webhook Duplicate Prevention] Record submission error:",
          e
        )
      );
    }

    const duration = Date.now() - startTime;
    console.log(
      `[WEBHOOK API] POST /api/webhook/inbound/${mappingId} - Success: Form submitted in ${duration}ms`
    );

    return NextResponse.json({ success: true, submission: result });
  } catch (error: unknown) {
    const duration = Date.now() - startTime;
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to process inbound webhook";
    console.error(
      `[WEBHOOK API] POST /api/webhook/inbound/${mappingId} - Error after ${duration}ms:`,
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
