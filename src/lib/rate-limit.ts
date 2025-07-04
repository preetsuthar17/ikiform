import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

interface RateLimitSettings {
  enabled: boolean;
  maxSubmissions: number;
  window: string; // e.g., "10 m"
}

const redis = Redis.fromEnv();

// Default rate limit settings
const defaultSettings: RateLimitSettings = {
  enabled: true,
  maxSubmissions: 5,
  window: "10 m",
};

// Cache for rate limiters
const rateLimiters = new Map<string, Ratelimit>();

// Create or get a rate limiter based on settings
function getRateLimiter(
  settings: RateLimitSettings,
  prefix: string = "@upstash/ratelimit"
): Ratelimit {
  const key = `${settings.maxSubmissions}-${settings.window}-${prefix}`;

  if (!rateLimiters.has(key)) {
    const limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(
        settings.maxSubmissions,
        settings.window as any
      ),
      analytics: true,
      prefix,
    });
    rateLimiters.set(key, limiter);
  }

  return rateLimiters.get(key)!;
}

export async function checkRateLimit(
  identifier: string,
  settings: RateLimitSettings = defaultSettings
) {
  if (!settings.enabled) {
    return {
      success: true,
      limit: 0,
      remaining: 0,
      reset: 0,
    };
  }

  const limiter = getRateLimiter(settings);
  const result = await limiter.limit(identifier);
  await result.pending;
  return result;
}

export async function checkCustomRateLimit(
  identifier: string,
  settings: RateLimitSettings,
  prefix: string = "@upstash/ratelimit"
) {
  if (!settings.enabled) {
    return {
      success: true,
      limit: 0,
      remaining: 0,
      reset: 0,
    };
  }

  const limiter = getRateLimiter(settings, prefix);
  const result = await limiter.limit(identifier);
  await result.pending;
  return result;
}

// Interface for form-specific rate limiting (matches form schema)
interface FormRateLimitSettings {
  enabled: boolean;
  maxSubmissions: number;
  timeWindow: number; // minutes
  blockDuration: number; // minutes
  message: string;
}

export async function checkFormRateLimit(
  ipAddress: string,
  formId: string,
  settings: FormRateLimitSettings
) {
  if (!settings.enabled) {
    return {
      success: true,
      limit: 0,
      remaining: 0,
      reset: 0,
      message: "",
    };
  }

  // Convert form settings to our internal rate limit format
  const rateLimitSettings: RateLimitSettings = {
    enabled: settings.enabled,
    maxSubmissions: settings.maxSubmissions,
    window: `${settings.timeWindow} m`, // Convert minutes to string format
  };

  const prefix = `form-${formId}`;
  const limiter = getRateLimiter(rateLimitSettings, prefix);
  const result = await limiter.limit(ipAddress);
  await result.pending;

  return {
    ...result,
    message: result.success ? "" : settings.message,
  };
}

export type { RateLimitSettings, FormRateLimitSettings };
