"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React, { type CSSProperties } from "react";
import { Badge, Card } from "../ui";
import { Button } from "../ui/button";

interface EmbeddedFormProps {
  className?: string;
  style?: CSSProperties;
}

export const EmbeddedForm = React.memo(function EmbeddedForm({
  className,
  style,
}: EmbeddedFormProps) {
  const [iframeHeight, setIframeHeight] = React.useState(850);

  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://www.ikiform.com") return;
      if (event.data?.type === "resize" && event.data?.height) {
        setIframeHeight(event.data.height);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const iframeStyle = React.useMemo<CSSProperties>(
    () => ({
      width: "100%",
      height: `${iframeHeight}px`,
      border: "1px solid #ffffff",
      borderRadius: "22px",
      display: "block",
      margin: "0 auto",
      ...style,
    }),
    [iframeHeight, style]
  );

  return (
    <div className={`flex w-full justify-center ${className || ""}`}>
      <iframe
        allow="clipboard-write; camera; microphone"
        frameBorder="0"
        loading="lazy"
        referrerPolicy="no-referrer"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
        src="https://www.ikiform.com/forms/24ec3d8d-40ef-4143-b289-4e43c112d80e"
        style={iframeStyle}
        title="Ikiform demo form"
      />
    </div>
  );
});

function SponsoredByBadge() {
  return (
    <Badge className="rounded-full px-3 py-1 text-sm" variant="secondary">
      <Link
        aria-label="Sponsored by Vercel (opens in a new tab)"
        className="flex items-center justify-center gap-2"
        href="https://vercel.com/open-source-program?utm_source=ikiform"
        rel="noopener noreferrer"
        target="_blank"
      >
        Sponsored by
        <span className="flex items-center justify-center">
          <svg
            aria-hidden="true"
            height="13"
            strokeLinejoin="round"
            viewBox="0 0 16 16"
            width="13"
          >
            <path
              clipRule="evenodd"
              d="M8 1L16 15H0L8 1Z"
              fill="currentColor"
              fillRule="evenodd"
            />
          </svg>
          Vercel
        </span>
      </Link>
    </Badge>
  );
}

function HeroHeading() {
  return (
    <h1
      className="text-center font-semibold text-4xl leading-tighter tracking-[-2px] md:text-5xl"
      id="home-hero-title"
    >
      Forms users actually want to fill out.
    </h1>
  );
}

function HeroSubheading() {
  return (
    <h2 className="max-w-2xl font-normal text-base leading-loose opacity-70 md:text-lg">
      Beautiful AI-powered forms—collect unlimited responses, with full control.
    </h2>
  );
}

// Removed HeroAsciiOceanBackground

function HeroCTAs() {
  return (
    <div
      aria-live="polite"
      className="flex w-fit flex-wrap items-center justify-center gap-3"
    >
      <Button asChild className="rounded-full" variant="default">
        <Link
          className="flex h-11 w-full items-center gap-2 whitespace-nowrap font-medium md:w-62"
          href="/login"
        >
          <span>Start Collecting Responses</span>{" "}
          <ChevronRight aria-hidden="true" />
        </Link>
      </Button>
      <Button asChild className="rounded-full" variant="outline">
        <Link
          className="flex h-11 w-full items-center gap-2 whitespace-nowrap font-medium md:w-40"
          href="/login"
        >
          <span>Try a Demo</span>
        </Link>
      </Button>
    </div>
  );
}

export default function Hero() {
  return (
    <section
      aria-labelledby="home-hero-title"
      className="mx-auto flex w-full max-w-7xl flex-col"
    >
      <div className="relative z-20 flex h-full grow flex-col items-center gap-8 overflow-hidden border border-b-0 px-4 py-28 text-center md:px-6">
        <SponsoredByBadge />
        <HeroHeading />
        <HeroSubheading />
        <HeroCTAs />
        {/* Removed HeroAsciiOceanBackground */}
      </div>

      <Card className="w-full max-w-7xl rounded-none border-b-0 bg-card shadow-none">
        <EmbeddedForm className="bg-card" />
      </Card>
    </section>
  );
}
