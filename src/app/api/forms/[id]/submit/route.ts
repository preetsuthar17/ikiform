import { NextRequest, NextResponse } from "next/server";
import { formsDbServer } from "@/lib/database";
import { checkFormRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { DEFAULT_RATE_LIMIT_SETTINGS } from "@/lib/form-defaults";

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
            blocked: rateLimitResult.blocked,
            limit: rateLimitResult.limit,
            remaining: rateLimitResult.remaining,
            reset: rateLimitResult.reset,
          },
          { status: 429 }
        );
      }
    }

    // Submit the form if rate limiting passes
    const submission = await formsDbServer.submitForm(
      formId,
      submissionData,
      ipAddress
    );

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
