import { Checkout } from "@polar-sh/nextjs";

export const GET = Checkout({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  successUrl: "https://forms0-git-app-preetsuthars-projects.vercel.app/success",
  server: "production",
});
