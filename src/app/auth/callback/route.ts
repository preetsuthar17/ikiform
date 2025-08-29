import { type NextRequest, NextResponse } from 'next/server';
import {
  sendNewLoginEmail,
  sendWelcomeEmail,
} from '@/lib/services/notifications';

import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { data: sessionData, error: sessionError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (!sessionError && sessionData?.session) {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser(sessionData.session.access_token);

      if (user && !userError) {
        const { id: uid, email, user_metadata } = user;

        if (email) {
          const name =
            user_metadata?.full_name ||
            user_metadata?.name ||
            user_metadata?.user_name ||
            email.split('@')[0] ||
            '';
          const { data: existingUser } = await supabase
            .from('users')
            .select('email, has_premium, polar_customer_id')
            .eq('email', email)
            .single();
          const isNewUser = !existingUser;

          let upsertData;
          if (isNewUser) {
            upsertData = {
              uid,
              name,
              email,
              has_premium: false,
              polar_customer_id: null,
            };
          } else {
            upsertData = {
              uid,
              name,
              email,
              has_premium: existingUser.has_premium,
              polar_customer_id: existingUser.polar_customer_id,
            };
          }

          const { error: upsertError } = await supabase
            .from('users')
            .upsert(upsertData, { onConflict: 'email' });

          if (!upsertError) {
            if (isNewUser) {
              await sendWelcomeEmail({ to: email, name });
            } else {
              await sendNewLoginEmail({ to: email, name });
            }
          }
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
