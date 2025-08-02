'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import Image from 'next/image';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import React from 'react';
import { FaGithub, FaXTwitter } from 'react-icons/fa6';
import { Button } from '../ui/button';

import { Separator } from '../ui/separator';
import { Tabs } from '../ui/tabs';

export default function Footer() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const themeTabs = [
    { id: 'light', icon: <Sun className="h-4 w-4" /> },
    { id: 'dark', icon: <Moon className="h-4 w-4" /> },
    { id: 'system', icon: <Monitor className="h-4 w-4" /> },
  ];

  return (
    <footer className="w-full bg-background">
      <div className="mx-auto w-full max-w-[95%] px-4 md:px-8">
        <div className="py-12 lg:py-16">
          {}
          <div className="flex flex-col justify-between gap-12 lg:flex-row lg:gap-16">
            {}
            <div className="flex-shrink-0">
              <div className="flex flex-col gap-6">
                <Link className="inline-flex" href="/">
                  <span className="flex items-center gap-2 font-semibold text-2xl tracking-tight sm:text-3xl">
                    <Image
                      alt="Ikiform Logo"
                      className="invert sm:h-10 sm:w-10"
                      height={32}
                      loading="lazy"
                      quality={75}
                      src="/favicon.ico"
                      width={32}
                    />
                    <span>Ikiform</span>
                  </span>
                </Link>

                {}
                <div className="flex gap-3">
                  <Button asChild size="icon" variant="secondary">
                    <Link
                      aria-label="GitHub"
                      href="https://github.com/preetsuthar17/ikiform"
                      target="_blank"
                    >
                      <FaGithub className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="icon" variant="secondary">
                    <Link
                      aria-label="Twitter/X"
                      href="https://x.com/ikiform"
                      target="_blank"
                    >
                      <FaXTwitter className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                {}
                <div className="text-foreground/60 text-sm">
                  <p>
                    © {new Date().getFullYear()} Made by —{' '}
                    <Link
                      className="text-foreground transition-colors hover:underline"
                      href="https://x.com/preetsuthar17"
                    >
                      @preetsuthar17
                    </Link>
                  </p>
                </div>
                <Separator />
                <a href="https://vercel.com/oss?utm_source=ikiform">
                  <img
                    alt="Vercel OSS Program"
                    src="https://vercel.com/oss/program-badge.svg"
                  />
                </a>
                <a
                  href="https://startupfa.me/s/ikiform.com?utm_source=www.ikiform.com"
                  rel="noopener"
                  target="_blank"
                >
                  <img
                    alt="Featured on Startup Fame"
                    height="54"
                    src="https://startupfa.me/badges/featured/default.webp"
                    width="171"
                  />
                </a>
              </div>
            </div>

            {}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-4 lg:gap-12">
              {}
              <div>
                <div>
                  <h3 className="mb-4 font-medium text-foreground text-sm">
                    Navigation
                  </h3>
                </div>
                <div>
                  <ul className="flex flex-col gap-3">
                    <li>
                      <Link
                        className="text-muted-foreground text-sm transition-colors hover:text-primary hover:underline"
                        href="/"
                      >
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="text-muted-foreground text-sm transition-colors hover:text-primary hover:underline"
                        href="#"
                      >
                        Features
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="text-muted-foreground text-sm transition-colors hover:text-primary hover:underline"
                        href="/login"
                      >
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="text-muted-foreground text-sm transition-colors hover:text-primary hover:underline"
                        href="/ai-builder"
                      >
                        AI Builder
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="text-muted-foreground text-sm transition-colors hover:text-primary hover:underline"
                        href="/dashboard"
                      >
                        Dashboard
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {}
              <div>
                <div>
                  <h3 className="mb-4 font-medium text-foreground text-sm">
                    Legal
                  </h3>
                </div>
                <div>
                  <ul className="flex flex-col gap-3">
                    <li>
                      <Link
                        className="text-muted-foreground text-sm transition-colors hover:text-primary hover:underline"
                        href="/legal/privacy"
                      >
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="text-muted-foreground text-sm transition-colors hover:text-primary hover:underline"
                        href="/legal/terms"
                      >
                        Terms & Conditions
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="text-muted-foreground text-sm transition-colors hover:text-primary hover:underline"
                        href="/legal/gdpr"
                      >
                        GDPR
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="text-muted-foreground text-sm transition-colors hover:text-primary hover:underline"
                        href="/legal/dpa"
                      >
                        DPA
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {}
              <div>
                <div>
                  <h3 className="mb-4 font-medium text-foreground text-sm">
                    Resources
                  </h3>
                </div>
                <div>
                  <ul className="flex flex-col gap-3">
                    <li>
                      <Link
                        className="text-muted-foreground text-sm transition-colors hover:text-primary hover:underline"
                        href="https://insigh.to/b/ikiform"
                      >
                        Feature request
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="text-muted-foreground text-sm transition-colors hover:text-primary hover:underline"
                        href="#"
                      >
                        Changelogs
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="text-muted-foreground text-sm transition-colors hover:text-primary hover:underline"
                        href="https://github.com/preetsuthar17/ikiform"
                        target="_blank"
                      >
                        GitHub Repository
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="text-muted-foreground text-sm transition-colors hover:text-primary hover:underline"
                        href="/f/de330706-1cdc-494c-9d04-7afef3d3e20b"
                        target="_blank"
                      >
                        Feedback
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {}
              <div>
                <div>
                  <h3 className="mb-4 font-medium text-foreground text-sm">
                    Products
                  </h3>
                </div>
                <div>
                  <ul className="flex flex-col gap-3">
                    <li>
                      <Link
                        className="text-muted-foreground text-sm transition-colors hover:text-primary hover:underline"
                        href="https://hextaui.com?ref=ikiform"
                        target="_blank"
                      >
                        HextaUI
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="text-muted-foreground text-sm transition-colors hover:text-primary hover:underline"
                        href="https://pro.hextaui.com?ref=ikiform"
                        target="_blank"
                      >
                        HextaUI Blocks
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="text-muted-foreground text-sm transition-colors hover:text-primary hover:underline"
                        href="https://iki.preetsuthar.me?ref=ikiform"
                        target="_blank"
                      >
                        Iki
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="mt-12 border-border border-t pt-8">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="flex-1" />
              {mounted && (
                <div className="flex items-center gap-2">
                  <Tabs
                    items={themeTabs}
                    onValueChange={setTheme}
                    size="sm"
                    value={theme}
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
