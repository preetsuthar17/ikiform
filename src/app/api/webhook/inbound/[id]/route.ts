import { type NextRequest, NextResponse } from "next/server";
import {
	deleteInboundMapping,
	updateInboundMapping,
} from "@/lib/webhooks/inbound";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

async function verifyInboundMappingOwnership(
	mappingId: string,
	userId: string,
): Promise<boolean> {
	const supabase = createAdminClient();
	const { data: mapping, error } = await supabase
		.from("inbound_webhook_mappings")
		.select("id, target_form_id")
		.eq("id", mappingId)
		.single();

	if (error || !mapping) {
		return false;
	}

	if (mapping.target_form_id) {
		const { data: form } = await supabase
			.from("forms")
			.select("id, user_id")
			.eq("id", mapping.target_form_id)
			.eq("user_id", userId)
			.single();

		return !!form;
	}

	return false;
}

export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const startTime = Date.now();
	const mappingId = (await params).id;
	console.log(
		`[WEBHOOK API] PUT /api/webhook/inbound/${mappingId} - Started at ${new Date().toISOString()}`,
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

		const hasAccess = await verifyInboundMappingOwnership(mappingId, user.id);
		if (!hasAccess) {
			return NextResponse.json(
				{ error: "Mapping not found or access denied" },
				{ status: 403 },
			);
		}

		const body = await req.json();
		console.log(
			`[WEBHOOK API] PUT /api/webhook/inbound/${mappingId} - Request body:`,
			JSON.stringify(body, null, 2),
		);

		if (!body) {
			console.error(
				`[WEBHOOK API] PUT /api/webhook/inbound/${mappingId} - Missing request body`,
			);
			return NextResponse.json(
				{ error: "Missing request body" },
				{ status: 400 },
			);
		}

		if (body.targetFormId) {
			const { data: form, error: formError } = await supabase
				.from("forms")
				.select("id, user_id")
				.eq("id", body.targetFormId)
				.eq("user_id", user.id)
				.single();

			if (formError || !form) {
				return NextResponse.json(
					{ error: "Form not found or access denied" },
					{ status: 403 },
				);
			}
		}

		const mapping = await updateInboundMapping(mappingId, body);

		const duration = Date.now() - startTime;
		console.log(
			`[WEBHOOK API] PUT /api/webhook/inbound/${mappingId} - Success: Updated mapping in ${duration}ms`,
		);

		return NextResponse.json(mapping);
	} catch (error: unknown) {
		const duration = Date.now() - startTime;
		const errorMessage =
			error instanceof Error
				? error.message
				: "Failed to update inbound mapping";
		console.error(
			`[WEBHOOK API] PUT /api/webhook/inbound/${mappingId} - Error after ${duration}ms:`,
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

export async function DELETE(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const startTime = Date.now();
	const mappingId = (await params).id;
	console.log(
		`[WEBHOOK API] DELETE /api/webhook/inbound/${mappingId} - Started at ${new Date().toISOString()}`,
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

		const hasAccess = await verifyInboundMappingOwnership(mappingId, user.id);
		if (!hasAccess) {
			return NextResponse.json(
				{ error: "Mapping not found or access denied" },
				{ status: 403 },
			);
		}

		await deleteInboundMapping(mappingId);

		const duration = Date.now() - startTime;
		console.log(
			`[WEBHOOK API] DELETE /api/webhook/inbound/${mappingId} - Success: Deleted mapping in ${duration}ms`,
		);

		return NextResponse.json({ success: true });
	} catch (error: unknown) {
		const duration = Date.now() - startTime;
		const errorMessage =
			error instanceof Error
				? error.message
				: "Failed to delete inbound mapping";
		console.error(
			`[WEBHOOK API] DELETE /api/webhook/inbound/${mappingId} - Error after ${duration}ms:`,
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
