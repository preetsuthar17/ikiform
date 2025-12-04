import { type NextRequest, NextResponse } from "next/server";
import { resendWebhookDelivery } from "@/lib/webhooks/outbound";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

async function verifyWebhookOwnership(
	webhookId: string,
	userId: string,
): Promise<boolean> {
	const supabase = createAdminClient();
	const { data: webhook, error } = await supabase
		.from("webhooks")
		.select("id, account_id, form_id")
		.eq("id", webhookId)
		.single();

	if (error || !webhook) {
		return false;
	}

	if (webhook.account_id === userId) {
		return true;
	}

	if (webhook.form_id) {
		const { data: form } = await supabase
			.from("forms")
			.select("id, user_id")
			.eq("id", webhook.form_id)
			.eq("user_id", userId)
			.single();

		if (form) {
			return true;
		}
	}

	return false;
}

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const startTime = Date.now();
	const webhookId = (await params).id;
	console.log(
		`[WEBHOOK API] POST /api/webhook/${webhookId}/resend - Started at ${new Date().toISOString()}`,
	);

	try {
		const supabase = await createClient();
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const hasAccess = await verifyWebhookOwnership(webhookId, user.id);
		if (!hasAccess) {
			return NextResponse.json(
				{ error: "Webhook not found or access denied" },
				{ status: 403 },
			);
		}

		const body = await req.json();
		console.log(
			`[WEBHOOK API] POST /api/webhook/${webhookId}/resend - Request body:`,
			JSON.stringify(body, null, 2),
		);

		if (!body.logId) {
			console.error(
				`[WEBHOOK API] POST /api/webhook/${webhookId}/resend - Missing logId in request body`,
			);
			return NextResponse.json(
				{ error: "Missing logId in request body" },
				{ status: 400 },
			);
		}

		const result = await resendWebhookDelivery(webhookId, body);

		const duration = Date.now() - startTime;
		console.log(
			`[WEBHOOK API] POST /api/webhook/${webhookId}/resend - Success: Resend completed in ${duration}ms`,
		);

		return NextResponse.json(result);
	} catch (error: unknown) {
		const duration = Date.now() - startTime;
		const errorMessage =
			error instanceof Error
				? error.message
				: "Failed to resend webhook delivery";
		console.error(
			`[WEBHOOK API] POST /api/webhook/${webhookId}/resend - Error after ${duration}ms:`,
			errorMessage,
		);

		return NextResponse.json(
			{
				error: errorMessage,
			},
			{ status: 400 },
		);
	}
}
