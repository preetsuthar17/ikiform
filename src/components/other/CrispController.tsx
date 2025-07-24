"use client";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const CrispWithNoSSR = dynamic(() => import("./crisp"), { ssr: false });

export default function CrispController() {
  const pathname = usePathname();
  if (
    pathname.startsWith("/forms") ||
    pathname.startsWith("/dashboard/forms") ||
    (pathname.startsWith("/dashboard/forms/") && pathname.includes("analytics"))
  ) {
    return null;
  }
  return <CrispWithNoSSR />;
}
