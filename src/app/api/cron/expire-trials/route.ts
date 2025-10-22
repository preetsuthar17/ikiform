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

    // Calculate the date 5 minutes ago (for testing)
    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

    // Update users who were created 5+ minutes ago and still have free trial
    const { data, error } = await supabase
      .from("users")
      .update({
        has_premium: false,
        has_free_trial: false,
        updated_at: new Date().toISOString(),
      })
      .eq("has_free_trial", true)
      .lte("created_at", fiveMinutesAgo.toISOString())
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
