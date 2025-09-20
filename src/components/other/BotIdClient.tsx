"use client";

import dynamic from "next/dynamic";

const BotIdClientWithNoSSR = dynamic(
  async () => {
    const { BotIdClient } = await import("botid/client");
    return BotIdClient;
  },
  { ssr: false }
);

const protectedRoutes = [
  {
    path: "/api/forms/*/submit",
    method: "POST",
  },
  {
    path: "/api/forms/*/api-submit",
    method: "POST",
  },
];

export function BotIdClientWrapper() {
  return <BotIdClientWithNoSSR protect={protectedRoutes} />;
}
