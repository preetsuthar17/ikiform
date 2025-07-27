import { type NextRequest, NextResponse } from 'next/server';
import { formsDbServer } from '@/lib/database';
import { requirePremium } from '@/lib/utils/premium-check';
import { createClient } from '@/utils/supabase/server';

// Get all chat sessions for a user
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check premium status
    const premiumCheck = await requirePremium(user.id);
    if (!premiumCheck.hasPremium) {
      return premiumCheck.error;
    }

    const { searchParams } = new URL(req.url);
    const limit = Number.parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type') || 'both'; // "builder", "analytics", or "both"

    let sessions: any[] = [];

    if (type === 'builder' || type === 'both') {
      const builderSessions = await formsDbServer.getAIBuilderSessions(
        user.id,
        limit
      );
      sessions = sessions.concat(
        builderSessions.map((session: any) => ({
          ...session,
          type: 'ai_builder',
        }))
      );
    }

    if (type === 'analytics' || type === 'both') {
      const analyticsSessions = await formsDbServer.getAIAnalyticsSessions(
        user.id,
        '',
        limit
      );
      sessions = sessions.concat(
        analyticsSessions.map((session: any) => ({
          ...session,
          type: 'ai_analytics',
        }))
      );
    }

    // Sort by created_at desc
    sessions.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // Take only the requested limit
    if (sessions.length > limit) {
      sessions = sessions.slice(0, limit);
    }

    return NextResponse.json({
      success: true,
      data: {
        sessions,
        count: sessions.length,
      },
    });
  } catch (error) {
    console.error('Error fetching chat sessions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
