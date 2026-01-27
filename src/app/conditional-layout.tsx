"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/home/footer";
import Header from "@/components/home/header/header";
import { TrialBannerWrapper } from "@/components/trial-banner-wrapper";

interface ConditionalLayoutProps {
	children: React.ReactNode;
}

export default function ConditionalLayout({
	children,
}: ConditionalLayoutProps) {
	const pathname = usePathname();

	const hideHeaderFooter =
		pathname.startsWith("/form-builder") ||
		pathname.includes("/preview") ||
		pathname.includes("/forms") ||
		pathname.includes("/ai-builder") ||
		pathname.includes("/login") ||
		pathname.includes("/f") ||
		pathname.includes("/demo-form-builder");

	const isDashboard = pathname === "/dashboard";
	const isHomePage = pathname === "/";

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
