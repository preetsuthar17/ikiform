import { type NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const formId = searchParams.get("formId");

		if (!formId) {
			return NextResponse.json(
				{ error: "Form ID is required" },
				{ status: 400 },
			);
		}

		const supabase = await createClient();
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user?.email || user.email !== "preetsutharxd@gmail.com") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const adminSupabase = createAdminClient();

		const { data: form, error: formError } = await adminSupabase
			.from("forms")
			.select("*")
			.eq("id", formId)
			.single();

		if (formError) {
			console.error("Error fetching form:", formError);
			return NextResponse.json(
				{ error: "Failed to fetch form" },
				{ status: 500 },
			);
		}

		const { data: submissions, error: submissionsError } = await adminSupabase
			.from("form_submissions")
			.select("*")
			.eq("form_id", formId)
			.order("submitted_at", { ascending: false });

		if (submissionsError) {
			console.error("Error fetching form submissions:", submissionsError);
			return NextResponse.json(
				{ error: "Failed to fetch form submissions" },
				{ status: 500 },
			);
		}

		return NextResponse.json({
			form,
			submissions: submissions || [],
		});
	} catch (error) {
		console.error("Admin form submissions API error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
