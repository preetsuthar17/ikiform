"use client";

import {
  Bot,
  GitBranch,
  Infinity as InfinityIcon,
  Mail,
  PenTool,
  TrendingUp,
  Zap,
} from "lucide-react";

import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";

interface FeatureCardProps {
  title: string;
  description: ReactNode;
  icon: ReactNode;
  preview: ReactNode;
  className?: string;
  featured?: boolean;
}

const FeatureCard = React.memo(function FeatureCard({
  title,
  description,
  icon,
  preview,
  className = "",
}: FeatureCardProps) {
  return (
    <Card
      className={`overflow-hidden rounded-none border-0 bg-background p-4 shadow-none transition-all duration-300 ease-out md:p-6 ${className}`}
    >
      <div className="flex h-fit w-full flex-col gap-8 p-6 md:h-full">
        {/* Header */}
        <div className="flex flex-col items-start gap-4 text-left">
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <h3 className="flex items-center gap-2 font-medium text-sm opacity-60">
              {icon} {title}
            </h3>
            <p className="font-medium text-lg leading-relaxed tracking-tight md:text-xl">
              {description}
            </p>
          </div>
        </div>
        {/* Preview */}
        <div className="relative overflow-hidden">
          <div className="fade-bottom h-fit md:h-full">{preview}</div>
        </div>
      </div>
    </Card>
  );
});

// Hoisted static data/constants
type AiFormStep = {
  label: string;
  type: "input" | "field";
  width: string;
  height?: string;
  placeholder?: string;
};

const AI_FORM_STEPS: AiFormStep[] = [
  {
    label: "What would you like to create?",
    placeholder: "Eg. Contact Form",
    type: "input",
    width: "w-full",
  },
  { label: "Collect name", type: "field", width: "w-2/3" },
  { label: "Collect email", type: "field", width: "w-2/3" },
  { label: "Message", type: "field", height: "h-20", width: "w-full" },
] as const;

const AiFormBuilderPreview = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [status, setStatus] = useState<"generating" | "success">("generating");

  useEffect(() => {
    if (status === "success") {
      const t = setTimeout(() => {
        setCurrentStep(0);
        setStatus("generating");
      }, 2500);
      return () => clearTimeout(t);
    }
    if (currentStep < AI_FORM_STEPS.length) {
      const t = setTimeout(() => setCurrentStep((s) => s + 1), 850);
      return () => clearTimeout(t);
    }
    if (currentStep === AI_FORM_STEPS.length) {
      setTimeout(() => setStatus("success"), 400);
    }
  }, [currentStep, status]);

  return (
    <div
      aria-label="AI Form Builder Demo"
      className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/1 to-accent/20 p-0 shadow-inner"
      tabIndex={0}
    >
      <div className="flex flex-col gap-3 px-6 py-5">
        <motion.div
          animate={{ opacity: status === "generating" ? 1 : 0.6 }}
          className="flex items-center gap-2"
        >
          <motion.span
            animate={{
              scale: status === "generating" ? [1, 1.2, 1] : 1,
              opacity: status === "generating" ? [0.3, 1, 0.3] : 1,
              filter:
                status === "generating"
                  ? "brightness(1)"
                  : "brightness(0.95) grayscale(30%)",
            }}
            aria-hidden="true"
            className="inline-block size-3 rounded-full bg-primary"
            transition={{
              duration: 1,
              ease: "easeOut",
            }}
          />
          <span className="font-medium text-foreground text-sm">
            {status === "generating"
              ? "AI is building your form…"
              : "Form generated"}
          </span>
        </motion.div>
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-background/80 p-3">
          {/* User enters prompt */}
          <motion.div
            animate={{
              opacity: 1,
              translateY: 0,
              filter: currentStep > 0 ? "brightness(1)" : "brightness(0.93)",
            }}
            className="flex flex-col gap-1"
            initial={{ opacity: 0, translateY: 12 }}
            transition={{ delay: 0.1 }}
          >
            <label
              className="mb-0.5 font-medium text-muted-foreground text-xs"
              htmlFor="aiform-demo-input"
            >
              What would you like to create?
            </label>
            <input
              aria-label="Demo form input"
              className="h-9 rounded-md border border-border bg-transparent px-3 text-foreground text-xs"
              disabled
              id="aiform-demo-input"
              placeholder="Eg. Contact Form…"
              style={{
                opacity: currentStep > 0 ? 1 : 0.6,
                transition: "opacity 0.2s",
              }}
              value="could you create a simple contact form?"
            />
          </motion.div>
          {/* Animate fields sequentially */}
          <motion.div className="relative mt-2 flex flex-col gap-2 rounded-m">
            {[1, 2, 3].map((i, idx) => {
              const step = AI_FORM_STEPS[i];
              const shown = currentStep > i - 1;
              return (
                <motion.div
                  animate={{
                    opacity: shown ? 1 : 0,
                    y: shown ? 0 : 18,
                    filter: shown ? "none" : "blur(2px)",
                  }}
                  aria-hidden={!shown}
                  className={"flex flex-col gap-0.5 rounded-md transition-all"}
                  initial={false}
                  key={idx}
                  transition={{
                    duration: 0.36 + idx * 0.07,
                    delay: shown ? 0.02 : 0,
                    ease: "easeOut",
                  }}
                >
                  <span className="pl-1 font-medium text-muted-foreground text-xs">
                    {step.label}
                  </span>
                  <div
                    className={`
                      ${step.height || "h-10"} ${step.width} w-full rounded-md border border-border bg-card transition-all`}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
      <motion.div
        animate={{
          opacity: status === "success" ? 1 : 0.6,
          filter: status === "success" ? "none" : "grayscale(60%)",
        }}
        className="mt-auto flex items-center justify-between border-border/50 border-t px-6 py-3"
        initial={false}
      >
        <span className="text-muted-foreground text-xs">
          Generated in&nbsp;2.3s
        </span>
        <button
          aria-disabled={status !== "success"}
          className="rounded-full bg-primary px-3 py-1 font-semibold text-primary-foreground text-xs shadow transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/80 disabled:opacity-60"
          style={{
            pointerEvents: status === "success" ? "auto" : "none",
          }}
          tabIndex={status === "success" ? 0 : -1}
          type="button"
        >
          Use this form
        </button>
      </motion.div>
    </div>
  );
};

const UnlimitedPreview = () => (
  <div
    aria-label="Unlimited submissions preview"
    className="relative flex h-full flex-col items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary/1 to-accent/20 p-4 shadow-inner"
  >
    <motion.div
      animate={{
        rotate: [0, 7, -7, 0],
        scale: [1, 1.08, 1],
        opacity: [0.85, 1, 0.92],
      }}
      aria-hidden="true"
      className="pointer-events-none absolute top-4 left-4 select-none text-accent opacity-10"
      initial={{ rotate: -8, scale: 0.85, opacity: 0.5 }}
      transition={{
        duration: 3,
        repeat: 100_000,
        ease: "easeInOut",
      }}
    >
      <InfinityIcon size={96} />
    </motion.div>

    {/* Core content */}
    <div className="relative z-10 flex flex-col items-center gap-4 px-2 py-4">
      <motion.div
        aria-hidden="true"
        className="mb-1 flex items-center justify-center"
      >
        <span
          className="font-bold text-5xl text-primary"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          ∞
        </span>
      </motion.div>

      <motion.div
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 220 }}
      >
        <div className="flex items-center gap-2 text-center font-medium text-foreground text-sm">
          Unlimited Forms, Fields, Users and Responses.
        </div>
      </motion.div>
    </div>
  </div>
);

const AnalyticsPreview = () => {
  const [isHovered, setIsHovered] = useState(false);
  const basePoints = useMemo(
    () => Array.from({ length: 10 }, () => Math.floor(Math.random() * 50) + 40),
    []
  );
  const [animatedPoints, setAnimatedPoints] = useState(basePoints);

  useEffect(() => {
    if (!isHovered) return;

    const interval = setInterval(() => {
      setAnimatedPoints(() =>
        Array.from({ length: basePoints.length }, () => Math.random() * 75 + 20)
      );
    }, 500);

    return () => clearInterval(interval);
  }, [isHovered, basePoints.length]);

  useEffect(() => {
    if (!isHovered) {
      setAnimatedPoints(basePoints);
    }
  }, [isHovered]);

  const WIDTH = 160;
  const HEIGHT = 64;
  const POINTS = animatedPoints.length;

  const svgPoints = useMemo(() => {
    const xStep = WIDTH / (POINTS - 1);
    return animatedPoints.map((v, i) => ({
      x: i * xStep,
      y: HEIGHT - (v / 100) * HEIGHT,
    }));
  }, [animatedPoints, POINTS]);

  const polylinePoints = svgPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div
      className="h-full overflow-hidden rounded-2xl bg-gradient-to-br from-primary/1 to-accent/20 p-5 shadow-inner"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-medium text-foreground text-xs">
            Weekly Responses
          </span>
          <motion.span className="font-semibold text-green-500 text-xs">
            ↗ +34%
          </motion.span>
        </div>

        <div className="flex h-32 items-end gap-1 md:h-16">
          <motion.svg
            className="h-full w-full"
            height={HEIGHT}
            style={{ minWidth: WIDTH, minHeight: HEIGHT, display: "block" }}
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            width={WIDTH}
          >
            <motion.polyline
              animate={{
                pathLength: 1,
                transition: { duration: 0.4, ease: "easeInOut" },
              }}
              fill="none"
              initial={{ pathLength: 0 }}
              points={polylinePoints}
              stroke="#4287f5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
            />
            {svgPoints.map((pt, i) => (
              <motion.circle
                animate={{
                  scale: 1,
                  transition: { delay: 0.05 * i },
                }}
                cx={pt.x}
                cy={pt.y}
                fill="#4287f5"
                initial={{ scale: 0 }}
                key={i}
                r={3}
              />
            ))}
          </motion.svg>
        </div>

        <motion.div
          animate={{
            opacity: isHovered ? [0.7, 1, 0.7] : 1,
          }}
          className="text-muted-foreground text-xs"
          transition={{
            duration: 1,
            repeat: isHovered ? globalThis.Number.POSITIVE_INFINITY : 0,
          }}
        >
          {isHovered ? "Live data updating..." : "1.2k responses this week"}
        </motion.div>
      </div>
    </div>
  );
};

const LogicBuilderPreview = () => {
  const steps = React.useMemo(
    () => [
      {
        label: (
          <>
            <span className="font-semibold text-primary">User responds</span>
            &nbsp;
            <span className="italic">“Yes”</span>
          </>
        ),
        prefix: (
          <span className="rounded bg-primary/80 px-1 py-0.5 font-bold text-white text-xs">
            IF
          </span>
        ),
        icon: (
          <div className="flex size-10 items-center justify-center rounded-full border-4 border-primary/20 bg-primary/90 shadow">
            <span className="font-bold text-white text-xs">IF</span>
          </div>
        ),
      },
      {
        label: (
          <span className="font-semibold text-primary">Show email field</span>
        ),
        prefix: (
          <span className="rounded bg-blue-400/80 px-1 py-0.5 font-bold text-white text-xs">
            THEN
          </span>
        ),
        icon: (
          <div className="flex size-10 items-center justify-center rounded-full border-4 border-blue-400/20 bg-blue-400/90 shadow">
            <Mail aria-hidden="true" className="size-5 text-white" />
          </div>
        ),
      },
      {
        label: (
          <span className="font-semibold text-muted-foreground">Skip</span>
        ),
        prefix: (
          <span className="rounded bg-muted-foreground/80 px-1 py-0.5 font-bold text-white text-xs">
            ELSE
          </span>
        ),
        icon: (
          <div className="flex size-10 items-center justify-center rounded-full border-4 border-muted/30 bg-muted-foreground/80 shadow">
            <Zap aria-hidden="true" className="size-5 text-white" />
          </div>
        ),
      },
    ],
    []
  );

  // Reveal/animation per step
  const [visibleIdx, setVisibleIdx] = React.useState(-1);
  React.useEffect(() => {
    setVisibleIdx(0);
    const interval = setInterval(() => {
      setVisibleIdx((idx) => (idx < steps.length - 1 ? idx + 1 : idx));
    }, 700);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      aria-label="Logic flow example"
      className="flex h-full flex-col justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary/1 to-accent/20 p-5 shadow-inner"
      style={{ minHeight: 210 }}
      tabIndex={0}
    >
      <div className="relative z-10 mx-auto flex w-full max-w-xs flex-col items-center gap-0">
        <ol
          className="flex w-full flex-col items-start gap-0 md:gap-2"
          role="list"
        >
          {steps.map((step, idx) => (
            <motion.li
              animate={
                idx <= visibleIdx
                  ? { opacity: 1, translateX: 0 }
                  : { opacity: 0, translateX: -24 }
              }
              aria-label={
                typeof step.label === "string" ? step.label : undefined
              }
              className={"relative flex w-full flex-row items-center px-0 py-2"}
              initial={{ opacity: 0, translateX: -24 }}
              key={idx}
              transition={{ delay: idx * 0.15, duration: 0.44 }}
            >
              {/* Prefix label */}
              <span className="mr-3 min-w-[2.5rem] select-none text-xs">
                {step.prefix}
              </span>
              <div
                className={
                  "relative mb-0.5 flex items-center gap-3 outline-none ring-offset-2 transition focus-visible:ring-2 focus-visible:ring-primary"
                }
              >
                {step.icon}
                <span className="relative whitespace-nowrap text-left font-medium text-[14px] text-foreground">
                  {step.label}
                </span>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
      {/* Accessible description */}
      <span className="sr-only">
        Preview of a simple conditional logic: if user responds&nbsp;“Yes”, then
        show the email field; otherwise, skip it.
      </span>
    </div>
  );
};

const ApiIntegrationPreview = () => {
  const [status, setStatus] = useState<"idle" | "fetching" | "success">("idle");
  const [step, setStep] = useState(0);

  // Simulate API call: status changes
  useEffect(() => {
    if (status === "idle") {
      const t = setTimeout(() => setStatus("fetching"), 400);
      return () => clearTimeout(t);
    }
    if (status === "fetching") {
      const t = setTimeout(() => setStatus("success"), 1800);
      return () => clearTimeout(t);
    }
  }, [status]);

  // Animation for step-through result rows when API is "successful"
  useEffect(() => {
    if (status !== "success") {
      setStep(0);
      return;
    }
    if (step < 3) {
      const t = setTimeout(() => setStep((s) => s + 1), 210);
      return () => clearTimeout(t);
    }
  }, [status, step]);

  // Data sample
  const apiData = useMemo(
    () => [
      {
        label: "Name",
        value: "John Doe",
        icon: (
          <span
            aria-hidden
            className="mr-2 inline-flex size-4 items-center justify-center rounded bg-primary/15 text-primary"
          >
            <svg fill="none" height={13} viewBox="0 0 14 14" width={13}>
              <circle
                cx={7}
                cy={5}
                r={3}
                stroke="currentColor"
                strokeWidth={1.2}
              />
              <path
                d="M2.7 11.3c.6-1.7 2.3-2.3 4.3-2.3 2.1 0 3.7.6 4.3 2.2"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth={1.2}
              />
            </svg>
          </span>
        ),
        delay: 0,
      },
      {
        label: "Email",
        value: "john@acme.com",
        icon: (
          <span
            aria-hidden
            className="mr-2 inline-flex size-4 items-center justify-center rounded bg-primary/15 text-primary"
          >
            <Mail size={13} strokeWidth={1.5} />
          </span>
        ),
        delay: 0.07,
      },
      {
        label: "Plan",
        value: "Premium Plan",
        icon: (
          <span
            aria-hidden
            className="mr-2 inline-flex size-4 items-center justify-center rounded bg-primary/15 text-primary"
          >
            <Zap size={13} strokeWidth={1.5} />
          </span>
        ),
        delay: 0.14,
      },
    ],
    []
  );

  return (
    <div
      aria-busy={status === "fetching"}
      aria-live="polite"
      className="relative flex h-fit flex-col justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary/2 to-accent/20 p-6 shadow-inner"
      style={{ minHeight: 210 }}
      tabIndex={0}
    >
      <div className="mb-3 flex items-center gap-3">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1 rounded-full border border-border bg-card/80 px-2 py-1.5 shadow"
          initial={{ opacity: 0, y: 10 }}
        >
          <span className="font-medium text-muted-foreground text-xs tracking-tight">
            acme.com/data
          </span>
        </motion.div>
        <motion.span
          animate={{
            opacity: [0.8, 1, 0.85, 1],
            transition: {
              duration: 1.3,
              repeat: status === "fetching" ? 100_000 : 0,
            },
          }}
          className={`ml-2 text-xs ${
            status === "success"
              ? "text-green-600 dark:text-green-400"
              : status === "fetching"
                ? "text-blue-500 dark:text-blue-300"
                : "text-muted-foreground"
          }`}
        >
          {status === "idle"
            ? "Ready"
            : status === "fetching"
              ? "Fetching..."
              : "Fetched!"}
        </motion.span>
      </div>

      {/* Main Content Card */}
      <motion.div
        animate={{
          scale: status === "success" ? 1 : 0.98,
          opacity: status !== "idle" ? 1 : 0.5,
          y: 0,
          filter: status === "success" ? "none" : "grayscale(40%) blur(0.2px)",
        }}
        aria-describedby={
          status === "success" ? "api-integration-result-desc" : undefined
        }
        className={
          "flex h-fit flex-col gap-0.5 rounded-2xl border border-border bg-card/80 p-3 transition-all"
        }
        initial={{ scale: 0.97, opacity: 0, y: 12 }}
        style={{ pointerEvents: status === "success" ? "auto" : "none" }}
        transition={{ type: "spring", stiffness: 220, damping: 26 }}
      >
        {/* Skeleton/Loader */}
        {status !== "success" ? (
          <div
            className="flex animate-pulse flex-col gap-3"
            id="api-integration-result-desc"
          >
            <div className="h-4 w-1/2 rounded bg-muted" />
            <div className="size-4/5 rounded bg-muted" />
            <div className="h-4 w-1/3 rounded bg-muted" />
          </div>
        ) : (
          <ol className="flex flex-col gap-2">
            {apiData.slice(0, step).map((item, i) => (
              <motion.li
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center text-xs"
                initial={{ opacity: 0, x: -16 }}
                key={item.label}
                transition={{ delay: item.delay }}
              >
                {item.icon}
                <span className="font-medium text-foreground">
                  {item.value}
                </span>
                <span className="!font-normal ml-2 text-muted-foreground">
                  {item.label}
                </span>
              </motion.li>
            ))}
          </ol>
        )}
      </motion.div>

      {/* Accessible status for screen readers */}
      <span className="sr-only">
        {status === "idle" && "Ready for API integration demo."}
        {status === "fetching" && "Contacting Stripe API, loading data..."}
        {status === "success" && "Stripe API data received and displayed."}
      </span>
    </div>
  );
};

const DigitalSignaturesPreview = () => {
  const [step, setStep] = React.useState<"idle" | "signing" | "done">("idle");

  React.useEffect(() => {
    if (step === "idle") {
      const start = setTimeout(() => setStep("signing"), 800);
      return () => clearTimeout(start);
    }
    if (step === "signing") {
      const finish = setTimeout(() => setStep("done"), 1900);
      return () => clearTimeout(finish);
    }
  }, [step]);

  const statusLabel =
    step === "idle"
      ? "Awaiting signature…"
      : step === "signing"
        ? "Signing in progress"
        : "Signed securely";

  return (
    <div className="relative flex h-fit flex-col items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary/1 to-accent/20 p-4 shadow-inner">
      {/* Paper */}
      <div
        aria-label={statusLabel}
        className="relative mx-auto flex min-h-[88px] w-full max-w-[290px] flex-col items-center rounded-lg border border-border bg-background/95 p-3 shadow"
        style={{ outline: "none" }}
        tabIndex={0}
      >
        <div className="mb-0.5 flex w-full items-center justify-between text-muted-foreground text-xs">
          <span>Sign Agreement</span>
          <span
            aria-live="polite"
            className={
              step === "done"
                ? "text-green-500 text-xs"
                : step === "signing"
                  ? "text-primary"
                  : undefined
            }
          >
            {step === "done" ? "✓ Signed" : step === "signing" ? "—" : "⤶"}
          </span>
        </div>
        {/* Simulated signature pad */}
        <div className="relative flex h-10 min-h-9 w-full items-center justify-center">
          <motion.svg
            animate={{
              opacity: step === "idle" ? 0.25 : 1,
            }}
            className="h-8 w-full select-none"
            initial={false}
            viewBox="0 0 120 24"
          >
            <motion.path
              animate={{
                pathLength:
                  step === "idle"
                    ? 0.17
                    : step === "signing"
                      ? [0.17, 0.4, 0.72, 1]
                      : 1,
                transition:
                  step === "idle"
                    ? { duration: 0.5 }
                    : step === "signing"
                      ? {
                          duration: 1.25,
                          times: [0, 0.2, 0.65, 1],
                          ease: "easeInOut",
                        }
                      : { duration: 0.4 },
              }}
              d="M10,18 Q25,8 40,12 T70,10 T100,14"
              fill="none"
              initial={{ pathLength: 0 }}
              stroke={
                step === "done" ? "var(--primary)" : "var(--muted-foreground)"
              }
              strokeWidth={step === "done" ? 2.5 : 2}
            />
          </motion.svg>
          {/* Stylized checkmark over signature for success */}
          <motion.svg
            animate={{
              opacity: step === "done" ? 1 : 0,
              scale: step === "done" ? 1 : 0.7,
            }}
            aria-hidden="true"
            className="absolute top-0 right-4 size-6"
            initial={false}
            style={{
              pointerEvents: "none",
              filter: "drop-shadow(0 1px 2px hsl(var(--hu-primary)/0.2))",
            }}
            transition={{ type: "spring", stiffness: 320, damping: 20 }}
            viewBox="0 0 24 24"
          >
            <path
              d="M5 13l4 4 9-9"
              fill="none"
              stroke="hsl(var(--hu-primary))"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.2"
            />
          </motion.svg>
        </div>
        <div
          aria-live="polite"
          className="mt-2 flex items-center justify-center gap-2 font-medium text-foreground text-xs"
        >
          {statusLabel}
        </div>
      </div>
      {/* Badge or floating icon */}
      <motion.span
        animate={{
          scale: step === "done" ? 1 : 0.75,
          opacity: step === "done" ? 1 : 0,
        }}
        aria-label={step === "done" ? "Signature Verified" : undefined}
        className="absolute right-2 bottom-2 rounded-full border-[1.8px] border-background bg-primary/90 px-2 py-0.5 font-medium text-[10px] text-white shadow-sm"
        initial={{ scale: 0.75, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
          delay: step === "done" ? 0.2 : 0,
        }}
      >
        Verified
      </motion.span>
      {/* Accessibility: aria-live for changes */}
      <span aria-live="polite" className="sr-only">
        {step === "idle" && "Awaiting e-signature. Please sign to continue."}
        {step === "signing" && "Signature is being written."}
        {step === "done" && "Signature complete and verified."}
      </span>
    </div>
  );
};

const EMAIL_TEMPLATES = [
  { title: "Contact Form", from: "john@example.com", time: "2 minutes ago" },
  {
    title: "Newsletter Signup",
    from: "sarah@gmail.com",
    time: "5 minutes ago",
  },
  { title: "Support Request", from: "mike@company.com", time: "8 minutes ago" },
  { title: "Feedback Form", from: "lisa@startup.io", time: "12 minutes ago" },
  {
    title: "Job Application",
    from: "alex@portfolio.dev",
    time: "15 minutes ago",
  },
] as const;

const EmailNotificationsPreview = () => {
  interface Notification {
    id: number;
    title: string;
    from: string;
    time: string;
  }

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const maxNotifications = 3;

  const addNotification = useCallback(() => {
    const randomEmail =
      EMAIL_TEMPLATES[Math.floor(Math.random() * EMAIL_TEMPLATES.length)];
    const newNotification = {
      id: Date.now(),
      ...randomEmail,
      time: "Just now",
    };
    setNotifications((prev) => {
      const updated = [newNotification, ...prev];
      return updated.slice(0, maxNotifications);
    });
  }, []);

  useEffect(() => {
    const initialTimer = setTimeout(() => addNotification(), 1000);
    const interval = setInterval(() => addNotification(), 3000);
    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [addNotification]);

  return (
    <div className="relative h-full overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/2 to-accent/20 p-0 shadow-inner">
      {/* Header */}
      <div
        className="sticky top-0 z-[999] flex items-center gap-3 rounded-t-2xl border-border border-b bg-card px-5 pt-5 pb-3"
        style={{ zIndex: 999 }}
      >
        <div
          aria-label="Mail notification"
          className="flex size-10 items-center justify-center rounded-xl border bg-primary/5 text-primary"
        >
          <Mail className="size-5" />
        </div>
        <div>
          <div className="font-medium text-foreground text-sm leading-tight">
            Email Notification
          </div>
          <div className="text-muted-foreground text-xs">
            You have {notifications.length > 0 ? notifications.length : "no"}{" "}
            new notification{notifications.length === 1 ? "" : "s"}
          </div>
        </div>
      </div>
      {/* Notifications List */}
      <div className="relative flex h-40 flex-col px-3 pt-2 pb-3">
        <AnimatePresence mode="popLayout">
          {notifications.length === 0 && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              aria-live="polite"
              className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs"
              exit={{ opacity: 0, y: 10 }}
              initial={{ opacity: 0, y: 10 }}
              key="empty-inbox"
              transition={{
                type: "tween",
                duration: 0.38,
                ease: [0.42, 0, 0.58, 1],
              }}
            >
              No new notifications yet.
            </motion.div>
          )}
          {notifications.map((notification, index) => (
            <motion.div
              animate={{
                opacity: 1,
                y: index * 6,
                scale: 1 - index * 0.035,
                zIndex: notifications.length - index + 6,

                transition: {
                  type: "tween",
                  duration: 0.32,
                  ease: "easeOut",
                },
              }}
              aria-label={`Email titled “${notification.title}” from ${notification.from}, received ${notification.time}`}
              className="ease relative mb-1.5 flex items-center gap-3 rounded-xl border border-border bg-background p-3 shadow-none outline-none transition-all last:mb-0 focus-within:ring-2 focus-within:ring-primary"
              exit={{
                opacity: 0,
                y: 25,
                scale: 0.92,
                transition: {
                  type: "tween",
                  duration: 0.32,
                  ease: "easeOut",
                },
              }}
              initial={{
                opacity: 0,
                y: -15,
                scale: 0.96,
                zIndex: notifications.length - index + 6,
                transition: {
                  type: "tween",
                  duration: 0.32,
                  ease: "easeOut",
                },
              }}
              key={notification.id}
              style={{
                opacity: index < maxNotifications ? 1 : 0,
                zIndex: notifications.length - index + 10,
                transform: `translateY(${index * 6}px) scale(${1 - index * 0.035})`,
              }}
              tabIndex={0}
              transition={{
                type: "tween",
                duration: 0.48,
                ease: "easeOut", // standard "ease-in-out" for smoothness
              }}
            >
              <div>
                <span className="inline-flex size-7 items-center justify-center rounded-full bg-primary/5 text-primary">
                  <Mail aria-hidden="true" className="size-4" />
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center">
                  <span className="truncate font-semibold text-foreground text-xs">
                    {notification.title}
                  </span>
                </div>
                <div
                  className="truncate text-muted-foreground text-xs"
                  title={notification.from}
                >
                  <span className="sr-only">From: </span>
                  {notification.from}
                </div>
              </div>
              <div
                aria-label={`Received ${notification.time}`}
                className="ml-2 flex-none text-[10px] text-muted-foreground"
              >
                {notification.time}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {/* Accessibility sr-only live region for announcement */}
      <span aria-live="polite" className="sr-only">
        {notifications.length === 0 && "No new email notifications yet."}
        {notifications.length > 0 &&
          `New email notification: ${notifications[0].title} from ${notifications[0].from}, ${notifications[0].time}`}
      </span>
    </div>
  );
};

export default function BentoFeatures() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="mx-auto w-full max-w-7xl bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col">
        {/* Bento Grid */}
        <div className="grid grid-cols-1 gap-px bg-border p-px lg:grid-cols-4">
          {mounted && (
            <>
              {/* AI Form Builder - Large featured card */}
              <FeatureCard
                className="col-span-2 row-span-2 w-full"
                description={
                  <>
                    <span className="font-medium opacity-100">
                      Instant form creation
                    </span>
                    <span className="opacity-50">
                      —just describe it and launch. Convert visitors in seconds.
                    </span>
                  </>
                }
                featured={true}
                icon={<Bot className="size-5" />}
                preview={<AiFormBuilderPreview />}
                title="AI Form Builder"
              />

              {/* Unlimited Submissions */}
              <FeatureCard
                className="col-span-1 bg-card"
                description={
                  <>
                    Truly{" "}
                    <span className="font-medium opacity-100">
                      unlimited forms and responses
                    </span>
                    .<span className="opacity-50"> Grow without limits.</span>
                  </>
                }
                icon={<InfinityIcon className="size-5" />}
                preview={<UnlimitedPreview />}
                title="Unlimited Everything"
              />

              {/* Analytics */}
              <FeatureCard
                className="col-span-1"
                description={
                  <>
                    <span className="opacity-50">
                      See who converts and why—
                    </span>
                    <span className="font-medium opacity-100">
                      get clear, actionable insights
                    </span>
                    <span className="opacity-50">.</span>
                  </>
                }
                icon={<TrendingUp className="size-5" />}
                preview={<AnalyticsPreview />}
                title="AI Analytics"
              />

              {/* Email Notifications */}
              <FeatureCard
                className="col-span-2"
                description={
                  <>
                    <span className="opacity-50">Never miss a lead—</span>
                    <span className="font-medium opacity-100">
                      get instant alerts and automate follow-ups.
                    </span>
                  </>
                }
                icon={<Mail className="size-5" />}
                preview={<EmailNotificationsPreview />}
                title="Smart Notifications"
              />

              {/* API Integration */}
              <FeatureCard
                className="col-span-1 bg-card"
                description={
                  <>
                    <span className="font-medium opacity-100">
                      Sync leads anywhere
                    </span>
                    <span className="opacity-50">
                      —connect with any service or workflow.
                    </span>
                  </>
                }
                icon={<Zap className="size-5" />}
                preview={<ApiIntegrationPreview />}
                title="API & Webhooks"
              />

              {/* Signature Fields */}
              <FeatureCard
                className="col-span-1"
                description={
                  <>
                    <span className="opacity-50">Add signature fields to </span>
                    <span className="font-medium opacity-100">
                      collect e-signatures
                    </span>
                    <span className="opacity-50"> in any form.</span>
                  </>
                }
                icon={<PenTool className="size-5" />}
                preview={<DigitalSignaturesPreview />}
                title="Form Signatures"
              />

              {/* Logic Builder */}
              <FeatureCard
                className="col-span-2"
                description={
                  <>
                    <span className="font-medium opacity-100">
                      Personalize every journey
                    </span>
                    <span className="opacity-50">
                      —show or hide questions based on answers.
                    </span>
                  </>
                }
                icon={<GitBranch className="size-5" />}
                preview={<LogicBuilderPreview />}
                title="Visual Logic Builder"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
