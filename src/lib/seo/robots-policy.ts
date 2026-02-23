import type { AppLocale } from "@/i18n/routing";
import type { Metadata } from "next";
import { INDEXABLE_SEO_ROUTES, type SeoRouteKey } from "./routes";

const INDEXABLE_ROUTE_SET = new Set<SeoRouteKey>(INDEXABLE_SEO_ROUTES);

function isSpanishNoindexRolloutEnabled() {
	return process.env.SEO_ES_NOINDEX === "1";
}

export function isRouteIndexable(routeKey: SeoRouteKey, locale: AppLocale) {
	if (!INDEXABLE_ROUTE_SET.has(routeKey)) {
		return false;
	}

	if (locale === "es" && isSpanishNoindexRolloutEnabled()) {
		return false;
	}

	return true;
}

export function getRouteRobots(
	routeKey: SeoRouteKey,
	locale: AppLocale
): Metadata["robots"] {
	const indexable = isRouteIndexable(routeKey, locale);

	return {
		index: indexable,
		follow: true,
		googleBot: {
			index: indexable,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": indexable ? "large" : "none",
			"max-snippet": -1,
		},
	};
}
