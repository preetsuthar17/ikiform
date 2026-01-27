"use server";

import { sendFormNotification } from "@/lib/services/notifications";
import { createAdminClient } from "@/utils/supabase/admin";

const EMAIL_SEPARATOR_REGEX = /[\n,]/;

export type AnnouncementResult =
	| { ok: true; sent: number }
	| { ok: false; error: string };

export async function sendAnnouncementAction(
	formData: FormData
): Promise<AnnouncementResult> {
	let toRaw = String(formData.get("to") || "").trim();
	const subject = String(formData.get("subject") || "").trim();
	const content = String(formData.get("content") || "").trim();
	if (!toRaw) {
		const admin = createAdminClient();
		const { data, error } = await admin
			.from("users")
			.select("email")
			.returns<{ email: string }[]>();
		if (error) {
			return { ok: false, error: error.message };
		}
		toRaw = (data || []).map((r) => r.email).join(", ");
	}
	if (!(toRaw && subject && content)) {
		return { ok: false, error: "All fields are required" };
	}
	const recipients = toRaw
		.split(EMAIL_SEPARATOR_REGEX)
		.map((s) => s.trim())
		.filter(Boolean);
	try {
		let sent = 0;
		for (const email of recipients) {
			await sendFormNotification({ to: email, subject, message: content });
			sent += 1;
		}
		return { ok: true, sent } as const;
	} catch (e) {
		const message = e instanceof Error ? e.message : "Unknown error";
		return { ok: false, error: message } as const;
	}
}

export type ExpireTrialsResult =
	| {
			ok: true;
			logs: string[];
			updatedCount: number;
			updatedUsers: Array<{ uid: string; email: string; name: string }>;
	  }
	| { ok: false; error: string; logs: string[] };

export async function expireTrialsAction(): Promise<ExpireTrialsResult> {
	const logs: string[] = [];
	logs.push(`[${new Date().toISOString()}] Starting expire trials job...`);

	try {
		const supabase = createAdminClient();
		const now = new Date();
		const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
		const thresholdISO = fourteenDaysAgo.toISOString();

		logs.push(
			`[${new Date().toISOString()}] Current time: ${now.toISOString()}`
		);
		logs.push(
			`[${new Date().toISOString()}] 14 days ago threshold: ${thresholdISO}`
		);

		const { data: debugUsers, error: debugError } = await supabase
			.from("users")
			.select("uid, email, name, has_premium, has_free_trial, created_at")
			.eq("has_premium", true)
			.eq("has_free_trial", true);

		if (debugError) {
			logs.push(
				`[${new Date().toISOString()}] Error fetching debug users: ${debugError.message}`
			);
		}

		logs.push(
			`[${new Date().toISOString()}] Found ${debugUsers?.length || 0} users with has_premium=true and has_free_trial=true`
		);

		if (debugUsers && debugUsers.length > 0) {
			const usersToExpire = debugUsers.filter((user) => {
				const userCreatedAt = new Date(user.created_at);
				const daysDiff =
					(now.getTime() - userCreatedAt.getTime()) / (1000 * 60 * 60 * 24);
				return daysDiff >= 14;
			});

			logs.push(
				`[${new Date().toISOString()}] Users that should be expired (>= 14 days old): ${usersToExpire.length}`
			);

			if (usersToExpire.length > 0) {
				logs.push(
					`[${new Date().toISOString()}] Users to expire: ${JSON.stringify(
						usersToExpire.map((u) => ({
							email: u.email,
							created_at: u.created_at,
							days_old: Math.floor(
								(now.getTime() - new Date(u.created_at).getTime()) /
									(1000 * 60 * 60 * 24)
							),
						})),
						null,
						2
					)}`
				);
			}
		}

		const { data, error } = await supabase
			.from("users")
			.update({
				has_premium: false,
				has_free_trial: false,
				updated_at: new Date().toISOString(),
			})
			.eq("has_premium", true)
			.eq("has_free_trial", true)
			.lt("created_at", thresholdISO)
			.select("uid, email, name, created_at");

		if (error) {
			logs.push(
				`[${new Date().toISOString()}] Error updating trial users: ${error.message}`
			);
			return {
				ok: false,
				error: error.message,
				logs,
			};
		}

		logs.push(
			`[${new Date().toISOString()}] Updated ${data?.length || 0} users from trial to free`
		);

		if (data && data.length > 0) {
			logs.push(
				`[${new Date().toISOString()}] Updated users: ${JSON.stringify(data, null, 2)}`
			);
		} else if (debugUsers && debugUsers.length > 0) {
			logs.push(
				`[${new Date().toISOString()}] WARNING: Found ${debugUsers.length} users with trial flags but none were updated.`
			);
			logs.push(
				`[${new Date().toISOString()}] Sample user created_at values: ${debugUsers
					.slice(0, 5)
					.map((u) => u.created_at)
					.join(", ")}`
			);
		}

		logs.push(`[${new Date().toISOString()}] Job completed successfully`);

		return {
			ok: true,
			logs,
			updatedCount: data?.length || 0,
			updatedUsers: data || [],
		};
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		logs.push(`[${new Date().toISOString()}] Error: ${message}`);
		if (error instanceof Error && error.stack) {
			logs.push(`[${new Date().toISOString()}] Stack: ${error.stack}`);
		}
		return {
			ok: false,
			error: message,
			logs,
		};
	}
}
