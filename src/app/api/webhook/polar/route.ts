import { Webhooks } from "@polar-sh/nextjs";
import { createClient } from "@/utils/supabase/server";

const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;
if (!webhookSecret) {
  throw new Error("POLAR_WEBHOOK_SECRET environment variable is not set");
}

export const POST = Webhooks({
  webhookSecret,
  onOrderCreated: async (payload) => {
    console.log("Order created");
    console.log("Order created:", payload);

    try {
      const supabase = await createClient();
      const userEmail = payload.data.customer.email;

      if (!userEmail) {
        console.error("No email found in payment payload");
        return;
      }

      // Find user by email and update has_premium to true + store polar customer ID
      const { data, error } = await supabase
        .from("users")
        .update({
          has_premium: true,
          polar_customer_id: payload.data.customer.id,
        })
        .eq("email", userEmail)
        .select();

      if (error) {
        console.error("Error updating user premium status:", error);
        return;
      }

      if (data && data.length > 0) {
        console.log(
          `Successfully updated premium status for user: ${userEmail}`
        );
        console.log("Updated user data:", data[0]);
      } else {
        console.warn(`User not found with email: ${userEmail}`);
      }
    } catch (error) {
      console.error("Error processing payment completion:", error);
    }
  },
});
