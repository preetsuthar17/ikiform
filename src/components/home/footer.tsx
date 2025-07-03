"use client";

import Link from "next/link";
import { Separator } from "../ui/separator";

export default function Footer() {
  return (
    <>
      <footer className="flex  py-10 text-sm font-inter  text-center justify-center items-center flex-col gap-12 max-w-[95%] mx-auto w-full px-6">
        <Separator size={"sm"} className="opacity-60" />
        <div className="flex flex-wrap gap-1 text-muted-foreground">
          © {new Date().getFullYear()} ikiform —
          <Link
            href="https://x.com/ikiform"
            className="text-foreground"
            target="_blank"
          >
            @Ikiform
          </Link>
        </div>
      </footer>
    </>
  );
}
