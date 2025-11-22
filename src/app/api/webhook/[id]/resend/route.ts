import { type NextRequest, NextResponse } from "next/server";
import { resendWebhookDelivery } from "@/lib/webhooks/outbound";

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
