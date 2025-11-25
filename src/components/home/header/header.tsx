import Image from "next/image";
import Link from "next/link";
import React from "react";

import { HeaderClient } from "./client";

interface NavLink {
	href: string;
	label: string;
}

export const PRIMARY_LINKS: NavLink[] = [
	{ href: "/", label: "Home" },
	{ href: "/#features", label: "Features" },
	{ href: "/feedback", label: "Feedback" },
	{ href: "/#pricing", label: "Pricing" },
	{ href: "/changelog", label: "Changelog" },
];

const AppLogo = React.memo(function AppLogo() {
	return (
		<Link
			href="/"
			className="flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
			aria-label="Ikiform home"
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
	return (
		<nav
			aria-label="Primary navigation"
			className="mx-auto mt-12 flex w-full max-w-7xl items-center justify-between gap-8 font-inter text-sm"
		>
			<a
				className="sr-only rounded-md bg-background px-3 py-2 shadow-md focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
				href="#main-content"
			>
				Skip to content
			</a>
			<div className="flex shrink-0 items-center">
				<AppLogo />
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
