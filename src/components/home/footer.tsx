"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import React from "react";
import { FaDiscord, FaGithub, FaXTwitter } from "react-icons/fa6";
import {
	getLocaleFromPathname,
	stripLocalePrefix,
	withLocaleHref,
} from "@/lib/i18n/pathname";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Separator } from "../ui";

const BADGES = [
	{
		href: "https://www.producthunt.com/products/ikiform?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-ikiform-2",
		img: {
			src: "https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1003917&theme=light&t=1754896632153",
			alt: "Ikiform - An open-source alternative to Google Forms and Typeform | Product Hunt",
			width: 120,
			height: 32,
		},
	},
	{
		href: "https://startupfa.me/s/ikiform.com?utm_source=www.ikiform.com",
		img: {
			src: "https://startupfa.me/badges/featured/default.webp",
			alt: "Featured on Startup Fame",
			width: 120,
			height: 32,
		},
	},
	{
		href: "https://twelve.tools",
		img: {
			src: "https://twelve.tools/badge3-light.svg",
			alt: "Featured on Twelve Tools",
			width: 120,
			height: 32,
		},
	},
] as const;

const FooterLogo = React.memo(function FooterLogo() {
	const tNav = useTranslations("nav");
	const pathname = usePathname();
	const locale = getLocaleFromPathname(pathname);
	const homeHref = locale ? withLocaleHref("/", locale) : "/";

	return (
		<Link className="inline-flex" href={homeHref}>
			<span className="flex items-center gap-3 text-3xl tracking-tight">
				<Image
					alt={tNav("ikiformLogo")}
					className="size-10 rounded-lg"
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
	);
});

const FooterBadges = React.memo(function Footer() {
	return (
		<div className="sr-only flex flex-wrap items-center justify-start gap-3">
			{BADGES.map((badge) => (
				<a
					className="rounded transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary"
					href={badge.href}
					key={badge.href}
					rel="noopener noreferrer"
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
});

const NavigationLinks = React.memo(function NavigationLinks() {
	const tNav = useTranslations("nav");
	const pathname = usePathname();
	const locale = getLocaleFromPathname(pathname);
	const toLocaleHref = (href: string) =>
		locale ? withLocaleHref(href, locale) : href;

	return (
		<div className="flex flex-col gap-4">
			<h3 className="font-dm-sans font-medium text-foreground">
				{tNav("navigation")}
			</h3>
			<ul className="flex flex-col gap-2">
				<li>
					<Link
						className="text-muted-foreground text-sm transition-colors hover:text-foreground"
						href={toLocaleHref("/")}
					>
						{tNav("home")}
					</Link>
				</li>
				<li>
					<Link
						className="text-muted-foreground text-sm transition-colors hover:text-foreground"
						href={toLocaleHref("/#features")}
					>
						{tNav("features")}
					</Link>
				</li>
				<li>
					<Link
						className="text-muted-foreground text-sm transition-colors hover:text-foreground"
						href={toLocaleHref("/#pricing")}
					>
						{tNav("pricing")}
					</Link>
				</li>
				<li>
					<Link
						className="text-muted-foreground text-sm transition-colors hover:text-foreground"
						href={toLocaleHref("/login")}
					>
						{tNav("login")}
					</Link>
				</li>
				<li>
					<Link
						className="text-muted-foreground text-sm transition-colors hover:text-foreground"
						href={toLocaleHref("/ai-builder")}
					>
						{tNav("aiBuilder")}
					</Link>
				</li>
				<li>
					<Link
						className="text-muted-foreground text-sm transition-colors hover:text-foreground"
						href={toLocaleHref("/dashboard")}
					>
						{tNav("dashboard")}
					</Link>
				</li>
			</ul>
		</div>
	);
});

const LegalLinks = React.memo(function LegalLinks() {
	const tNav = useTranslations("nav");
	const pathname = usePathname();
	const locale = getLocaleFromPathname(pathname);
	const toLocaleHref = (href: string) =>
		locale ? withLocaleHref(href, locale) : href;

	return (
		<div className="flex flex-col gap-4">
			<h3 className="font-dm-sans font-medium text-foreground">
				{tNav("legal")}
			</h3>
			<ul className="flex flex-col gap-2">
				<li>
					<Link
						className="text-muted-foreground text-sm transition-colors hover:text-foreground"
						href={toLocaleHref("/legal/privacy")}
					>
						{tNav("privacy")}
					</Link>
				</li>
				<li>
					<Link
						className="text-muted-foreground text-sm transition-colors hover:text-foreground"
						href={toLocaleHref("/legal/terms")}
					>
						{tNav("terms")}
					</Link>
				</li>
				<li>
					<Link
						className="text-muted-foreground text-sm transition-colors hover:text-foreground"
						href={toLocaleHref("/legal/gdpr")}
					>
						{tNav("gdpr")}
					</Link>
				</li>
				<li>
					<Link
						className="text-muted-foreground text-sm transition-colors hover:text-foreground"
						href={toLocaleHref("/legal/dpa")}
					>
						{tNav("dpa")}
					</Link>
				</li>
			</ul>
		</div>
	);
});

const ResourcesLinks = React.memo(function ResourcesLinks() {
	const tNav = useTranslations("nav");

	return (
		<div className="flex flex-col gap-4">
			<h3 className="font-dm-sans font-medium text-foreground">
				{tNav("resources")}
			</h3>
			<ul className="flex flex-col gap-2">
				<li>
					<Link
						className="text-muted-foreground text-sm transition-colors hover:text-foreground"
						href="https://www.ikiform.com/feature-request"
						rel="noopener noreferrer"
						target="_blank"
					>
						{tNav("featureRequest")}
					</Link>
				</li>
				<li>
					<Link
						className="text-muted-foreground text-sm transition-colors hover:text-foreground"
						href="https://www.ikiform.com/feedback"
						rel="noopener noreferrer"
						target="_blank"
					>
						{tNav("feedback")}
					</Link>
				</li>
				<li>
					<Link
						className="text-muted-foreground text-sm transition-colors hover:text-foreground"
						href="https://www.ikiform.com/bug-report"
						rel="noopener noreferrer"
						target="_blank"
					>
						{tNav("bugReport")}
					</Link>
				</li>
				<li>
					<Link
						className="text-muted-foreground text-sm transition-colors hover:text-foreground"
						href="https://www.ikiform.com/github"
						rel="noopener noreferrer"
						target="_blank"
					>
						{tNav("githubRepository")}
					</Link>
				</li>
			</ul>
		</div>
	);
});

const ProductsLinks = React.memo(function ProductsLinks() {
	const tNav = useTranslations("nav");

	return (
		<div className="flex flex-col gap-4">
			<h3 className="font-dm-sans font-medium text-foreground">
				{tNav("products")}
			</h3>
			<ul className="flex flex-col gap-2">
				<li>
					<Link
						className="text-muted-foreground text-sm transition-colors hover:text-foreground"
						href="https://hextaui.com?ref=ikiform"
						rel="noopener noreferrer"
						target="_blank"
					>
						HextaUI
					</Link>
				</li>
				<li>
					<Link
						className="text-muted-foreground text-sm transition-colors hover:text-foreground"
						href="https://hextaui.com/blocks?ref=ikiform"
						rel="noopener noreferrer"
						target="_blank"
					>
						HextaUI Blocks
					</Link>
				</li>
			</ul>
		</div>
	);
});

const LanguageSwitcher = React.memo(function LanguageSwitcher() {
	const tNav = useTranslations("nav");
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();
	const locale = getLocaleFromPathname(pathname) ?? "en";
	const normalizedPathname = stripLocalePrefix(pathname);

	return (
		<div className="flex items-center gap-2">
			<span className="text-muted-foreground text-sm">{tNav("language")}</span>
			<Select
				onValueChange={(value) => {
					if (value !== "en" && value !== "es") return;
					if (value === locale) return;

					const localizedPath = withLocaleHref(normalizedPathname, value);
					const query = searchParams.toString();
					const nextHref = query ? `${localizedPath}?${query}` : localizedPath;
					router.push(nextHref);
					router.refresh();
				}}
				value={locale}
			>
				<SelectTrigger
					aria-label={tNav("language")}
					className="h-8 min-w-[130px]"
					size="sm"
				>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="en">{tNav("english")}</SelectItem>
					<SelectItem value="es">{tNav("spanish")}</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
});

const SocialLinks = React.memo(function SocialLinks() {
	const tNav = useTranslations("nav");
	return (
		<div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
			<Link
				aria-label={tNav("socialGithubAria")}
				className="flex items-center gap-2 transition-colors hover:text-foreground"
				href="/github"
				rel="noopener noreferrer"
				target="_blank"
			>
				<FaGithub aria-hidden className="size-4" />
			</Link>
			<Link
				aria-label={tNav("socialTwitterAria")}
				className="flex items-center gap-2 transition-colors hover:text-foreground"
				href="/twitter"
				rel="noopener noreferrer"
				target="_blank"
			>
				<FaXTwitter aria-hidden className="size-4" />
			</Link>
			<Link
				aria-label={tNav("socialDiscordAria")}
				className="flex items-center gap-2 transition-colors hover:text-foreground"
				href="/discord"
				rel="noopener noreferrer"
				target="_blank"
			>
				<FaDiscord aria-hidden className="size-5" />
			</Link>
			<Link
				aria-label={tNav("socialEmailAria")}
				className="flex items-center gap-2 transition-colors hover:text-foreground"
				href="/email"
				rel="noopener noreferrer"
				target="_blank"
			>
				hi@ikiform.com
			</Link>
		</div>
	);
});

export default function Footer() {
	const tFooter = useTranslations("footer");

	return (
		<footer className="mx-auto my-12 w-full max-w-7xl bg-background">
			<div className="mx-auto flex w-full flex-col">
				{}
				<div>
					<div className="flex flex-col gap-8">
						{}
						<div className="flex flex-col gap-8 lg:flex-row lg:justify-between">
							{}
							<div className="flex shrink-0 flex-col gap-8">
								<div className="flex shrink-0 flex-col gap-4">
									<FooterLogo />
									<p className="max-w-sm text-muted-foreground text-sm">
										© {new Date().getFullYear()} {tFooter("madeBy")} —{" "}
										<Link
											className="font-medium text-foreground transition-colors hover:underline"
											href="https://x.com/preetsuthar17"
											rel="noopener noreferrer"
											target="_blank"
										>
											@preetsuthar17
										</Link>
									</p>
								</div>

								{}
								<div className="flex flex-col gap-4">
									<a
										href="https://vercel.com/open-source-program?utm_source=ikiform"
										rel="noopener noreferrer"
										target="_blank"
									>
										<img
											alt="Vercel OSS Program"
											src="https://vercel.com/oss/program-badge.svg"
										/>
									</a>
									<FooterBadges />
								</div>
							</div>
							<Separator className="flex lg:hidden" />
							{}
							<div className="flex flex-wrap gap-8 md:grid md:grid-cols-4 md:gap-10">
								<NavigationLinks />
								<LegalLinks />
								<ResourcesLinks />
								<ProductsLinks />
							</div>
						</div>

						<Separator />
						{}
						<div className="flex w-full flex-col items-end justify-center gap-6">
							<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
								<SocialLinks />
								<LanguageSwitcher />
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
