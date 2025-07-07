import HeroClient from "./hero-client";

export default async function Hero() {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "";
  return <HeroClient origin={origin} />;
}
