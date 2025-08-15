import { Redis } from '@upstash/redis';
import { LRUCache } from 'lru-cache';
import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

const FOUNDER_USER_ID = '2be7479a-bf3c-4951-ab71-65bb148b235c';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Create a shared LRU cache instance (same as in data route)
const lruCache = new LRUCache<string, any>({
  max: 100,
  ttl: 300 * 1000, // 5 minutes
});

export async function DELETE(request: NextRequest) {
  try {
    // Verify user is the founder
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user || user.id !== FOUNDER_USER_ID) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Clear both caches
    const cacheKey = `admin-data:${FOUNDER_USER_ID}`;

    // Clear LRU cache
    lruCache.delete(cacheKey);

    // Clear Redis cache
    await redis.del(cacheKey);

    return NextResponse.json({
      success: true,
      message: 'Cache cleared successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to clear cache:', error);
    return NextResponse.json(
      { error: 'Failed to clear cache' },
      { status: 500 }
    );
  }
}
