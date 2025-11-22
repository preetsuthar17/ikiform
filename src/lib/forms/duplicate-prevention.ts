import { Redis } from "@upstash/redis";

interface DuplicatePreventionSettings {
	enabled: boolean;
	strategy: "ip" | "email" | "session" | "combined";
	mode: "time-based" | "one-time";
	timeWindow: number;
	message: string;
	allowOverride?: boolean;
	maxAttempts?: number;
}

interface DuplicateCheckResult {
	isDuplicate: boolean;
	message: string;
	timeRemaining?: number;
	attemptsRemaining?: number;
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
				"Missing required environment variables: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN",
			);
		}

		redis = new Redis({
			url,
			token,
		});
	}

	return redis;
}

const DEFAULT_SETTINGS: DuplicatePreventionSettings = {
	enabled: false,
	strategy: "ip",
	mode: "one-time",
	timeWindow: 1440,
	message:
		"You have already submitted this form. Each user can only submit once.",
	allowOverride: false,
	maxAttempts: 1,
};

export async function checkDuplicateSubmission(
	formId: string,
	identifier: string,
	settings: DuplicatePreventionSettings = DEFAULT_SETTINGS,
): Promise<DuplicateCheckResult> {
	if (typeof window !== "undefined") {
		throw new Error("Duplicate prevention can only be used on the server side");
	}

	if (!settings.enabled) {
		return {
			isDuplicate: false,
			message: "",
		};
	}

	const redis = getRedisClient();
	const key = `duplicate_prevention:${formId}:${identifier}`;

	try {
		const existingSubmission = await redis.get(key);

		if (existingSubmission) {
			if (settings.mode === "one-time") {
				return {
					isDuplicate: true,
					message: settings.message,
				};
			}

			const submissionData = existingSubmission as {
				timestamp: number;
				attempts: number;
			};
			const timeWindowSeconds = settings.timeWindow * 60;
			const timeElapsed = Math.floor(
				(Date.now() - submissionData.timestamp) / 1000,
			);
			const timeRemaining = timeWindowSeconds - timeElapsed;

			if (timeRemaining > 0) {
				const attemptsRemaining = Math.max(
					0,
					(settings.maxAttempts || 1) - submissionData.attempts,
				);

				return {
					isDuplicate: true,
					message: settings.message,
					timeRemaining,
					attemptsRemaining,
				};
			}

			await redis.del(key);
		}

		return {
			isDuplicate: false,
			message: "",
		};
	} catch (error) {
		console.error("Error checking duplicate submission:", error);

		return {
			isDuplicate: false,
			message: "",
		};
	}
}

export async function recordSubmission(
	formId: string,
	identifier: string,
	settings: DuplicatePreventionSettings = DEFAULT_SETTINGS,
): Promise<void> {
	if (typeof window !== "undefined") {
		throw new Error("Duplicate prevention can only be used on the server side");
	}

	if (!settings.enabled) {
		return;
	}

	const redis = getRedisClient();
	const key = `duplicate_prevention:${formId}:${identifier}`;

	try {
		const existingSubmission = await redis.get(key);

		if (existingSubmission) {
			if (settings.mode === "one-time") {
				return;
			}

			const submissionData = existingSubmission as {
				timestamp: number;
				attempts: number;
			};
			const timeWindowSeconds = settings.timeWindow * 60;
			const newAttempts = submissionData.attempts + 1;

			await redis.setex(key, timeWindowSeconds, {
				timestamp: submissionData.timestamp,
				attempts: newAttempts,
			});
		} else if (settings.mode === "one-time") {
			await redis.set(key, {
				timestamp: Date.now(),
				attempts: 1,
			});
		} else {
			const timeWindowSeconds = settings.timeWindow * 60;
			await redis.setex(key, timeWindowSeconds, {
				timestamp: Date.now(),
				attempts: 1,
			});
		}
	} catch (error) {
		console.error("Error recording submission:", error);
	}
}

export function generateIdentifier(
	strategy: DuplicatePreventionSettings["strategy"],
	ipAddress: string,
	email?: string,
	sessionId?: string,
): string {
	switch (strategy) {
		case "ip":
			return `ip:${ipAddress}`;
		case "email":
			return email ? `email:${email.toLowerCase()}` : `ip:${ipAddress}`;
		case "session":
			return sessionId ? `session:${sessionId}` : `ip:${ipAddress}`;
		case "combined": {
			const parts = [`ip:${ipAddress}`];
			if (email) parts.push(`email:${email.toLowerCase()}`);
			if (sessionId) parts.push(`session:${sessionId}`);
			return parts.join("|");
		}
		default:
			return `ip:${ipAddress}`;
	}
}

export function extractEmailFromSubmissionData(
	submissionData: Record<string, any>,
): string | undefined {
	const emailFields = [
		"email",
		"e-mail",
		"mail",
		"user_email",
		"contact_email",
	];

	for (const field of emailFields) {
		if (submissionData[field] && typeof submissionData[field] === "string") {
			const email = submissionData[field].trim().toLowerCase();

			if (email.includes("@") && email.includes(".")) {
				return email;
			}
		}
	}

	return;
}

export function formatTimeRemaining(seconds: number): string {
	if (seconds < 60) {
		return `${seconds} seconds`;
	}
	if (seconds < 3600) {
		const minutes = Math.ceil(seconds / 60);
		return `${minutes} minute${minutes > 1 ? "s" : ""}`;
	}
	if (seconds < 86_400) {
		const hours = Math.ceil(seconds / 3600);
		return `${hours} hour${hours > 1 ? "s" : ""}`;
	}
	const days = Math.ceil(seconds / 86_400);
	return `${days} day${days > 1 ? "s" : ""}`;
}

export type { DuplicatePreventionSettings, DuplicateCheckResult };
