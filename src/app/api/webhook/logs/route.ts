import { type NextRequest, NextResponse } from "next/server";
import { getWebhookLogs } from "@/lib/webhooks/outbound";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: NextRequest) {
	const startTime = Date.now();
	console.log(
		`[WEBHOOK API] GET /api/webhook/logs - Started at ${new Date().toISOString()}`
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

		const { searchParams } = new URL(req.url);
		const webhookId = searchParams.get("webhookId") || undefined;
		const formId = searchParams.get("formId") || undefined;
		const accountId = searchParams.get("accountId") || undefined;

		if (accountId && accountId !== user.id) {
			return NextResponse.json(
				{ error: "Cannot access other users' webhook logs" },
				{ status: 403 }
			);
		}

		if (formId) {
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

		console.log(
			`[WEBHOOK API] GET /api/webhook/logs - Params: webhookId=${webhookId}, formId=${formId}, accountId=${accountId || user.id}`
		);

		const logs = await getWebhookLogs({
			webhookId,
			formId,
			accountId: accountId || user.id,
			userId: user.id,
		});

		const duration = Date.now() - startTime;
		console.log(
			`[WEBHOOK API] GET /api/webhook/logs - Success: Found ${logs.length} logs in ${duration}ms`
		);

		return NextResponse.json(logs);
	} catch (error: unknown) {
		const duration = Date.now() - startTime;
		const errorMessage =
			error instanceof Error ? error.message : "Failed to fetch webhook logs";
		console.error(
			`[WEBHOOK API] GET /api/webhook/logs - Error after ${duration}ms:`,
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
