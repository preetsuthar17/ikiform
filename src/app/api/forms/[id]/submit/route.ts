import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { formsDbServer } from "@/lib/database";
import {
  checkDuplicateSubmission,
  extractEmailFromSubmissionData,
  formatTimeRemaining,
  generateIdentifier,
  recordSubmission,
} from "@/lib/forms/duplicate-prevention";
import {
  checkFormRateLimit,
  DEFAULT_PROFANITY_FILTER_SETTINGS,
  DEFAULT_RATE_LIMIT_SETTINGS,
} from "@/lib/forms/server";
import { sendFormNotification } from "@/lib/services";
import { sanitizeString } from "@/lib/utils/sanitize";
import { createProfanityFilter } from "@/lib/validation";
import {
  formatHumanFriendlyPayload,
  triggerWebhooks,
} from "@/lib/webhooks/outbound";
import { createClient } from "@/utils/supabase/server";

function sanitizeObjectStrings(obj: any): any {
  if (typeof obj === "string") return sanitizeString(obj);
  if (Array.isArray(obj)) return obj.map(sanitizeObjectStrings);
  if (obj && typeof obj === "object") {
    const result: any = {};
    for (const key in obj) result[key] = sanitizeObjectStrings(obj[key]);
    return result;
  }
  return obj;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: formId } = await params;
    const body = await request.json();
    const { submissionData, sessionId } = body;

    const headersList = await headers();
    const ipAddress =
      headersList.get("x-forwarded-for")?.split(",")[0] ||
      headersList.get("x-real-ip") ||
      "unknown";

    const form = await formsDbServer.getPublicForm(formId);
    if (!form) {
      return NextResponse.json(
        { error: "Form not found or not published" },
        { status: 404 }
      );
    }

    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    const rateLimit = {
      ...DEFAULT_RATE_LIMIT_SETTINGS,
      ...form.schema.settings.rateLimit,
    };
    if (rateLimit.enabled) {
      const rateLimitResult = await checkFormRateLimit(
        ipAddress,
        formId,
        rateLimit
      );
      if (!rateLimitResult.success) {
        return NextResponse.json(
          {
            error: "Rate limit exceeded",
            message: rateLimitResult.message,
            limit: rateLimitResult.limit,
            remaining: rateLimitResult.remaining,
            reset: rateLimitResult.reset,
          },
          { status: 429 }
        );
      }
    }

    const responseLimit = form.schema.settings.responseLimit;
    if (responseLimit?.enabled) {
      const count = await formsDbServer.countFormSubmissions(formId);
      if (count >= (responseLimit.maxResponses || 100)) {
        return NextResponse.json(
          {
            error: "Response limit reached",
            message:
              responseLimit.message ||
              "This form is no longer accepting responses.",
          },
          { status: 403 }
        );
      }
    }

    // Check for duplicate submissions
    const duplicatePrevention = form.schema.settings.duplicatePrevention;
    if (duplicatePrevention?.enabled) {
      const email = extractEmailFromSubmissionData(submissionData);
      const identifier = generateIdentifier(
        duplicatePrevention.strategy || "ip",
        ipAddress,
        email,
        sessionId
      );

      const duplicateCheck = await checkDuplicateSubmission(
        formId,
        identifier,
        duplicatePrevention
      );

      if (duplicateCheck.isDuplicate) {
        const message = duplicateCheck.timeRemaining
          ? `${duplicatePrevention.message} Please wait ${formatTimeRemaining(duplicateCheck.timeRemaining)} before submitting again.`
          : duplicatePrevention.message;

        return NextResponse.json(
          {
            error: "Duplicate submission detected",
            message,
            timeRemaining: duplicateCheck.timeRemaining,
            attemptsRemaining: duplicateCheck.attemptsRemaining,
          },
          { status: 409 }
        );
      }
    }

    const profanityFilterSettings = {
      ...DEFAULT_PROFANITY_FILTER_SETTINGS,
      ...form.schema.settings.profanityFilter,
    };

    let filteredSubmissionData = sanitizeObjectStrings(submissionData);

    if (profanityFilterSettings.enabled) {
      const profanityFilter = createProfanityFilter(profanityFilterSettings);
      const result = profanityFilter.filterSubmissionData(
        filteredSubmissionData
      );
      if (!result.isValid) {
        return NextResponse.json(
          {
            error: "Content validation failed",
            message:
              result.message ||
              "Your submission contains inappropriate content. Please review and resubmit.",
            violations: result.violations.length,
          },
          { status: 400 }
        );
      }
      if (profanityFilterSettings.replaceWithAsterisks) {
        filteredSubmissionData = result.filteredData;
      }
    }

    const submission = await formsDbServer.submitForm(
      formId,
      filteredSubmissionData,
      ipAddress
    );

    if (duplicatePrevention?.enabled) {
      const email = extractEmailFromSubmissionData(submissionData);
      const identifier = generateIdentifier(
        duplicatePrevention.strategy || "ip",
        ipAddress,
        email,
        sessionId
      );

      recordSubmission(formId, identifier, duplicatePrevention).catch((e) =>
        console.error("[Duplicate Prevention] Record submission error:", e)
      );
    }

    const [formatted] = await Promise.all([
      formatHumanFriendlyPayload(formId, filteredSubmissionData),
      triggerWebhooks("form_submitted", {
        submissionId: submission.id,
        ipAddress,
        ...(await formatHumanFriendlyPayload(formId, filteredSubmissionData)),
      }).catch((e) => console.error("[Webhook] Delivery error:", e)),
    ]);

    const notifications = form.schema.settings.notifications;
    if (notifications?.enabled && notifications.email) {
      sendFormNotification({
        to: notifications.email,
        subject:
          notifications.subject ||
          `New Submission: ${form.schema.settings.title}`,
        message:
          notifications.message ||
          `You have received a new submission on your form: ${form.schema.settings.title}.`,
        analyticsUrl: `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.ikiform.com"}/dashboard/forms/${formId}/analytics`,
        customLinks: notifications.customLinks || [],
      }).catch((e) =>
        console.error("[Notification] Notification send error:", e)
      );
    }

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      message: "Form submitted successfully",
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
