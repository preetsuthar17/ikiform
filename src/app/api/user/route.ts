import { type NextRequest, NextResponse } from 'next/server';
import {
  sendNewLoginEmail,
  sendWelcomeEmail,
} from '@/lib/services/notifications';
import { sanitizeString } from '@/lib/utils/sanitize';
import { createClient } from '@/utils/supabase/server';

const userCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 30000;

function getCachedUser(email: string) {
  const cached = userCache.get(email);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
}

function setCachedUser(email: string, data: any) {
  userCache.set(email, { data, timestamp: Date.now() });
  if (userCache.size > 1000) {
    const cutoff = Date.now() - CACHE_TTL;
    for (const [key, value] of userCache.entries()) {
      if (value.timestamp < cutoff) {
        userCache.delete(key);
      }
    }
  }
}

export async function POST(_request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: uid, email, user_metadata } = user;
    const sanitizedEmail = sanitizeString(email);
    
    const name = sanitizeString(
      user_metadata?.full_name || 
      user_metadata?.name || 
      user_metadata?.user_name || 
      email.split('@')[0]
    ) || '';

    const cachedUser = getCachedUser(sanitizedEmail);
    if (cachedUser) {
      sendNewLoginEmail({ to: sanitizedEmail, name }).catch(console.error);
      
      return NextResponse.json({
        success: true,
        message: 'User already exists',
        user: cachedUser,
        isNewUser: false,
      });
    }

    const { data: upsertedUser, error: upsertError } = await supabase
      .from('users')
      .upsert(
        {
          uid,
          email: sanitizedEmail,
          name,
          has_premium: false,
          polar_customer_id: null,
        },
        { 
          onConflict: 'email',
          ignoreDuplicates: false 
        }
      )
      .select('uid, email, name, has_premium, polar_customer_id, created_at, updated_at')
      .single();

    if (upsertError) {
      return NextResponse.json(
        { error: 'Failed to create/update user', details: upsertError.message },
        { status: 500 }
      );
    }

    setCachedUser(sanitizedEmail, upsertedUser);

    const isNewUser = new Date(upsertedUser.created_at).getTime() > Date.now() - 5000; // 5 seconds tolerance

    if (isNewUser) {
      sendWelcomeEmail({ to: sanitizedEmail, name }).catch(console.error);
    } else {
      sendNewLoginEmail({ to: sanitizedEmail, name }).catch(console.error);
    }

    return NextResponse.json({
      success: true,
      message: isNewUser ? 'User created successfully' : 'User already exists',
      user: upsertedUser,
      isNewUser,
    });

  } catch (error) {
    console.error('[User API] POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cachedUser = getCachedUser(user.email);
    if (cachedUser) {
      return NextResponse.json({
        success: true,
        user: cachedUser,
        authUser: {
          id: user.id,
          email: user.email,
          metadata: user.user_metadata,
        },
      });
    }

    const { data, error } = await supabase
      .from('users')
      .select('uid, email, name, has_premium, polar_customer_id, created_at, updated_at')
      .eq('email', user.email)
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'User not found in database', details: error.message },
        { status: 404 }
      );
    }

    setCachedUser(user.email, data);

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
    console.error('[User API] GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}