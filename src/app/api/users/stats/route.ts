import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET() {
	try {
		const supabase = createAdminClient();

		const [countResult, usersResult] = await Promise.all([
			supabase.from("users").select("*", { count: "exact", head: true }),
			supabase
				.from("users")
				.select("name, email")
				.order("created_at", { ascending: false })
				.limit(5),
		]);

		if (countResult.error) {
			return NextResponse.json(
				{ count: null, users: [], error: countResult.error.message },
				{ status: 500 },
			);
		}

		return NextResponse.json(
			{
				count: countResult.count ?? 0,
				users: usersResult.data ?? [],
			},
			{
				headers: {
					"content-type": "application/json",
					"cache-control": "s-maxage=300, stale-while-revalidate=600",
				},
			},
		);
	} catch {
		return NextResponse.json({ count: null, users: [] }, { status: 500 });
	}
}
