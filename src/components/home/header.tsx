"use client";

import Image from "next/image";
import { Sun, Moon } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import Link from "next/link";

export default function Header() {
  const { theme, setTheme } = useTheme();

  const handleToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <nav className="flex justify-between flex-wrap items-center gap-8 max-w-6xl w-[95%] mx-auto py-10 text-sm font-inter max-sm:flex-col max-sm:text-center max-sm:items-center max-sm:justify-center">
      <div className="max-w-[90px]">
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="forms0"
            width={40}
            height={40}
            className="pointer-events-none rounded-ele"
          />
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <nav className="flex gap-4 text-sm">
          <Link
            href="https://github.com/preetsuthar17/forms0"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            GitHub
          </Link>
          <Link href="https://x.com/preetsuthar17" className="hover:underline">
            X (Twitter)
          </Link>{" "}
          <Link href="/roadmap" className="hover:underline">
            Roadmap
          </Link>
        </nav>
        <Button
          aria-label="Toggle theme"
          onClick={handleToggle}
          className="w-9 h-9 flex items-center justify-center rounded-ele"
          type="button"
        >
          {theme === "dark" ? (
            <Sun className="size-5" />
          ) : (
            <Moon className="size-5" />
          )}
        </Button>
      </div>
    </nav>
  );
}
