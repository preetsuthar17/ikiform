import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { sendWelcomeEmail } from "@/lib/email";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  let next = searchParams.get("next") ?? "/";
  if (!next.startsWith("/")) {
    next = "/";
  }

  if (code) {
    const supabase = await createClient();
    const { data: sessionData, error: sessionError } =
      await supabase.auth.exchangeCodeForSession(code);
    if (!sessionError && sessionData?.session?.access_token) {
      // Use the access_token directly to get the user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser(sessionData.session.access_token);
      if (user && !userError) {
        const { id: uid, email, user_metadata } = user;
        const name =
          user_metadata?.full_name ||
          user_metadata?.name ||
          user_metadata?.user_name ||
          email?.split("@")[0] ||
          "";

        // Check if user already exists
        const { data: existingUser } = await supabase
          .from("users")
          .select("email")
          .eq("email", email)
          .single();

        const isNewUser = !existingUser;

        // Upsert user into users table
        const { error: upsertError } = await supabase
          .from("users")
          .upsert({ uid, name, email }, { onConflict: "email" });
        if (upsertError) {
          return NextResponse.redirect(`${origin}/auth/error`);
        }

        // Send welcome email only for new users
        if (isNewUser) {
          sendWelcomeEmail(email!, name).catch(() => {});
        }
      } else {
        return NextResponse.redirect(`${origin}/auth/error`);
      }
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`);
}
