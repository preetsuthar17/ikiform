import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

interface RateLimitSettings {
	enabled: boolean;
	maxSubmissions: number;
	window: string;
}

let redis: Redis | null = null;

function getRedisClient(): Redis {
	if (typeof window !== "undefined") {
		throw new Error("Redis client cannot be used on the client side");
	}

	if (!redis) {
		const url = process.env.UPSTASH_REDIS_REST_URL;
		const token = process.env.UPSTASH_REDIS_REST_TOKEN;

		if (!(url && token)) {
			throw new Error(
				"Missing required environment variables: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN"
			);
		}

		redis = new Redis({
			url,
			token,
		});
	}

	return redis;
}

const defaultSettings: RateLimitSettings = {
	enabled: true,
	maxSubmissions: 5,
	window: "10 m",
};

const rateLimiters = new Map<string, Ratelimit>();

function getRateLimiter(
	settings: RateLimitSettings,
	prefix = "@upstash/ratelimit"
): Ratelimit {
	const key = `${settings.maxSubmissions}-${settings.window}-${prefix}`;

	if (!rateLimiters.has(key)) {
		const redisClient = getRedisClient();
		const limiter = new Ratelimit({
			redis: redisClient,
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
	if (typeof window !== "undefined") {
		throw new Error("Rate limiting can only be used on the server side");
	}

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
	prefix = "@upstash/ratelimit"
) {
	if (typeof window !== "undefined") {
		throw new Error("Rate limiting can only be used on the server side");
	}

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

interface FormRateLimitSettings {
	enabled: boolean;
	maxSubmissions: number;
	timeWindow: number;
	blockDuration: number;
	message: string;
}

export async function checkFormRateLimit(
	ipAddress: string,
	formId: string,
	settings: FormRateLimitSettings
) {
	if (typeof window !== "undefined") {
		throw new Error("Rate limiting can only be used on the server side");
	}

	if (!settings.enabled) {
		return {
			success: true,
			limit: 0,
			remaining: 0,
			reset: 0,
			message: "",
		};
	}

	const rateLimitSettings: RateLimitSettings = {
		enabled: settings.enabled,
		maxSubmissions: settings.maxSubmissions,
		window: `${settings.timeWindow} m`,
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
