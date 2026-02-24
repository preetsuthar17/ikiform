"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { stripLocalePrefix } from "@/lib/i18n/pathname";
import { cn } from "@/lib/utils";

interface User {
	has_premium: boolean;
	has_free_trial: boolean;
	created_at: string;
}

interface TrialBannerWrapperProps {
	className?: string;
}

function formatTrialTimeLeft(
	endsAt: Date,
	now: Date,
	units: { day: string; hour: string; minute: string; second: string }
): string {
	const diff = Math.max(endsAt.getTime() - now.getTime(), 0);
	const days = Math.floor(diff / (1000 * 60 * 60 * 24));
	const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((diff % (1000 * 60)) / 1000);

	if (days > 0) {
		return `${days}${units.day} ${hours}${units.hour} ${minutes}${units.minute}`;
	}
	if (hours > 0) {
		return `${hours}${units.hour} ${minutes}${units.minute} ${seconds}${units.second}`;
	}
	return `${minutes}${units.minute} ${seconds}${units.second}`;
}

export function TrialBannerWrapper({ className }: TrialBannerWrapperProps) {
	const t = useTranslations("product.trialBanner");
	const [user, setUser] = useState<User | null>(null);
	const [isDismissed, setIsDismissed] = useState(false);
	const [timeLeft, setTimeLeft] = useState<string>("");
	const [isExpired, setIsExpired] = useState(false);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const bannerRef = useRef<HTMLDivElement>(null);

	const pathname = usePathname();
	const normalizedPathname = stripLocalePrefix(pathname);

	const shouldHideBanner = useMemo(
		() =>
			normalizedPathname.startsWith("/f/") ||
			normalizedPathname.startsWith("/forms/"),
		[normalizedPathname]
	);

	const trialEndDate = useMemo(() => {
		if (!user?.created_at) return null;
		return new Date(
			new Date(user.created_at).getTime() + 14 * 24 * 60 * 60 * 1000
		);
	}, [user?.created_at]);

	const fetchUser = useCallback(async () => {
		try {
			const response = await fetch("/api/user", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (response.ok) {
				const data = await response.json();
				if (data.user) {
					setUser(data.user);
				}
			}
		} catch (error) {
			console.error("Failed to fetch user data:", error);
		}
	}, []);

	useEffect(() => {
		fetchUser();
	}, [fetchUser]);

	useEffect(() => {
		if (!trialEndDate) return;

		const updateTime = () => {
			const now = new Date();
			const timeDiff = trialEndDate.getTime() - now.getTime();

			if (timeDiff <= 0) {
				setTimeLeft(t("expired"));
				setIsExpired(true);
				if (intervalRef.current) {
					clearInterval(intervalRef.current);
					intervalRef.current = null;
				}
				return;
			}

			setTimeLeft(
				formatTrialTimeLeft(trialEndDate, now, {
					day: t("units.day"),
					hour: t("units.hour"),
					minute: t("units.minute"),
					second: t("units.second"),
				})
			);
		};

		updateTime();
		intervalRef.current = setInterval(updateTime, 1000);

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, [t, trialEndDate]);

	const handleDismiss = useCallback(() => {
		setIsDismissed(true);
		localStorage.setItem("trial-banner-dismissed", "true");
	}, []);

	useEffect(() => {
		const wasDismissed = localStorage.getItem("trial-banner-dismissed");
		if (wasDismissed === "true") {
			setIsDismissed(true);
		}
	}, []);
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
			aria-label={t("aria.status")}
			aria-live="polite"
			className={cn(
				"fixed top-0 left-0 z-50 w-full bg-foreground py-1",
				"border-blue-500/20 border-b",
				className
			)}
			ref={bannerRef}
			role="banner"
		>
			<div className="mx-auto flex max-w-7xl items-center justify-center">
				<div className="flex items-center gap-2 text-white">
					<span className="font-medium text-sm">
						<span className="hidden sm:inline">{t("endsInPrefix")}</span>
						<span className="font-mono font-semibold text-sm tabular-nums">
							{timeLeft}
						</span>
						<span className="sm:hidden">{t("remainingSuffix")}</span>
					</span>
				</div>
			</div>
		</div>
	);
}
