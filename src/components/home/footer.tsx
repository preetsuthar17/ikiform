"use client";

import Link from "next/link";
import { Separator } from "../ui/separator";

export default function Footer() {
  return (
    <>
      <footer className="flex max-w-6xl w-[95%] mx-auto py-10 text-sm font-inter  text-center justify-center items-center flex-col gap-12">
        <Separator size={"sm"} className="opacity-60" />
        <div className="flex flex-wrap gap-1 text-muted-foreground">
          © {new Date().getFullYear()} Ikiform —
          <Link
            href="https://x.com/ikiform"
            target="_blank"
            className="text-blue-500"
          >
            @ikiform
          </Link>
        </div>
      </footer>
    </>
  );
}
