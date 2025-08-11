"use client";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const CrispWithNoSSR = dynamic(() => import("./crisp"), { ssr: false });

export default function CrispController() {
  const pathname = usePathname();
  if (
    pathname.startsWith("/forms") ||
    pathname.startsWith("/f") ||
    pathname.startsWith("/dashboard/forms") ||
    (pathname.startsWith("/dashboard/forms/") && pathname.includes("analytics"))
  ) {
    return null;
  }
  return <CrispWithNoSSR />;
}
