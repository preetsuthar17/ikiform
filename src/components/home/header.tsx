"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";

import { FaXTwitter, FaGithub } from "react-icons/fa6";
import { Button } from "../ui/button";
import { Kanban } from "lucide-react";

export default function Header() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="flex justify-between flex-wrap items-center gap-8  py-10 text-sm font-inter max-sm:flex-col max-sm:text-center max-sm:items-center max-sm:justify-center max-w-[95%] mx-auto w-full px-6">
      <div className="max-w-[90px]">
        <Link href="/">
          {mounted && theme === "dark" ? (
            <Image
              src="/text-logo.svg"
              alt="Ikiform"
              width={100}
              height={100}
              className="pointer-events-none invert"
            />
          ) : (
            <Image
              src="/text-logo.svg"
              alt="Ikiform"
              width={100}
              height={100}
              className="pointer-events-none"
            />
          )}
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <nav className="flex gap-2 text-sm">
          <Button asChild variant={"secondary"} size={"icon"}>
            <Link
              href="https://github.com/preetsuthar17/Ikiform"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub />
            </Link>
          </Button>
          <Button asChild variant={"secondary"} size={"icon"}>
            <Link href="https://x.com/preetsuthar17">
              <FaXTwitter />
            </Link>
          </Button>
          <Button asChild variant={"secondary"}>
            <Link href="/roadmap" className="font-medium">
              <Kanban />
              Roadmap
            </Link>
          </Button>
        </nav>
      </div>
    </nav>
  );
}
