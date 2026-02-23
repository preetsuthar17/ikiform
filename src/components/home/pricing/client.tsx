"use client";

import {
	Brush,
	ChevronRightCircle,
	Code2,
	Database,
	Gauge,
	Infinity,
	ListChecks,
	ShieldBan,
	ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import React, { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { getLocaleFromPathname, withLocaleHref } from "@/lib/i18n/pathname";
import { usePremiumStatus } from "@/hooks/use-premium-status";

interface Product {
	id: string;
	name: string;
}

interface PricingClientProps {
	products: Product[];
}

const planProductIdMap = {
	monthly: "05f52efa-2102-4dd0-9d1d-1538210d6712",
	yearly: "4eff4c1d-56de-4111-96de-b5ec8124dd4b",
	onetime: "2e9b8531-0d45-40df-be1c-65482eefeb85",
};

const PRICING = {
	monthly: {
		price: 19,
		originalPrice: 29,
		period: "/Mo",
		billedAs: "Billed monthly • Cancel anytime",
	},
	yearly: {
		price: 16,
		originalPrice: 19,
		period: "/Mo",
		billedAs: "Billed annually ($192/yr) • Cancel anytime",
	},
	onetime: {
		price: 99,
		originalPrice: 139,
		period: "",
		billedAs: "One-time payment • Lifetime access",
	},
};

export default function PricingClient({ products }: PricingClientProps) {
	const t = useTranslations("home.pricing");
	const sectionRef = useRef<HTMLElement>(null);
	const [purchaseLoading, setPurchaseLoading] = useState(false);
	const pathname = usePathname();
	const locale = getLocaleFromPathname(pathname);
	const { user } = useAuth();
	usePremiumStatus(user);

	const toLocaleHref = (href: string) =>
		locale ? withLocaleHref(href, locale) : href;

	const featureList = [
		{
			label: t("features.unlimitedForms"),
			icon: Infinity,
		},
		{
			label: t("features.apiWebhooks"),
			icon: Code2,
		},
		{
			label: t("features.responseLimits"),
			icon: Gauge,
		},
		{
			label: t("features.quizScoring"),
			icon: ListChecks,
		},
		{
			label: t("features.formDataApi"),
			icon: Database,
		},
		{
			label: t("features.customBranding"),
			icon: Brush,
		},
		{
			label: t("features.spamProtection"),
			icon: ShieldCheck,
		},
		{
			label: t("features.passwordProfanity"),
			icon: ShieldBan,
		},
	];

	useEffect(() => {
		setPurchaseLoading(false);
	}, [user]);

	const handlePurchaseClick = () => {
		setPurchaseLoading(true);
		const timeout = setTimeout(() => setPurchaseLoading(false), 5000);
		return () => clearTimeout(timeout);
	};

	if (!products || products.length === 0) return null;

	function PricingHeader() {
		return (
			<div className="flex flex-col gap-4 px-8 text-center md:px-12">
				<h2
					className="text-center font-medium text-3xl leading-tight tracking-[-2px] md:text-4xl"
					id="pricing-title"
				>
					{t("title")}
				</h2>
				<p className="text-center text-base text-muted-foreground md:text-lg">
					{t("description")}
				</p>
			</div>
		);
	}

	function PlanFeatures({
		features,
	}: {
		features: { label: string; icon: any }[];
	}) {
		return (
			<ul className="mb-8 flex list-none flex-col gap-3 p-0">
				{features.map(({ label, icon: Icon }) => (
					<li className="flex items-center gap-3" key={label}>
						<Icon
							aria-hidden="true"
							className="size-4 shrink-0 text-primary opacity-80"
							focusable="false"
						/>
						<span className="text-foreground text-sm opacity-80">{label}</span>
					</li>
				))}
			</ul>
		);
	}

	function PlanCard({
		plan,
		isEdgeLeft,
		isEdgeRight,
	}: {
		plan: any;
		isEdgeLeft: boolean;
		isEdgeRight: boolean;
	}) {
		return (
			<article
				className={`${plan.popular ? "bg-card" : "bg-transparent"} border p-6 md:p-8 ${isEdgeLeft ? "border-l-0" : ""} ${isEdgeRight ? "border-r" : "border-r-0"}`}
				key={plan.key}
			>
				<header className="mb-6 flex items-center justify-between">
					<div className="flex flex-col gap-2">
						<h3 className="font-medium text-2xl text-foreground tracking-tight">
							{plan.title}
						</h3>
						<p className="max-w-md text-muted-foreground text-sm">
							{plan.byline}
						</p>
					</div>
					{plan.popular ? (
						<Badge className="rounded-full border px-3 py-1 text-xs">
							{t("popular")}
						</Badge>
					) : null}
				</header>
				<div className="mb-6 flex flex-col gap-2">
					<div className="flex items-baseline gap-2">
						{plan.key === "lifetime" ? (
							<>
								<span className="font-semibold text-4xl tracking-tighter">
									{plan.price}
								</span>
							</>
						) : (
							<span className="font-semibold text-3xl text-foreground tracking-tighter">
								{plan.price}
							</span>
						)}
						{plan.period ? (
							<span className="text-muted-foreground">{plan.period}</span>
						) : null}
					</div>
				</div>
				<PlanFeatures features={plan.features} />
				<div className="flex flex-col gap-2">
					<Link
						aria-label={`${plan.title} – Proceed to ${user ? "checkout" : "login"}`}
						className="block w-full"
						href={
							user
								? `/checkout?products=${plan.productId}&customerEmail=${user?.email}`
								: toLocaleHref("/login")
						}
						onClick={handlePurchaseClick}
					>
						<Button
							aria-busy={purchaseLoading || undefined}
							className="flex h-11 w-full items-center justify-between gap-2 rounded-full"
							disabled={purchaseLoading}
							variant={plan.popular ? "default" : "outline"}
						>
							<span className="flex w-full items-center justify-between px-2">
								{plan.ctaLabel}
								<ChevronRightCircle />
							</span>
						</Button>
					</Link>
					{plan.ctaLabel === t("cta.startTrial") && (
						<span className="flex items-center justify-center text-center text-muted-foreground text-sm">
							{t("noCard")}
						</span>
					)}
				</div>
			</article>
		);
	}

	const plans = React.useMemo(
		() => [
			{
				key: "monthly",
				title: t("plans.monthly.title"),
				byline: t("plans.monthly.byline"),
				price: `$${PRICING.monthly.price}`,
				period: PRICING.monthly.period,
				features: featureList,
				productId: planProductIdMap.monthly,
				ctaLabel: t("cta.startTrial"),
			},
			{
				key: "lifetime",
				popular: true,
				title: t("plans.lifetime.title"),
				byline: t("plans.lifetime.byline"),
				price: `$${PRICING.onetime.price}`,
				period: PRICING.onetime.period,
				features: featureList,
				productId: planProductIdMap.onetime,
				ctaLabel: t("cta.getLifetime"),
			},
			{
				key: "yearly",
				title: t("plans.yearly.title"),
				byline: t("plans.yearly.byline"),
				price: `$${PRICING.yearly.price}`,
				period: PRICING.yearly.period,
				features: featureList,
				productId: planProductIdMap.yearly,
				ctaLabel: t("cta.startTrial"),
			},
		],
		[t]
	);

	return (
		<section
			aria-busy={purchaseLoading || undefined}
			aria-labelledby="pricing-title"
			className="mx-auto w-full max-w-7xl bg-background"
			id="pricing"
			ref={sectionRef}
		>
			<div className="mx-auto flex w-full flex-col">
				<div className="mx-auto flex w-full flex-col gap-22 border border-t-0 border-b-0 py-22">
					<PricingHeader />
					<div>
						<div className="grid grid-cols-1 lg:grid-cols-3">
							{plans.map((plan, idx, arr) => (
								<PlanCard
									isEdgeLeft={idx !== arr.length - 2}
									isEdgeRight={idx === arr.length - 2}
									key={plan.key}
									plan={plan}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
