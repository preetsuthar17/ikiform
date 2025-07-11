import { NextRequest, NextResponse } from "next/server";
import { formsDbServer } from "@/lib/database";
import { checkFormRateLimit } from "@/lib/forms";
import { headers } from "next/headers";
import {
  DEFAULT_RATE_LIMIT_SETTINGS,
  DEFAULT_PROFANITY_FILTER_SETTINGS,
} from "@/lib/forms";
import { createProfanityFilter } from "@/lib/validation";
import { createClient } from "@/utils/supabase/server";
import { requirePremium } from "@/lib/utils/premium-check";
import { sendFormNotification } from "@/lib/services";
import { sanitizeString } from "@/lib/utils/sanitize";

// Recursively sanitize all string fields in an object
function sanitizeObjectStrings(obj: any): any {
  if (typeof obj === "string") return sanitizeString(obj);
  if (Array.isArray(obj)) return obj.map(sanitizeObjectStrings);
  if (obj && typeof obj === "object") {
    const result: any = {};
    for (const key in obj) {
      result[key] = sanitizeObjectStrings(obj[key]);
    }
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
    const { submissionData } = body;

    // Get client IP address for rate limiting
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    const realIp = headersList.get("x-real-ip");
    const ipAddress = forwardedFor?.split(",")[0] || realIp || "unknown";

    // Get the form to check rate limiting settings
    const form = await formsDbServer.getPublicForm(formId);
    if (!form) {
      return NextResponse.json(
        { error: "Form not found or not published" },
        { status: 404 }
      );
    }

    // Check if form owner has premium subscription
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const premiumCheck = await requirePremium(user.id);
      if (!premiumCheck.hasPremium) {
        return premiumCheck.error;
      }
    }

    // Check rate limiting - enabled by default
    const rateLimit = {
      ...DEFAULT_RATE_LIMIT_SETTINGS,
      ...form.schema.settings.rateLimit,
    };

    if (rateLimit.enabled) {
      const rateLimitResult = await checkFormRateLimit(ipAddress, formId, {
        enabled: rateLimit.enabled,
        maxSubmissions: rateLimit.maxSubmissions,
        timeWindow: rateLimit.timeWindow,
        blockDuration: rateLimit.blockDuration,
        message: rateLimit.message,
      });

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

    // Check response limit
    const responseLimit = form.schema.settings.responseLimit;
    if (responseLimit?.enabled) {
      // Count existing submissions for this form
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

    // Check profanity filter
    const profanityFilterSettings = {
      ...DEFAULT_PROFANITY_FILTER_SETTINGS,
      ...form.schema.settings.profanityFilter,
    };

    let filteredSubmissionData = sanitizeObjectStrings(submissionData);

    if (profanityFilterSettings.enabled) {
      const profanityFilter = createProfanityFilter(profanityFilterSettings);
      const filterResult = profanityFilter.filterSubmissionData(
        filteredSubmissionData
      );

      if (!filterResult.isValid) {
        return NextResponse.json(
          {
            error: "Content validation failed",
            message:
              filterResult.message ||
              "Your submission contains inappropriate content. Please review and resubmit.",
            violations: filterResult.violations.length,
          },
          { status: 400 }
        );
      }

      // Use filtered data if replacement mode is enabled
      if (profanityFilterSettings.replaceWithAsterisks) {
        filteredSubmissionData = filterResult.filteredData;
      }
    }

    // Submit the form if all checks pass
    const submission = await formsDbServer.submitForm(
      formId,
      filteredSubmissionData,
      ipAddress
    );

    // Send notification if enabled
    const notifications = form.schema.settings.notifications;
    if (notifications?.enabled && notifications.email) {
      try {
        console.log(
          "[Notification] Attempting to send notification email",
          notifications
        );
        // Build analytics URL
        const analyticsUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://ikiform.com"}/dashboard/forms/${formId}/analytics`;
        await sendFormNotification({
          to: notifications.email,
          subject:
            notifications.subject ||
            `New Submission: ${form.schema.settings.title}`,
          message:
            notifications.message ||
            `You have received a new submission on your form: ${form.schema.settings.title}.`,
          analyticsUrl,
          customLinks: notifications.customLinks || [],
        });
        console.log("[Notification] Notification email sent successfully");
      } catch (e) {
        // Log but do not block submission
        console.error("[Notification] Notification send error:", e);
      }
    } else {
      console.log(
        "[Notification] Notification not sent. Settings:",
        notifications
      );
    }

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      message: "Form submitted successfully",
    });
  } catch (error) {
    console.error("Form submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
