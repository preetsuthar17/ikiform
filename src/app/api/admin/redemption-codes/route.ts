import { type NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

// Create single or bulk redemption codes
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = await createClient();

    // Get the authenticated user for admin check
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

    // Check if user is admin
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("email")
      .eq("uid", user.id)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Simple admin check - replace with your admin logic
    const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
    if (!adminEmails.includes(userData.email)) {
      return NextResponse.json(
        { message: "Admin access required" },
        { status: 403 },
      );
    }

    const adminSupabase = createAdminClient();

    // Handle bulk insert
    if (body.codes && Array.isArray(body.codes)) {
      return handleBulkInsert(adminSupabase, body.codes);
    }

    // Handle single code creation
    const { code, maxUses = 1, expiresAt = null } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { message: "Code is required" },
        { status: 400 },
      );
    }

    const { data, error } = await adminSupabase
      .from("redemption_codes")
      .insert({
        code: code.toUpperCase(),
        max_uses: maxUses,
        expires_at: expiresAt,
        is_active: true,
        current_uses: 0,
        metadata: {},
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        // Unique constraint violation
        return NextResponse.json(
          { message: "This code already exists" },
          { status: 400 },
        );
      }
      throw error;
    }

    return NextResponse.json({
      message: "Redemption code created successfully",
      code: data,
    });
  } catch (error) {
    console.error("Error creating redemption code:", error);
    return NextResponse.json(
      { message: "Failed to create redemption code" },
      { status: 500 },
    );
  }
}

async function handleBulkInsert(adminSupabase: any, codes: string[]) {
  try {
    // Prepare codes for insertion
    const codeRows = codes.map((code: string) => ({
      code: code.toUpperCase(),
      is_active: true,
      max_uses: 1,
      current_uses: 0,
      metadata: {},
    }));

    // Insert codes in batches to avoid timeout
    const batchSize = 100;
    const results = [];

    for (let i = 0; i < codeRows.length; i += batchSize) {
      const batch = codeRows.slice(i, i + batchSize);

      const { data, error } = await adminSupabase
        .from("redemption_codes")
        .insert(batch)
        .select("id, code");

      if (error) {
        console.error("Error inserting batch:", error);
        return NextResponse.json(
          {
            message: `Failed to insert codes. Error at batch starting at index ${i}: ${error.message}`,
            insertedCount: results.length,
          },
          { status: 500 },
        );
      }

      results.push(...(data || []));
    }

    return NextResponse.json({
      message: `Successfully inserted ${results.length} redemption codes`,
      insertedCount: results.length,
      success: true,
    });
  } catch (error) {
    console.error("Bulk insert error:", error);
    return NextResponse.json(
      { message: "Internal server error during bulk insert" },
      { status: 500 },
    );
  }
}
