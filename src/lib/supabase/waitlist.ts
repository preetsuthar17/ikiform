const API_URL = "/api/waitlist";

export const waitlistService = {
  async addToWaitlist(email: string) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return res.json();
  },
  async getWaitlistCount(): Promise<{ count: number }> {
    const res = await fetch(API_URL);
    return res.json();
  },
};
