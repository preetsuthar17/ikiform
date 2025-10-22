import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();

    // Calculate the date 14 days ago
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    // First, let's check what users exist with the criteria
    const { data: debugUsers } = await supabase
      .from("users")
      .select("uid, email, name, has_premium, has_free_trial, created_at")
      .eq("has_premium", true)
      .eq("has_free_trial", true);

    console.log(
      `Found ${debugUsers?.length || 0} users with has_premium=true and has_free_trial=true`
    );
    console.log("Debug users:", debugUsers);
    console.log("14 days ago threshold:", fourteenDaysAgo.toISOString());

    // Update users who were created 14+ days ago and have both has_premium=true and has_free_trial=true
    const { data, error } = await supabase
      .from("users")
      .update({
        has_premium: false,
        has_free_trial: false,
        updated_at: new Date().toISOString(),
      })
      .eq("has_premium", true)
      .eq("has_free_trial", true)
      .lte("created_at", fourteenDaysAgo.toISOString())
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
