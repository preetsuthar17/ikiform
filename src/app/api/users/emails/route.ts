import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
	try {
		const supabase = await createClient();
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user?.email || user.email !== "preetsutharxd@gmail.com") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const adminSupabase = createAdminClient();
		const { data, error } = await adminSupabase.from("users").select("email");
		if (error) {
			return NextResponse.json(
				{ emails: [], error: error.message },
				{ status: 500 },
			);
		}
		const emails = (data || [])
			.map((r: { email: string }) => r.email)
			.filter(Boolean);
		return new NextResponse(JSON.stringify({ emails }), {
			headers: {
				"content-type": "application/json",
				"cache-control": "no-store",
			},
		});
	} catch (e) {
		return NextResponse.json({ emails: [] }, { status: 500 });
	}
}
