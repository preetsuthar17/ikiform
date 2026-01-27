import { type NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
	try {
		const authHeader = request.headers.get("authorization");
		const vercelCronHeader = request.headers.get("x-vercel-cron");

		const hasValidAuth = authHeader === `Bearer ${process.env.CRON_SECRET}`;
		const isVercelCron = vercelCronHeader !== null;

		if (!(hasValidAuth || isVercelCron)) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const supabase = createAdminClient();
		const now = new Date();
		const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
		const thresholdISO = fourteenDaysAgo.toISOString();

		const { data: debugUsers } = await supabase
			.from("users")
			.select("uid, email, name, has_premium, has_free_trial, created_at")
			.eq("has_premium", true)
			.eq("has_free_trial", true);

		console.log(
			`Found ${debugUsers?.length || 0} users with has_premium=true and has_free_trial=true`
		);
		console.log("14 days ago threshold:", thresholdISO);

		const { data, error } = await supabase
			.from("users")
			.update({
				has_premium: false,
				has_free_trial: false,
				updated_at: new Date().toISOString(),
			})
			.eq("has_premium", true)
			.eq("has_free_trial", true)
			.lt("created_at", thresholdISO)
			.select("uid, email, name");

		if (error) {
			console.error("Error updating trial users:", error);
			return NextResponse.json(
				{ error: "Failed to update users", details: error.message },
				{ status: 500 }
			);
		}

		console.log(`Updated ${data?.length || 0} users from trial to free`);

		return NextResponse.json({
			success: true,
			message: `Updated ${data?.length || 0} users from trial to free`,
			updatedUsers: data,
		});
	} catch (error) {
		console.error("[Cron] Expire trials error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
