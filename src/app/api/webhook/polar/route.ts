import { Webhooks } from "@polar-sh/nextjs";
import { createAdminClient } from "@/utils/supabase/admin";

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  onOrderPaid: async (payload) => {
    console.log("✅ Order paid webhook received successfully");
    console.log("📦 Order paid payload:", JSON.stringify(payload, null, 2));

    try {
      const supabase = createAdminClient();

      // Get customer email from the payload
      const customerEmail = payload.data.customer?.email;
      if (!customerEmail) {
        console.error("❌ No customer email found in payload");
        return;
      }

      console.log("🔍 Looking for user with email:", customerEmail);

      // First, find the user by email to get their uid
      const { data: userData, error: lookupError } = await supabase
        .from("users")
        .select("uid, email")
        .eq("email", customerEmail)
        .single();

      if (lookupError || !userData) {
        console.warn(
          `⚠️ User not found in database with email: ${customerEmail}`
        );
        console.log(
          "💡 Make sure the user has signed up with this email address"
        );
        return;
      }

      console.log("🔍 Found user with uid:", userData.uid);

      // Update the user's premium status by uid
      const { data, error } = await supabase
        .from("users")
        .update({ has_premium: true })
        .eq("uid", userData.uid)
        .select();

      if (error) {
        console.error("❌ Error updating user premium status:", error);
        return;
      }

      if (data && data.length > 0) {
        console.log(
          `✅ Successfully updated premium status for user: ${customerEmail} (uid: ${userData.uid})`
        );
        console.log("👤 Updated user data:", data[0]);
        const { sendWelcomeEmail } = await import(
          "@/lib/services/notifications"
        );
        await sendWelcomeEmail({
          to: customerEmail,
        });
      } else {
        console.warn(`⚠️ Failed to update user with uid: ${userData.uid}`);
      }
    } catch (error) {
      console.error("❌ Error processing payment completion:", error);
    }
  },
});
