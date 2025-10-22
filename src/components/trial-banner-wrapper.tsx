"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface User {
  has_premium: boolean;
  has_free_trial: boolean;
  created_at: string;
}

function formatTrialTimeLeft(endsAt: Date, now: Date): string {
  let diff = Math.max(endsAt.getTime() - now.getTime(), 0);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * (1000 * 60 * 60 * 24);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * (1000 * 60 * 60);
  const mins = Math.floor(diff / (1000 * 60));
  diff -= mins * (1000 * 60);
  const secs = Math.floor(diff / 1000);

  return `${days} day${days !== 1 ? "s" : ""} ${hours} hour${hours !== 1 ? "s" : ""} ${mins} min ${secs} second${secs !== 1 ? "s" : ""}`;
}

export function TrialBannerWrapper() {
  const [user, setUser] = useState<User | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isExpired, setIsExpired] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const pathname = usePathname();

  const shouldHideBanner =
    pathname.startsWith("/f/") || pathname.startsWith("/forms/");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user");
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUser();
  }, []);

  // Calculate and update the time left (days hours min seconds)
  useEffect(() => {
    if (!user?.created_at) return;

    const trialEnd = new Date(
      new Date(user.created_at).getTime() + 14 * 24 * 60 * 60 * 1000
    );

    function updateTime() {
      const now = new Date();
      if (trialEnd.getTime() - now.getTime() <= 0) {
        setTimeLeft("0 days 0 hours 0 min 0 seconds");
        setIsExpired(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }
      setTimeLeft(formatTrialTimeLeft(trialEnd, now));
    }

    updateTime();
    intervalRef.current = setInterval(updateTime, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [user?.created_at]);

  if (
    shouldHideBanner ||
    isDismissed ||
    !user ||
    !user.has_premium ||
    !user.has_free_trial ||
    isExpired
  ) {
    return null;
  }

  return (
    <div
      aria-live="polite"
      className="fixed top-0 left-0 z-50 w-full bg-foreground"
      role="status"
    >
      <div
        className="mx-auto flex max-w-screen-xl items-center justify-center py-1"
        tabIndex={-1}
      >
        <span className="flex items-center gap-1 font-medium text-sm text-white">
          <span className="text- hidden sm:inline">
            Your free trial ends in
          </span>
          <span className="text-sm tabular-nums">{timeLeft}</span>
          <span className="inline sm:hidden">d h m s</span>
        </span>
      </div>
    </div>
  );
}
