'use server';

// External imports
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Function to create a Supabase client
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignored: `setAll` called from a Server Component
          }
        },
      },
    }
  );
}
