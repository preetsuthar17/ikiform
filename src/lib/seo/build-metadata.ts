import type { AppLocale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { withLocalePath } from "@/lib/i18n/pathname";
import type { Metadata } from "next";
import arSeoMessages from "../../../messages/ar/seo.json";
import deSeoMessages from "../../../messages/de/seo.json";
import enSeoMessages from "../../../messages/en/seo.json";
import esSeoMessages from "../../../messages/es/seo.json";
import frSeoMessages from "../../../messages/fr/seo.json";
import hiSeoMessages from "../../../messages/hi/seo.json";
import itSeoMessages from "../../../messages/it/seo.json";
import jaSeoMessages from "../../../messages/ja/seo.json";
import koSeoMessages from "../../../messages/ko/seo.json";
import nlSeoMessages from "../../../messages/nl/seo.json";
import ptSeoMessages from "../../../messages/pt/seo.json";
import ruSeoMessages from "../../../messages/ru/seo.json";
import trSeoMessages from "../../../messages/tr/seo.json";
import zhSeoMessages from "../../../messages/zh/seo.json";
import {
	DEFAULT_OG_IMAGE,
	OPEN_GRAPH_ALTERNATE_LOCALES,
	OPEN_GRAPH_LOCALE,
	SITE_NAME,
	SITE_URL,
} from "./constants";
import { getRouteRobots } from "./robots-policy";
import { SEO_ROUTE_PATHS, type SeoRouteKey } from "./routes";

type SeoMessages = typeof enSeoMessages;

const SEO_MESSAGES: Record<AppLocale, SeoMessages> = {
	en: enSeoMessages,
	es: esSeoMessages,
	fr: frSeoMessages,
	de: deSeoMessages,
	pt: ptSeoMessages,
	hi: hiSeoMessages,
	ja: jaSeoMessages,
	zh: zhSeoMessages,
	it: itSeoMessages,
	ar: arSeoMessages,
	ko: koSeoMessages,
	ru: ruSeoMessages,
	tr: trSeoMessages,
	nl: nlSeoMessages,
};

export function buildMetadata({
	locale,
	routeKey,
	imageUrl = DEFAULT_OG_IMAGE,
}: {
	locale: AppLocale;
	routeKey: SeoRouteKey;
	imageUrl?: string;
}): Metadata {
	const seo = SEO_MESSAGES[locale].routes[routeKey];
	const routePath = SEO_ROUTE_PATHS[routeKey];

	const localizedPath = withLocalePath(routePath, locale);
	const canonicalUrl = `${SITE_URL}${localizedPath}`;
	const xDefaultUrl = `${SITE_URL}${withLocalePath(routePath, routing.defaultLocale)}`;

	const languages: Record<string, string> = { "x-default": xDefaultUrl };
	for (const l of routing.locales) {
		languages[l] = `${SITE_URL}${withLocalePath(routePath, l)}`;
	}

	return {
		title: seo.title,
		description: seo.description,
		keywords: seo.keywords,
		applicationName: SITE_NAME,
		metadataBase: new URL(SITE_URL),
		alternates: {
			canonical: canonicalUrl,
			languages,
		},
		openGraph: {
			type: "website",
			url: canonicalUrl,
			siteName: SITE_NAME,
			locale: OPEN_GRAPH_LOCALE[locale],
			alternateLocale: OPEN_GRAPH_ALTERNATE_LOCALES[locale],
			title: seo.title,
			description: seo.description,
			images: [
				{
					url: imageUrl,
					width: 1200,
					height: 630,
					alt: seo.title,
					type: "image/png",
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			site: "@Ikiform",
			creator: "@Ikiform",
			title: seo.title,
			description: seo.description,
			images: [imageUrl],
		},
		robots: getRouteRobots(routeKey, locale),
		icons: {
			icon: [{ url: "/favicon.ico" }],
		},
	};
}
