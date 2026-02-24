"use client";

import { usePathname } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import Footer from "@/components/home/footer";
import Header from "@/components/home/header/header";
import { TrialBannerWrapper } from "@/components/trial-banner-wrapper";
import { type AppLocale, routing } from "@/i18n/routing";
import { getLocaleFromPathname, stripLocalePrefix } from "@/lib/i18n/pathname";
import enFooterMessages from "../../messages/en/footer.json";
import enNavMessages from "../../messages/en/nav.json";
import enProductMessages from "../../messages/en/product.json";
import esFooterMessages from "../../messages/es/footer.json";
import esNavMessages from "../../messages/es/nav.json";
import esProductMessages from "../../messages/es/product.json";

interface ConditionalLayoutProps {
	children: React.ReactNode;
}

const CHROME_MESSAGES: Record<
	AppLocale,
	{
		nav: typeof enNavMessages;
		footer: typeof enFooterMessages;
		product: {
			trialBanner: typeof enProductMessages.trialBanner;
		};
	}
> = {
	en: {
		nav: enNavMessages,
		footer: enFooterMessages,
		product: {
			trialBanner: enProductMessages.trialBanner,
		},
	},
	es: {
		nav: esNavMessages,
		footer: esFooterMessages,
		product: {
			trialBanner: esProductMessages.trialBanner,
		},
	},
};

export default function ConditionalLayout({
	children,
}: ConditionalLayoutProps) {
	const pathname = usePathname();
	const normalizedPathname = stripLocalePrefix(pathname);
	const locale = getLocaleFromPathname(pathname) ?? routing.defaultLocale;
	const chromeMessages = CHROME_MESSAGES[locale];

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
				<NextIntlClientProvider locale={locale} messages={chromeMessages}>
					<Header />
					<TrialBannerWrapper />
				</NextIntlClientProvider>
				{children}
				{!isDashboard && (
					<NextIntlClientProvider locale={locale} messages={chromeMessages}>
						<Footer />
					</NextIntlClientProvider>
				)}
			</div>
		</>
	);
}
