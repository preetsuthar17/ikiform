"use client";

import Image from "next/image";
import { Sun, Moon } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <nav className="flex justify-between flex-wrap items-center gap-8  py-10 text-sm font-inter max-sm:flex-col max-sm:text-center max-sm:items-center max-sm:justify-center max-w-[95%] mx-auto w-full px-6">
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
            X
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
          {mounted ? (
            theme === "dark" ? (
              <Sun className="size-5" />
            ) : (
              <Moon className="size-5" />
            )
          ) : (
            <span className="size-5" />
          )}
        </Button>
      </div>
    </nav>
  );
}
