import { type NextRequest, NextResponse } from "next/server";
import { createWebhook, getWebhooks } from "@/lib/webhooks/outbound";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
	const startTime = Date.now();
	console.log(
		`[WEBHOOK API] GET /api/webhook - Started at ${new Date().toISOString()}`
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
		const formId = searchParams.get("formId") || undefined;
		const accountId = searchParams.get("accountId") || undefined;

		if (accountId && accountId !== user.id) {
			return NextResponse.json(
				{ error: "Cannot access other users' webhooks" },
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
			`[WEBHOOK API] GET /api/webhook - Params: formId=${formId}, accountId=${accountId || user.id}`
		);

		const webhooks = await getWebhooks({
			formId,
			accountId: accountId || user.id,
			userId: user.id,
		});

		const duration = Date.now() - startTime;
		console.log(
			`[WEBHOOK API] GET /api/webhook - Success: Found ${webhooks.length} webhooks in ${duration}ms`
		);

		return NextResponse.json(webhooks);
	} catch (error: unknown) {
		const duration = Date.now() - startTime;
		const errorMessage =
			error instanceof Error ? error.message : "Failed to list webhooks";
		console.error(
			`[WEBHOOK API] GET /api/webhook - Error after ${duration}ms:`,
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

export async function POST(req: NextRequest): Promise<NextResponse> {
	const startTime = Date.now();
	console.log(
		`[WEBHOOK API] POST /api/webhook - Started at ${new Date().toISOString()}`
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

		const body = await req.json();
		console.log(
			"[WEBHOOK API] POST /api/webhook - Request body:",
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

		const webhookData = {
			...body,
			accountId: user.id,
			account_id: user.id,
		};

		const webhook = await createWebhook(webhookData, user.id);

		const duration = Date.now() - startTime;
		console.log(
			`[WEBHOOK API] POST /api/webhook - Success: Created webhook ${webhook.id} in ${duration}ms`
		);

		return NextResponse.json(webhook, { status: 201 });
	} catch (error: unknown) {
		const duration = Date.now() - startTime;
		const errorMessage =
			error instanceof Error ? error.message : "Failed to create webhook";
		console.error(
			`[WEBHOOK API] POST /api/webhook - Error after ${duration}ms:`,
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
