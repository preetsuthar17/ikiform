import { Resend } from "resend";
import { marked } from "marked";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface NotificationLink {
  label: string;
  url: string;
}

export interface SendNotificationOptions {
  to: string;
  subject: string;
  message: string;
  from?: string;
  analyticsUrl?: string;
  customLinks?: NotificationLink[];
}

function renderLinks(analyticsUrl?: string, customLinks?: NotificationLink[]) {
  let linksHtml = "";
  if (analyticsUrl) {
    linksHtml += `<li><a href="${analyticsUrl}">View Form Analytics</a></li>`;
  }
  if (customLinks && customLinks.length > 0) {
    for (const link of customLinks) {
      linksHtml += `<li><a href="${link.url}">${link.label}</a></li>`;
    }
  }
  if (linksHtml) {
    return `<ul>${linksHtml}</ul>`;
  }
  return "";
}

export async function sendFormNotification({
  to,
  subject,
  message,
  from,
  analyticsUrl,
  customLinks,
}: SendNotificationOptions) {
  if (!process.env.RESEND_API_KEY) {
    console.error("[Resend] API key not configured");
    throw new Error("Resend API key not configured");
  }
  console.log("[Resend] Sending email", {
    to,
    subject,
    from,
    analyticsUrl,
    customLinks,
  });
  try {
    const htmlMessage = marked.parse(message || "");
    const linksHtml = renderLinks(analyticsUrl, customLinks);
    const html = `${htmlMessage}${linksHtml}`;
    const result = await resend.emails.send({
      from: from || "Ikiform <no-reply@ikiform.com>",
      to,
      subject,
      html,
    });
    console.log("[Resend] Email send result", result);
    return result;
  } catch (error) {
    console.error("[Resend] Email send error", error);
    throw error;
  }
}

export async function sendWelcomeEmail({
  to,
  name,
  customLinks,
}: {
  to: string;
  name?: string;
  customLinks?: NotificationLink[];
}) {
  const subject = `Welcome to Ikiform! 🎉`;
  const message = `# Welcome${name ? ", " + name : ""} 👋\n\nWe're excited to have you on board.\n\n- Create beautiful forms\n- Collect responses\n- Analyze your data\n\nGet started by building your first form!`;
  const dashboardUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://ikiform.com"}/dashboard`;
  return sendFormNotification({
    to,
    subject,
    message,
    customLinks: [
      { label: "Go to Dashboard", url: dashboardUrl },
      ...(customLinks || []),
    ],
  });
}

export async function sendNewLoginEmail({
  to,
  name,
  customLinks,
}: {
  to: string;
  name?: string;
  customLinks?: NotificationLink[];
}) {
  const subject = `New Login to Your Ikiform Account`;
  const message = `# New Login${name ? ", " + name : ""}\n\nWe noticed a new login to your account. If this was you, you can safely ignore this email.\n\nIf you did not perform this login, please [contact us](mailto:hi@ikiform.com).`;
  const dashboardUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://ikiform.com"}/dashboard`;
  return sendFormNotification({
    to,
    subject,
    message,
    customLinks: [
      { label: "Go to Dashboard", url: dashboardUrl },
      { label: "Send us a mail", url: "mailto:hi@ikiform.com" },
      ...(customLinks || []),
    ],
  });
}
