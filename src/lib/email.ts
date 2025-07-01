import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(to: string, name?: string) {
  await resend.emails.send({
    from: "noreply@forms0.com",
    to,
    subject: "Welcome to Forms0!",
    html: `<h1>Welcome${
      name ? `, ${name}` : ""
    }!</h1><p>Thanks for joining Forms0. We're excited to have you!</p>`,
  });
}
