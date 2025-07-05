import { Webhooks } from "@polar-sh/nextjs";
import { createClient } from "@/utils/supabase/server";

const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;
if (!webhookSecret) {
  throw new Error("POLAR_WEBHOOK_SECRET environment variable is not set");
}

export const POST = Webhooks({
  webhookSecret,
  onOrderPaid: async (payload) => {
    console.log("Order paid");
    console.log("Order paid:", payload);

    try {
      const supabase = await createClient();
      const customerId = payload.data.customerId;

      if (!customerId) {
        console.error("No customer ID found in payment payload");
        return;
      }

      // Find user by polar_customer_id and update has_premium to true
      const { data, error } = await supabase
        .from("users")
        .update({
          has_premium: true,
        })
        .eq("polar_customer_id", customerId)
        .select();

      if (error) {
        console.error("Error updating user premium status:", error);
        return;
      }

      if (data && data.length > 0) {
        console.log(
          `Successfully updated premium status for user: ${customerId}`
        );
        console.log("Updated user data:", data[0]);
      } else {
        console.warn(`User not found with customer ID: ${customerId}`);
      }
    } catch (error) {
      console.error("Error processing payment completion:", error);
    }
  },
});
