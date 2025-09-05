import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from("users").select("email");
    if (error) {
      return NextResponse.json(
        { emails: [], error: error.message },
        { status: 500 }
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
