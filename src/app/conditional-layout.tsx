"use client";

import { usePathname } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import Footer from "@/components/home/footer";
import Header from "@/components/home/header/header";
import { TrialBannerWrapper } from "@/components/trial-banner-wrapper";
import { type AppLocale, routing } from "@/i18n/routing";
import { getLocaleFromPathname, stripLocalePrefix } from "@/lib/i18n/pathname";
import arFooter from "../../messages/ar/footer.json";
import arNav from "../../messages/ar/nav.json";
import arTrialBanner from "../../messages/ar/trial-banner.json";
import deFooter from "../../messages/de/footer.json";
import deNav from "../../messages/de/nav.json";
import deTrialBanner from "../../messages/de/trial-banner.json";
import enFooter from "../../messages/en/footer.json";
import enNav from "../../messages/en/nav.json";
import enTrialBanner from "../../messages/en/trial-banner.json";
import esFooter from "../../messages/es/footer.json";
import esNav from "../../messages/es/nav.json";
import esTrialBanner from "../../messages/es/trial-banner.json";
import frFooter from "../../messages/fr/footer.json";
import frNav from "../../messages/fr/nav.json";
import frTrialBanner from "../../messages/fr/trial-banner.json";
import hiFooter from "../../messages/hi/footer.json";
import hiNav from "../../messages/hi/nav.json";
import hiTrialBanner from "../../messages/hi/trial-banner.json";
import itFooter from "../../messages/it/footer.json";
import itNav from "../../messages/it/nav.json";
import itTrialBanner from "../../messages/it/trial-banner.json";
import jaFooter from "../../messages/ja/footer.json";
import jaNav from "../../messages/ja/nav.json";
import jaTrialBanner from "../../messages/ja/trial-banner.json";
import koFooter from "../../messages/ko/footer.json";
import koNav from "../../messages/ko/nav.json";
import koTrialBanner from "../../messages/ko/trial-banner.json";
import nlFooter from "../../messages/nl/footer.json";
import nlNav from "../../messages/nl/nav.json";
import nlTrialBanner from "../../messages/nl/trial-banner.json";
import ptFooter from "../../messages/pt/footer.json";
import ptNav from "../../messages/pt/nav.json";
import ptTrialBanner from "../../messages/pt/trial-banner.json";
import ruFooter from "../../messages/ru/footer.json";
import ruNav from "../../messages/ru/nav.json";
import ruTrialBanner from "../../messages/ru/trial-banner.json";
import trFooter from "../../messages/tr/footer.json";
import trNav from "../../messages/tr/nav.json";
import trTrialBanner from "../../messages/tr/trial-banner.json";
import zhFooter from "../../messages/zh/footer.json";
import zhNav from "../../messages/zh/nav.json";
import zhTrialBanner from "../../messages/zh/trial-banner.json";

interface ConditionalLayoutProps {
	children: React.ReactNode;
}

function chromeEntry(
	nav: typeof enNav,
	footer: typeof enFooter,
	trialBanner: typeof enTrialBanner
) {
	return { nav, footer, product: { trialBanner: trialBanner.trialBanner } };
}

const CHROME_MESSAGES: Record<
	AppLocale,
	ReturnType<typeof chromeEntry>
> = {
	en: chromeEntry(enNav, enFooter, enTrialBanner),
	es: chromeEntry(esNav, esFooter, esTrialBanner),
	fr: chromeEntry(frNav, frFooter, frTrialBanner),
	de: chromeEntry(deNav, deFooter, deTrialBanner),
	pt: chromeEntry(ptNav, ptFooter, ptTrialBanner),
	hi: chromeEntry(hiNav, hiFooter, hiTrialBanner),
	ja: chromeEntry(jaNav, jaFooter, jaTrialBanner),
	zh: chromeEntry(zhNav, zhFooter, zhTrialBanner),
	it: chromeEntry(itNav, itFooter, itTrialBanner),
	ar: chromeEntry(arNav, arFooter, arTrialBanner),
	ko: chromeEntry(koNav, koFooter, koTrialBanner),
	ru: chromeEntry(ruNav, ruFooter, ruTrialBanner),
	tr: chromeEntry(trNav, trFooter, trTrialBanner),
	nl: chromeEntry(nlNav, nlFooter, nlTrialBanner),
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

	if (hideHeaderFooter) {
		return <>{children}</>;
	}

	return (
		<NextIntlClientProvider locale={locale} messages={chromeMessages}>
			<div
				className={`z-10 flex min-h-screen flex-col gap-12 px-4 md:px-8 ${isDashboard ? "justify-start" : "justify-between"} ${isDashboard ? "pb-12" : ""}`}
			>
				<Header />
				<TrialBannerWrapper />
				{children}
				{!isDashboard && <Footer />}
			</div>
		</NextIntlClientProvider>
	);
}
