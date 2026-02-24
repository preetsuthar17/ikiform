"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import React from "react";
import { getLocaleFromPathname, withLocaleHref } from "@/lib/i18n/pathname";

import { HeaderClient } from "./client";

interface NavLink {
	href: string;
	labelKey: string;
}

export const PRIMARY_LINKS: NavLink[] = [
	{ href: "/", labelKey: "home" },
	{ href: "/#features", labelKey: "features" },
	{ href: "/feedback", labelKey: "feedback" },
	{ href: "/#pricing", labelKey: "pricing" },
	{ href: "/changelog", labelKey: "changelog" },
];

const AppLogo = React.memo(function AppLogo({
	ariaLabel,
	href,
}: {
	ariaLabel: string;
	href: string;
}) {
	return (
		<Link
			aria-label={ariaLabel}
			className="flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
			href={href}
		>
			<Image
				alt=""
				className="size-8"
				height={32}
				src="/favicon.ico"
				width={32}
			/>
			<span className="font-semibold text-2xl tracking-tight">Ikiform</span>
		</Link>
	);
});

AppLogo.displayName = "AppLogo";

export default function Header() {
	const tNav = useTranslations("nav");
	const pathname = usePathname();
	const locale = getLocaleFromPathname(pathname);
	const homeHref = locale ? withLocaleHref("/", locale) : "/";
	return (
		<nav
			aria-label={tNav("primaryNavigation")}
			className="mx-auto mt-12 flex w-full max-w-7xl items-center justify-between gap-8 font-inter text-sm"
		>
			<a
				className="sr-only rounded-md bg-background px-3 py-2 shadow-md focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
				href="#main-content"
			>
				{tNav("skipToContent")}
			</a>
			<div className="flex shrink-0 items-center">
				<AppLogo ariaLabel={tNav("ikiformHome")} href={homeHref} />
			</div>
			<div className="hidden flex-1 items-center justify-center md:flex">
				<HeaderClient.NavLinks />
			</div>
			<div className="flex shrink-0 items-center">
				<HeaderClient primaryLinks={PRIMARY_LINKS} />
			</div>
		</nav>
	);
}
