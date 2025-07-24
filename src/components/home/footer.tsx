"use client";

// External imports
import Link from "next/link";
import React from "react";

// Internal imports
import { Separator } from "../ui/separator";
import { Tabs } from "../ui/tabs";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { FaGithub, FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const themeTabs = [
    { id: "light", icon: <Sun className="w-4 h-4" /> },
    { id: "dark", icon: <Moon className="w-4 h-4" /> },
    { id: "system", icon: <Monitor className="w-4 h-4" /> },
  ];

  return (
    <footer className="w-full bg-background ">
      <div className=" w-full max-w-[95%] mx-auto px-4 md:px-8">
        <div className="py-12 lg:py-16">
          {/* Main Footer Content */}
          <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-16">
            {/* Brand Section */}
            <div className="flex-shrink-0">
              <div className="flex flex-col gap-6">
                <Link href="/" className="inline-flex">
                  <span className="text-2xl sm:text-3xl font-semibold tracking-tight flex items-center gap-2">
                    <Image
                      src="/favicon.ico"
                      alt="Ikiform Logo"
                      width={32}
                      height={32}
                      quality={75}
                      loading="lazy"
                      className="invert sm:w-10 sm:h-10"
                    />
                    <span>Ikiform</span>
                  </span>
                </Link>

                {/* Social Links */}
                <div className="flex gap-3">
                  <Button asChild variant="secondary" size="icon">
                    <Link
                      target="_blank"
                      href="https://github.com/preetsuthar17/ikiform"
                      aria-label="GitHub"
                    >
                      <FaGithub className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="secondary" size="icon">
                    <Link
                      target="_blank"
                      href="https://x.com/ikiform"
                      aria-label="Twitter/X"
                    >
                      <FaXTwitter className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>

                {/* Copyright */}
                <div className="text-sm text-foreground/60">
                  <p>
                    © {new Date().getFullYear()} Made by —{" "}
                    <Link
                      href="https://x.com/preetsuthar17"
                      className="text-foreground hover:underline transition-colors"
                    >
                      @preetsuthar17
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Links Section */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 lg:gap-12">
              {/* Navigation Links */}
              <div>
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-4">
                    Navigation
                  </h3>
                </div>
                <div>
                  <ul className="flex flex-col gap-3">
                    <li>
                      <Link
                        href="/"
                        className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors"
                      >
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors"
                      >
                        Features
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/login"
                        className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors"
                      >
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/ai-builder"
                        className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors"
                      >
                        AI Builder
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/dashboard"
                        className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors"
                      >
                        Dashboard
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Legal Links */}
              <div>
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-4">
                    Legal
                  </h3>
                </div>
                <div>
                  <ul className="flex flex-col gap-3">
                    <li>
                      <Link
                        href="/legal/privacy"
                        className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors"
                      >
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/legal/terms"
                        className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors"
                      >
                        Terms & Conditions
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/legal/gdpr"
                        className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors"
                      >
                        GDPR
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/legal/dpa"
                        className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors"
                      >
                        DPA
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Resources Links */}
              <div>
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-4">
                    Resources
                  </h3>
                </div>
                <div>
                  <ul className="flex flex-col gap-3">
                    <li>
                      <Link
                        href="https://insigh.to/b/ikiform"
                        className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors"
                      >
                        Feature request
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors"
                      >
                        Changelogs
                      </Link>
                    </li>
                    <li>
                      <Link
                        target="_blank"
                        href="https://github.com/preetsuthar17/ikiform"
                        className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors"
                      >
                        GitHub Repository
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Products Links */}
              <div>
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-4">
                    Products
                  </h3>
                </div>
                <div>
                  <ul className="flex flex-col gap-3">
                    <li>
                      <Link
                        href="https://hextaui.com?ref=ikiform"
                        target="_blank"
                        className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors"
                      >
                        HextaUI
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="https://pro.hextaui.com?ref=ikiform"
                        target="_blank"
                        className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors"
                      >
                        HextaUI Blocks
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="https://iki.preetsuthar.me?ref=ikiform"
                        target="_blank"
                        className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors"
                      >
                        Iki
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Theme Selector - Bottom Section */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex-1" />
              {mounted && (
                <div className="flex items-center gap-2">
                  <Tabs
                    items={themeTabs}
                    value={theme}
                    onValueChange={setTheme}
                    size="sm"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
