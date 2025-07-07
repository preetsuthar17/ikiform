// External imports
import { NextRequest, NextResponse } from "next/server";

// Internal imports
import { createClient } from "@/utils/supabase/server";
import {
  sendWelcomeEmail,
  sendNewLoginEmail,
} from "@/lib/services/notifications";

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
      user_metadata?.full_name ||
      user_metadata?.name ||
      user_metadata?.user_name ||
      email.split("@")[0] ||
      "";

    const { data: existingUser } = await supabase
      .from("users")
      .select("email")
      .eq("email", email)
      .single();

    if (existingUser) {
      // Existing user: send new login email
      await sendNewLoginEmail({ to: email, name });
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
        email,
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
    await sendWelcomeEmail({ to: email, name });

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
