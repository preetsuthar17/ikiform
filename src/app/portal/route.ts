import { CustomerPortal } from "@polar-sh/nextjs";
import type { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const GET = CustomerPortal({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: "production",
  getCustomerId: async (req: NextRequest) => {
    try {
      const supabase = await createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user?.email) {
        console.error("No authenticated user found");
        throw new Error("Unauthorized");
      }

      const { data, error } = await supabase
        .from("users")
        .select("polar_customer_id")
        .eq("email", user.email)
        .single();

      if (error || !data?.polar_customer_id) {
        console.error("No polar customer ID found for user:", user.email);
        throw new Error("No customer ID found");
      }

      return data.polar_customer_id;
    } catch (error) {
      console.error("Error getting customer ID:", error);
      throw error;
    }
  },
});
