import type { AppLocale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { withLocalePath } from "@/lib/i18n/pathname";
import type { Metadata } from "next";
import enSeoMessages from "../../../messages/en/seo.json";
import esSeoMessages from "../../../messages/es/seo.json";
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
	const enUrl = `${SITE_URL}${withLocalePath(routePath, "en")}`;
	const esUrl = `${SITE_URL}${withLocalePath(routePath, "es")}`;
	const xDefaultUrl = `${SITE_URL}${withLocalePath(routePath, routing.defaultLocale)}`;

	return {
		title: seo.title,
		description: seo.description,
		keywords: seo.keywords,
		applicationName: SITE_NAME,
		metadataBase: new URL(SITE_URL),
		alternates: {
			canonical: canonicalUrl,
			languages: {
				en: enUrl,
				es: esUrl,
				"x-default": xDefaultUrl,
			},
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
