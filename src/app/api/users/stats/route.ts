import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET() {
	try {
		const supabase = createAdminClient();

		const [countResult, usersResult] = await Promise.all([
			supabase.from("users").select("*", { count: "exact", head: true }),
			supabase
				.from("users")
				.select("name")
				.order("created_at", { ascending: false })
				.limit(5),
		]);

		if (countResult.error) {
			console.error("[USERS_STATS] Count error:", countResult.error);
			return NextResponse.json(
				{ count: null, users: [], error: countResult.error.message },
				{ status: 500 }
			);
		}

		if (usersResult.error) {
			console.error("[USERS_STATS] Users error:", usersResult.error);
			return NextResponse.json(
				{
					count: countResult.count ?? 0,
					users: [],
					error: usersResult.error.message,
				},
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{
				count: countResult.count ?? 0,
				users: (usersResult.data ?? []).map((user) => ({
					name: user.name || null,
				})),
			},
			{
				headers: {
					"content-type": "application/json",
					"cache-control": "s-maxage=300, stale-while-revalidate=600",
				},
			}
		);
	} catch (error) {
		console.error("[USERS_STATS]", error);
		return NextResponse.json({ count: null, users: [] }, { status: 500 });
	}
}
