import { type NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
	try {
		const format = new URL(req.url).searchParams.get("format") || "array";

		if (format === "array") {
			return NextResponse.json(["Apple", "Banana", "Cherry"]);
		}

		if (format === "object-array") {
			return NextResponse.json([
				{ value: "apple", label: "Apple" },
				{ value: "banana", label: "Banana" },
				{ value: "cherry", label: "Cherry" },
			]);
		}
		if (format === "object") {
			return NextResponse.json({
				options: [
					{ value: "apple", label: "Apple" },
					{ value: "banana", label: "Banana" },
					{ value: "cherry", label: "Cherry" },
				],
			});
		}

		return NextResponse.json(["Apple", "Banana", "Cherry"]);
	} catch (error) {
		console.error("[DEMO_OPTIONS]", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
