import { Webhooks } from "@polar-sh/nextjs";
import { sanitizeString } from "@/lib/utils/sanitize";
import { createAdminClient } from "@/utils/supabase/admin";

const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;
if (!webhookSecret) {
	throw new Error("POLAR_WEBHOOK_SECRET environment variable is not set");
}

const findUserByEmail = async (supabase: any, email: string) => {
	const { data: userData, error: lookupError } = await supabase
		.from("users")
		.select("uid, email")
		.eq("email", email)
		.single();

	if (lookupError || !userData) {
		console.warn(`⚠️ User not found in database with email: ${email}`);
		return null;
	}

	return userData;
};

const updateUserPremiumStatus = async (
	supabase: any,
	uid: string,
	email: string,
	hasPremium: boolean,
	polarCustomerId?: string,
	customerName?: string,
) => {
	const updateData: any = { has_premium: hasPremium };

	if (polarCustomerId) {
		updateData.polar_customer_id = polarCustomerId;
	}

	if (customerName) {
		updateData.customer_name = customerName;
	}

	const { data, error } = await supabase
		.from("users")
		.update(updateData)
		.eq("uid", uid)
		.select();

	if (error) {
		console.error("❌ Error updating user premium status:", error);
		return null;
	}

	if (data && data.length > 0) {
		return data[0];
	}
	console.warn(`⚠️ Failed to update user with uid: ${uid}`);
	return null;
};

const sendThankYouEmail = async (email: string, customerName?: string) => {
	try {
		const { sendPremiumThankYouEmail } = await import(
			"@/lib/services/notifications"
		);
		await sendPremiumThankYouEmail({
			to: email,
			name: customerName || undefined,
		});
	} catch (emailError) {
		console.error("❌ Error sending thank you email:", emailError);
	}
};

export const POST = Webhooks({
	webhookSecret,

	onOrderPaid: async (payload) => {
		if (payload.data.status !== "paid" || payload.data.paid !== true) {
			console.warn("❌ Payment not completed. Skipping premium update.");
			return;
		}

		try {
			const supabase = createAdminClient();
			const customerEmail = sanitizeString(payload.data.customer?.email || "");

			if (!customerEmail) {
				console.error("❌ No customer email found in payload");
				return;
			}

			const userData = await findUserByEmail(supabase, customerEmail);
			if (!userData) return;

			const updatedUser = await updateUserPremiumStatus(
				supabase,
				userData.uid,
				customerEmail,
				true,
				payload.data.customer?.id,
				sanitizeString(payload.data.customer?.name || ""),
			);

			if (updatedUser) {
				await sendThankYouEmail(
					customerEmail,
					sanitizeString(payload.data.customer?.name || ""),
				);
			}
		} catch (error) {
			console.error("❌ Error processing payment completion:", error);
		}
	},

	onSubscriptionCreated: async (payload) => {
		try {
			const supabase = createAdminClient();
			const customerEmail = sanitizeString(payload.data.customer?.email || "");

			if (!customerEmail) {
				console.error("❌ No customer email found in subscription payload");
				return;
			}

			const userData = await findUserByEmail(supabase, customerEmail);
			if (!userData) return;

			const updatedUser = await updateUserPremiumStatus(
				supabase,
				userData.uid,
				customerEmail,
				true,
				payload.data.customer?.id,
				sanitizeString(payload.data.customer?.name || ""),
			);

			if (updatedUser) {
				await sendThankYouEmail(
					customerEmail,
					sanitizeString(payload.data.customer?.name || ""),
				);
			}
		} catch (error) {
			console.error("❌ Error processing subscription creation:", error);
		}
	},

	onSubscriptionActive: async (payload) => {
		try {
			const supabase = createAdminClient();
			const customerEmail = sanitizeString(payload.data.customer?.email || "");

			if (!customerEmail) {
				console.error("❌ No customer email found in subscription payload");
				return;
			}

			const userData = await findUserByEmail(supabase, customerEmail);
			if (!userData) return;

			const updatedUser = await updateUserPremiumStatus(
				supabase,
				userData.uid,
				customerEmail,
				true,
				payload.data.customer?.id,
				sanitizeString(payload.data.customer?.name || ""),
			);

			if (updatedUser) {
			}
		} catch (error) {
			console.error("❌ Error processing subscription activation:", error);
		}
	},

	onSubscriptionUpdated: async (payload) => {
		try {
			const supabase = createAdminClient();
			const customerEmail = sanitizeString(payload.data.customer?.email || "");

			if (!customerEmail) {
				console.error("❌ No customer email found in subscription payload");
				return;
			}

			const userData = await findUserByEmail(supabase, customerEmail);
			if (!userData) return;

			const shouldHavePremium = ["active", "trialing"].includes(
				payload.data.status,
			);

			const updatedUser = await updateUserPremiumStatus(
				supabase,
				userData.uid,
				customerEmail,
				shouldHavePremium,
				payload.data.customer?.id,
				sanitizeString(payload.data.customer?.name || ""),
			);

			if (updatedUser) {
			}
		} catch (error) {
			console.error("❌ Error processing subscription update:", error);
		}
	},

	onSubscriptionRevoked: async (payload) => {
		try {
			const supabase = createAdminClient();
			const customerEmail = sanitizeString(payload.data.customer?.email || "");

			if (!customerEmail) {
				console.error("❌ No customer email found in subscription payload");
				return;
			}

			const userData = await findUserByEmail(supabase, customerEmail);
			if (!userData) return;

			const updatedUser = await updateUserPremiumStatus(
				supabase,
				userData.uid,
				customerEmail,
				false,
			);

			if (updatedUser) {
			}
		} catch (error) {
			console.error("❌ Error processing subscription revocation:", error);
		}
	},

	onSubscriptionCanceled: async (payload) => {
		try {
			const supabase = createAdminClient();
			const customerEmail = sanitizeString(payload.data.customer?.email || "");

			if (!customerEmail) {
				console.error("❌ No customer email found in subscription payload");
				return;
			}

			const userData = await findUserByEmail(supabase, customerEmail);
			if (!userData) return;

			const shouldHavePremium = ["active", "trialing"].includes(
				payload.data.status,
			);

			const updatedUser = await updateUserPremiumStatus(
				supabase,
				userData.uid,
				customerEmail,
				shouldHavePremium,
				payload.data.customer?.id,
				sanitizeString(payload.data.customer?.name || ""),
			);

			if (updatedUser) {
			}
		} catch (error) {
			console.error("❌ Error processing subscription cancellation:", error);
		}
	},
});
