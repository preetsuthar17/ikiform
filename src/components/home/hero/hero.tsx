import { headers } from "next/headers";
import HeroClient from "./hero-client";

export default async function Hero() {
  const origin = (await headers()).get("origin") || "";
  return <HeroClient origin={origin} />;
}
