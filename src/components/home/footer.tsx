"use client";

// External imports
import Link from "next/link";

// Internal imports
import { Separator } from "../ui/separator";

export default function Footer() {
  return (
    <footer className="flex flex-col items-center justify-center text-center gap-12 py-10 text-sm font-inter max-w-[95%] mx-auto w-full">
      <Separator size="sm" className="opacity-60" />
      <div className="flex flex-wrap gap-2 text-muted-foreground">
        © {new Date().getFullYear()} ikiform —
        <Link
          href="https://x.com/ikiform"
          className="text-foreground"
          target="_blank"
          rel="noopener noreferrer"
        >
          @Ikiform
        </Link>
      </div>
    </footer>
  );
}
