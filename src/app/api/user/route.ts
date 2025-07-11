// External imports
import { NextRequest, NextResponse } from "next/server";

// Internal imports
import { createClient } from "@/utils/supabase/server";
import {
  sendWelcomeEmail,
  sendNewLoginEmail,
} from "@/lib/services/notifications";
import { sanitizeString } from "@/lib/utils/sanitize";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: uid, email, user_metadata } = user;

    if (!email) {
      return NextResponse.json({ error: "No email found" }, { status: 400 });
    }

    const name =
      sanitizeString(user_metadata?.full_name) ||
      sanitizeString(user_metadata?.name) ||
      sanitizeString(user_metadata?.user_name) ||
      sanitizeString(email.split("@")[0]) ||
      "";
    const sanitizedEmail = sanitizeString(email);

    const { data: existingUser } = await supabase
      .from("users")
      .select("email")
      .eq("email", sanitizedEmail)
      .single();

    if (existingUser) {
      // Existing user: send new login email
      await sendNewLoginEmail({ to: sanitizedEmail, name });
      return NextResponse.json({
        success: true,
        message: "User already exists",
        user: existingUser,
        isNewUser: false,
      });
    }

    const { data, error: insertError } = await supabase
      .from("users")
      .insert({
        uid,
        name,
        email: sanitizedEmail,
        has_premium: false,
        polar_customer_id: null,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: "Failed to create user", details: insertError.message },
        { status: 500 },
      );
    }

    // New user: send welcome email
    await sendWelcomeEmail({ to: sanitizedEmail, name });

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      user: data,
      isNewUser: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", user.email)
      .single();

    if (error) {
      return NextResponse.json(
        { error: "User not found in database", details: error.message },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      user: data,
      authUser: {
        id: user.id,
        email: user.email,
        metadata: user.user_metadata,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
