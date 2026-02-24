import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json().catch(() => null);
		const accessToken =
			typeof body?.accessToken === "string" ? body.accessToken : "";
		const refreshToken =
			typeof body?.refreshToken === "string" ? body.refreshToken : "";

		if (!(accessToken && refreshToken)) {
			return NextResponse.json(
				{ error: "Invalid session payload" },
				{ status: 400 }
			);
		}

		const supabase = await createClient();
		const { error: setSessionError } = await supabase.auth.setSession({
			access_token: accessToken,
			refresh_token: refreshToken,
		});

		if (setSessionError) {
			return NextResponse.json(
				{ error: "Failed to sync session" },
				{ status: 401 }
			);
		}

		const {
			data: { user },
			error: userError,
		} = await supabase.auth.getUser();

		if (userError || !user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("[sync-session] POST error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
