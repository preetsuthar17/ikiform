import { type NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

const FOUNDER_USER_ID = "2be7479a-bf3c-4951-ab71-65bb148b235c";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user || user.id !== FOUNDER_USER_ID) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminSupabase = createAdminClient();

    const { data: users, error: usersError } = await adminSupabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (usersError) {
      console.error("Error fetching users:", usersError);
      throw usersError;
    }

    const { data: forms, error: formsError } = await adminSupabase
      .from("forms")
      .select(
        "id, user_id, title, description, is_published, created_at, updated_at, slug",
      )
      .order("created_at", { ascending: false });

    if (formsError) {
      console.error("Error fetching forms:", formsError);
      throw formsError;
    }

    const { data: submissions, error: submissionsError } = await adminSupabase
      .from("form_submissions")
      .select("*")
      .order("submitted_at", { ascending: false })
      .limit(500);

    if (submissionsError) {
      console.error("Error fetching submissions:", submissionsError);
      throw submissionsError;
    }

    return NextResponse.json({
      users: users || [],
      forms: forms || [],
      submissions: submissions || [],
    });
  } catch (error) {
    console.error("Admin API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin data" },
      { status: 500 },
    );
  }
}
