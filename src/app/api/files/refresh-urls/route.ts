import { type NextRequest, NextResponse } from "next/server";
import { refreshSignedUrls } from "@/lib/storage/supabase-storage";

export async function POST(request: NextRequest) {
	try {
		const { filePaths, expiresIn = 86_400 } = await request.json();

		if (!(filePaths && Array.isArray(filePaths))) {
			return NextResponse.json(
				{ error: "filePaths array is required" },
				{ status: 400 },
			);
		}

		const signedUrls = await refreshSignedUrls(filePaths, expiresIn);

		return NextResponse.json({
			success: true,
			signedUrls,
		});
	} catch (error) {
		console.error("Refresh URLs error:", error);
		return NextResponse.json(
			{ error: "Failed to refresh URLs" },
			{ status: 500 },
		);
	}
}
