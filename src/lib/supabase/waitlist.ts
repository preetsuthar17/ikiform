import supabase from "./supabaseClient";

export const waitlistService = {
  async addToWaitlist(email: string) {
    const { error } = await supabase.from("waitlist").insert([{ email }]);
    if (error) {
      if (
        error.message.includes("duplicate") ||
        error.message.includes("unique")
      ) {
        return {
          success: false,
          message: "You have already joined the waitlist.",
        };
      }
      return { success: false, message: error.message };
    }
    return { success: true, message: "Successfully joined the waitlist!" };
  },
  async getWaitlistCount(): Promise<{ count: number }> {
    const { count, error } = await supabase
      .from("waitlist")
      .select("id", { count: "exact", head: true });
    if (error) return { count: 0 };
    return { count: count ?? 0 };
  },
};
