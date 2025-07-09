"use client";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const CrispWithNoSSR = dynamic(() => import("./crisp"), { ssr: false });

export default function CrispController() {
  const pathname = usePathname();
  if (pathname.startsWith("/forms")) return null;
  return <CrispWithNoSSR />;
}
