"use server";

import { sendFormNotification } from "@/lib/services/notifications";
import { createAdminClient } from "@/utils/supabase/admin";

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
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
  try {
    let sent = 0;
    for (const email of recipients) {
      // eslint-disable-next-line no-await-in-loop
      await sendFormNotification({ to: email, subject, message: content });
      sent += 1;
    }
    return { ok: true, sent } as const;
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return { ok: false, error: message } as const;
  }
}
