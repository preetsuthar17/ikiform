'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FaDiscord, FaGithub, FaXTwitter } from 'react-icons/fa6';
import { Separator } from '../ui';

const BADGES = [
  {
    href: 'https://www.producthunt.com/products/ikiform?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-ikiform-2',
    img: {
      src: 'https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1003917&theme=light&t=1754896632153',
      alt: 'Ikiform - An open-source alternative to Google Forms and Typeform | Product Hunt',
      width: 120,
      height: 32,
    },
  },
  {
    href: 'https://startupfa.me/s/ikiform.com?utm_source=www.ikiform.com',
    img: {
      src: 'https://startupfa.me/badges/featured/default.webp',
      alt: 'Featured on Startup Fame',
      width: 120,
      height: 32,
    },
  },
  {
    href: 'https://twelve.tools',
    img: {
      src: 'https://twelve.tools/badge3-light.svg',
      alt: 'Featured on Twelve Tools',
      width: 120,
      height: 32,
    },
  },
] as const;

function FooterBadges() {
  return (
    <div className="flex flex-wrap items-center justify-start gap-3">
      {BADGES.map((badge) => (
        <a
          className="rounded transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary"
          href={badge.href}
          key={badge.href}
          rel="noopener"
          tabIndex={0}
          target="_blank"
        >
          <img
            alt={badge.img.alt}
            className="h-8 w-auto object-contain"
            height={badge.img.height}
            loading="lazy"
            src={badge.img.src}
            width={badge.img.width}
          />
        </a>
      ))}
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="mx-auto mt-22 mb-12 w-full max-w-7xl bg-background">
      <div className="mx-auto flex w-full flex-col px-4 md:px-8">
        {/* Rounded container matching the image */}
        <div className="rounded-4xl bg-card p-8 md:p-12">
          <div className="flex flex-col gap-8">
            {/* Top section with logo and navigation */}
            <div className="flex flex-col gap-8 lg:flex-row lg:justify-between">
              {/* Header section with logo */}
              <div className="flex flex-shrink-0 flex-col gap-8">
                <div className="flex flex-shrink-0 flex-col gap-4">
                  <Link className="inline-flex" href="/">
                    <span className="flex items-center gap-3 text-3xl tracking-tight">
                      <Image
                        alt="Ikiform Logo"
                        className="h-10 w-10 rounded-lg"
                        height={40}
                        loading="lazy"
                        quality={75}
                        src="/favicon.ico"
                        width={40}
                      />
                      <span className="font-dm-sans font-semibold text-foreground">
                        Ikiform
                      </span>
                    </span>
                  </Link>
                  <p className="max-w-sm text-muted-foreground text-sm">
                    © {new Date().getFullYear()} Made by —{' '}
                    <Link
                      className="font-medium text-foreground transition-colors hover:underline"
                      href="https://x.com/preetsuthar17"
                      target="_blank"
                    >
                      @preetsuthar17
                    </Link>
                  </p>
                </div>

                {/* Badges section */}
                <div className="flex flex-col gap-4">
                  <a href="https://vercel.com/open-source-program?utm_source=ikiform">
                    <img
                      alt="Vercel OSS Program"
                      src="https://vercel.com/oss/program-badge.svg"
                    />
                  </a>
                  <Separator />

                  <FooterBadges />
                </div>
              </div>
              <Separator className="flex lg:hidden" />
              {/* Navigation sections */}
              <div className="flex flex-wrap gap-8 md:grid md:grid-cols-4 md:gap-10">
                <div className="flex flex-col gap-4">
                  <h3 className="font-dm-sans font-medium text-foreground">
                    Navigation
                  </h3>
                  <ul className="flex flex-col gap-2">
                    <li>
                      <Link
                        className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                        href="/"
                      >
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                        href="/#features"
                      >
                        Features
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                        href="/#pricing"
                      >
                        Pricing
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                        href="/login"
                      >
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                        href="/ai-builder"
                      >
                        AI Builder
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                        href="/dashboard"
                      >
                        Dashboard
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col gap-4">
                  <h3 className="font-dm-sans font-medium text-foreground">
                    Legal
                  </h3>
                  <ul className="flex flex-col gap-2">
                    <li>
                      <Link
                        className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                        href="/legal/privacy"
                      >
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                        href="/legal/terms"
                      >
                        Terms & Condition
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                        href="/legal/gdpr"
                      >
                        GDPR
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                        href="/legal/dpa"
                      >
                        DPA
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col gap-4">
                  <h3 className="font-dm-sans font-medium text-foreground">
                    Resources
                  </h3>
                  <ul className="flex flex-col gap-2">
                    <li>
                      <Link
                        className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                        href="https://www.ikiform.com/feature-request"
                        target="_blank"
                      >
                        Feature Request
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                        href="https://www.ikiform.com/feedback"
                        target="_blank"
                      >
                        Feedback
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                        href="https://www.ikiform.com/bug-report"
                      >
                        Bug Report
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                        href="https://www.ikiform.com/github"
                        target="_blank"
                      >
                        GitHub Repository
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col gap-4">
                  <h3 className="font-dm-sans font-medium text-foreground">
                    Products
                  </h3>
                  <ul className="flex flex-col gap-2">
                    <li>
                      <Link
                        className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                        href="https://hextaui.com?ref=ikiform"
                        target="_blank"
                      >
                        HextaUI
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                        href="https://pro.hextaui.com?ref=ikiform"
                        target="_blank"
                      >
                        HextaUI Blocks
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <Separator />
            {/* Bottom section with social links */}
            <div className="flex w-full flex-col items-end justify-center gap-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
                  <Link
                    className="flex items-center gap-2 transition-colors hover:text-foreground"
                    href="https://www.ikiform.com/github"
                    target="_blank"
                  >
                    <FaGithub className="h-4 w-4" />
                  </Link>
                  <span>//</span>
                  <Link
                    className="flex items-center gap-2 transition-colors hover:text-foreground"
                    href="https://www.ikiform.com/twitter"
                    target="_blank"
                  >
                    <FaXTwitter className="h-4 w-4" />
                  </Link>
                  <span>//</span>
                  <Link
                    className="flex items-center gap-2 transition-colors hover:text-foreground"
                    href="https://www.ikiform.com/discord"
                    target="_blank"
                  >
                    <FaDiscord className="h-5 w-5" />
                  </Link>
                  <span>//</span>
                  <Link
                    className="flex items-center gap-2 transition-colors hover:text-foreground"
                    href="https://www.ikiform.com/email"
                    target="_blank"
                  >
                    hi@ikiform.com
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
