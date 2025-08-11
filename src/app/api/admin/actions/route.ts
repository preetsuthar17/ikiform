import { type NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

const FOUNDER_USER_ID = "2be7479a-bf3c-4951-ab71-65bb148b235c";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user || user.id !== FOUNDER_USER_ID) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, ...params } = body;

    const adminSupabase = createAdminClient();

    switch (action) {
      case "toggle_user_premium": {
        const { email, hasPremium } = params;

        const { error } = await adminSupabase
          .from("users")
          .update({ has_premium: hasPremium })
          .eq("email", email);

        if (error) throw error;

        return NextResponse.json({
          success: true,
          message: `User premium status ${hasPremium ? "granted" : "removed"}`,
        });
      }

      case "delete_form": {
        const { formId } = params;

        await adminSupabase
          .from("form_submissions")
          .delete()
          .eq("form_id", formId);

        const { error } = await adminSupabase
          .from("forms")
          .delete()
          .eq("id", formId);

        if (error) throw error;

        return NextResponse.json({
          success: true,
          message: "Form and all its submissions deleted successfully",
        });
      }

      case "delete_user": {
        const { uid } = params;

        const { data: userForms } = await adminSupabase
          .from("forms")
          .select("id")
          .eq("user_id", uid);

        if (userForms && userForms.length > 0) {
          const formIds = userForms.map((f: any) => f.id);

          await adminSupabase
            .from("form_submissions")
            .delete()
            .in("form_id", formIds);

          await adminSupabase.from("forms").delete().eq("user_id", uid);
        }

        await adminSupabase.from("ai_builder_chat").delete().eq("user_id", uid);

        await adminSupabase
          .from("ai_analytics_chat")
          .delete()
          .eq("user_id", uid);

        const { error } = await adminSupabase
          .from("users")
          .delete()
          .eq("uid", uid);

        if (error) throw error;

        return NextResponse.json({
          success: true,
          message: "User and all associated data deleted successfully",
        });
      }

      case "delete_submission": {
        const { submissionId } = params;

        const { error } = await adminSupabase
          .from("form_submissions")
          .delete()
          .eq("id", submissionId);

        if (error) throw error;

        return NextResponse.json({
          success: true,
          message: "Submission deleted successfully",
        });
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Admin action error:", error);
    return NextResponse.json(
      { error: "Failed to perform admin action" },
      { status: 500 },
    );
  }
}
