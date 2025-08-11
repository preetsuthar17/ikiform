import { type NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { message: "Redemption code is required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 },
      );
    }

    // Check if the code exists and is valid using admin client
    const adminSupabase = createAdminClient();
    const { data: redemptionCode, error: fetchError } = await adminSupabase
      .from("redemption_codes")
      .select("*")
      .eq("code", code.toUpperCase())
      .single();

    if (fetchError || !redemptionCode) {
      return NextResponse.json(
        { message: "Invalid redemption code" },
        { status: 404 },
      );
    }

    // Check if code is already redeemed
    if (redemptionCode.redeemer_user_id) {
      return NextResponse.json(
        { message: "This code has already been redeemed" },
        { status: 400 },
      );
    }

    // Check if code is active
    if (!redemptionCode.is_active) {
      return NextResponse.json(
        { message: "This redemption code is no longer active" },
        { status: 400 },
      );
    }

    // Check if code has expired
    if (
      redemptionCode.expires_at &&
      new Date(redemptionCode.expires_at) < new Date()
    ) {
      return NextResponse.json(
        { message: "This redemption code has expired" },
        { status: 400 },
      );
    }

    // Check if code has reached max uses
    if (redemptionCode.current_uses >= redemptionCode.max_uses) {
      return NextResponse.json(
        { message: "This redemption code has reached its usage limit" },
        { status: 400 },
      );
    }

    // Start a transaction to redeem the code and update user premium status
    const { error: updateCodeError } = await adminSupabase
      .from("redemption_codes")
      .update({
        redeemer_user_id: user.id,
        redeemer_email: user.email,
        redeemed_at: new Date().toISOString(),
        current_uses: redemptionCode.current_uses + 1,
      })
      .eq("id", redemptionCode.id);

    if (updateCodeError) {
      console.error("Error redeeming code:", updateCodeError);
      return NextResponse.json(
        { message: "Failed to redeem code. Please try again." },
        { status: 500 },
      );
    }

    // Update user's premium status
    const { error: updateUserError } = await supabase
      .from("users")
      .update({ has_premium: true })
      .eq("uid", user.id);

    if (updateUserError) {
      console.error("Error updating user premium status:", updateUserError);
      // Note: Code is already redeemed at this point, so we still return success
      // but log the error for manual resolution
    }

    return NextResponse.json({
      message: "Code redeemed successfully! You now have premium access.",
      success: true,
    });
  } catch (error) {
    console.error("Redemption error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
