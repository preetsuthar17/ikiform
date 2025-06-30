import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(2, "10 m"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

export async function checkRateLimit(identifier: string) {
  const { success, limit, remaining, reset, pending } = await ratelimit.limit(
    identifier
  );
  await pending;
  return { success, limit, remaining, reset };
}
