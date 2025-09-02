import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (error) {
      return NextResponse.json(
        { count: null, error: error.message },
        { status: 500 }
      );
    }

    return new NextResponse(
      JSON.stringify({ count: count ?? 0 }),
      {
        headers: {
          'content-type': 'application/json',
          'cache-control': 's-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch {
    return NextResponse.json({ count: null }, { status: 500 });
  }
}


