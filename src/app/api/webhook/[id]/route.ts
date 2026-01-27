import { type NextRequest, NextResponse } from "next/server";
import { deleteWebhook, updateWebhook } from "@/lib/webhooks/outbound";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

async function verifyWebhookOwnership(
	webhookId: string,
	userId: string
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

export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const startTime = Date.now();
	const webhookId = (await params).id;
	console.log(
		`[WEBHOOK API] PUT /api/webhook/${webhookId} - Started at ${new Date().toISOString()}`
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
				{ status: 403 }
			);
		}

		const body = await req.json();
		console.log(
			`[WEBHOOK API] PUT /api/webhook/${webhookId} - Request body:`,
			JSON.stringify(body, null, 2)
		);

		if (body.formId || body.form_id) {
			const formId = body.formId || body.form_id;
			const { data: form, error: formError } = await supabase
				.from("forms")
				.select("id, user_id")
				.eq("id", formId)
				.eq("user_id", user.id)
				.single();

			if (formError || !form) {
				return NextResponse.json(
					{ error: "Form not found or access denied" },
					{ status: 403 }
				);
			}
		}

		const updateData = {
			...body,
			accountId: user.id,
			account_id: user.id,
		};

		const webhook = await updateWebhook(webhookId, updateData, user.id);

		const duration = Date.now() - startTime;
		console.log(
			`[WEBHOOK API] PUT /api/webhook/${webhookId} - Success: Updated webhook in ${duration}ms`
		);

		return NextResponse.json(webhook);
	} catch (error: unknown) {
		const duration = Date.now() - startTime;
		const errorMessage =
			error instanceof Error ? error.message : "Failed to update webhook";
		console.error(
			`[WEBHOOK API] PUT /api/webhook/${webhookId} - Error after ${duration}ms:`,
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

export async function DELETE(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const startTime = Date.now();
	const webhookId = (await params).id;
	console.log(
		`[WEBHOOK API] DELETE /api/webhook/${webhookId} - Started at ${new Date().toISOString()}`
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
				{ status: 403 }
			);
		}

		await deleteWebhook(webhookId, user.id);

		const duration = Date.now() - startTime;
		console.log(
			`[WEBHOOK API] DELETE /api/webhook/${webhookId} - Success: Deleted webhook in ${duration}ms`
		);

		return NextResponse.json({ success: true });
	} catch (error: unknown) {
		const duration = Date.now() - startTime;
		const errorMessage =
			error instanceof Error ? error.message : "Failed to delete webhook";
		console.error(
			`[WEBHOOK API] DELETE /api/webhook/${webhookId} - Error after ${duration}ms:`,
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
