import { type NextRequest, NextResponse } from "next/server";
import {
	createInboundMapping,
	getInboundMappings,
} from "@/lib/webhooks/inbound";

export async function GET(req: NextRequest) {
	const startTime = Date.now();
	console.log(
		`[WEBHOOK API] GET /api/webhook/inbound - Started at ${new Date().toISOString()}`,
	);

	try {
		const { searchParams } = new URL(req.url);
		const targetFormId = searchParams.get("targetFormId") || undefined;

		console.log(
			`[WEBHOOK API] GET /api/webhook/inbound - Params: targetFormId=${targetFormId}`,
		);

		const mappings = await getInboundMappings({ targetFormId });

		const duration = Date.now() - startTime;
		console.log(
			`[WEBHOOK API] GET /api/webhook/inbound - Success: Found ${mappings.length} mappings in ${duration}ms`,
		);

		return NextResponse.json(mappings);
	} catch (error: unknown) {
		const duration = Date.now() - startTime;
		const errorMessage =
			error instanceof Error
				? error.message
				: "Failed to list inbound mappings";
		console.error(
			`[WEBHOOK API] GET /api/webhook/inbound - Error after ${duration}ms:`,
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

export async function POST(req: NextRequest) {
	const startTime = Date.now();
	console.log(
		`[WEBHOOK API] POST /api/webhook/inbound - Started at ${new Date().toISOString()}`,
	);

	try {
		const body = await req.json();
		console.log(
			"[WEBHOOK API] POST /api/webhook/inbound - Request body:",
			JSON.stringify(body, null, 2),
		);

		if (!(body.endpoint && body.targetFormId && body.mappingRules)) {
			console.error(
				"[WEBHOOK API] POST /api/webhook/inbound - Missing required fields: endpoint, targetFormId, mappingRules",
			);
			return NextResponse.json(
				{
					error:
						"Missing required fields: endpoint, targetFormId, mappingRules",
				},
				{ status: 400 },
			);
		}

		const mapping = await createInboundMapping(body);

		const duration = Date.now() - startTime;
		console.log(
			`[WEBHOOK API] POST /api/webhook/inbound - Success: Created mapping ${mapping.id} in ${duration}ms`,
		);

		return NextResponse.json(mapping, { status: 201 });
	} catch (error: unknown) {
		const duration = Date.now() - startTime;
		const errorMessage =
			error instanceof Error
				? error.message
				: "Failed to create inbound mapping";
		console.error(
			`[WEBHOOK API] POST /api/webhook/inbound - Error after ${duration}ms:`,
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
