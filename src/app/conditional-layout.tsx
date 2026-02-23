"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/home/footer";
import Header from "@/components/home/header/header";
import { TrialBannerWrapper } from "@/components/trial-banner-wrapper";
import { stripLocalePrefix } from "@/lib/i18n/pathname";

interface ConditionalLayoutProps {
	children: React.ReactNode;
}

export default function ConditionalLayout({
	children,
}: ConditionalLayoutProps) {
	const pathname = usePathname();
	const normalizedPathname = stripLocalePrefix(pathname);

	const hideHeaderFooter =
		normalizedPathname.startsWith("/form-builder") ||
		normalizedPathname.includes("/preview") ||
		normalizedPathname.includes("/forms") ||
		normalizedPathname.includes("/ai-builder") ||
		normalizedPathname.includes("/login") ||
		normalizedPathname.includes("/f") ||
		normalizedPathname.includes("/demo-form-builder");

	const isDashboard = normalizedPathname === "/dashboard";
	const isHomePage = normalizedPathname === "/";

	if (hideHeaderFooter) {
		return <>{children}</>;
	}

	return (
		<>
			<div
				className={`z-10 flex min-h-screen flex-col gap-12 px-4 md:px-8 ${isDashboard ? "justify-start" : "justify-between"} ${isDashboard ? "pb-12" : ""}`}
			>
				<Header />
				<TrialBannerWrapper />
				{children}
				{!isDashboard && <Footer />}
			</div>
		</>
	);
}
