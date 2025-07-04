import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

// Default rate limiter (5 submissions per 10 minutes)
const defaultRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(5, "10 m"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

// Cache for custom rate limiters
const customRatelimitCache = new Map<string, Ratelimit>();

export async function checkRateLimit(identifier: string) {
  const result = await defaultRatelimit.limit(identifier);
  await result.pending;
  return result;
}

export async function checkCustomRateLimit(
  identifier: string,
  maxSubmissions: number,
  timeWindowMinutes: number,
  formId?: string
) {
  // Create a cache key for this rate limit configuration
  const cacheKey = `${maxSubmissions}-${timeWindowMinutes}`;

  // Check if we have a cached rate limiter for this configuration
  let ratelimit = customRatelimitCache.get(cacheKey);

  if (!ratelimit) {
    // Create new rate limiter with custom settings
    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(maxSubmissions, `${timeWindowMinutes} m`),
      analytics: true,
      prefix: formId ? `@form/${formId}/ratelimit` : "@upstash/ratelimit",
    });

    // Cache the rate limiter (limit cache size to prevent memory issues)
    if (customRatelimitCache.size < 100) {
      customRatelimitCache.set(cacheKey, ratelimit);
    }
  }

  const result = await ratelimit.limit(identifier);
  await result.pending;
  return result;
}

export async function blockIdentifier(
  identifier: string,
  blockDurationMinutes: number,
  formId?: string
) {
  const blockKey = formId
    ? `@form/${formId}/blocked:${identifier}`
    : `@blocked:${identifier}`;
  const blockUntil = Date.now() + blockDurationMinutes * 60 * 1000;

  await redis.set(blockKey, blockUntil, {
    px: blockDurationMinutes * 60 * 1000, // Expire after block duration
  });
}

export async function isIdentifierBlocked(
  identifier: string,
  formId?: string
): Promise<boolean> {
  const blockKey = formId
    ? `@form/${formId}/blocked:${identifier}`
    : `@blocked:${identifier}`;
  const blockUntil = await redis.get(blockKey);

  if (!blockUntil) {
    return false;
  }

  const now = Date.now();
  const blockTime =
    typeof blockUntil === "number"
      ? blockUntil
      : parseInt(blockUntil as string);

  return now < blockTime;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  blocked?: boolean;
  message?: string;
}

export async function checkFormRateLimit(
  identifier: string,
  formId: string,
  rateLimit: {
    enabled: boolean;
    maxSubmissions: number;
    timeWindow: number;
    blockDuration: number;
    message: string;
  }
): Promise<RateLimitResult> {
  // If rate limiting is disabled, allow the request
  if (!rateLimit.enabled) {
    return {
      success: true,
      limit: 0,
      remaining: 0,
      reset: 0,
    };
  }

  // Check if identifier is currently blocked
  const isBlocked = await isIdentifierBlocked(identifier, formId);
  if (isBlocked) {
    return {
      success: false,
      limit: rateLimit.maxSubmissions,
      remaining: 0,
      reset: 0,
      blocked: true,
      message: rateLimit.message,
    };
  }

  // Check rate limit
  const result = await checkCustomRateLimit(
    identifier,
    rateLimit.maxSubmissions,
    rateLimit.timeWindow,
    formId
  );

  // If rate limit exceeded, block the identifier
  if (!result.success) {
    await blockIdentifier(identifier, rateLimit.blockDuration, formId);

    return {
      success: false,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
      blocked: true,
      message: rateLimit.message,
    };
  }

  return {
    success: true,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  };
}
