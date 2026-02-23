import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

const messageLoaders = {
	en: {
		auth: () => import("../../messages/en/auth.json"),
		dashboard: () => import("../../messages/en/dashboard.json"),
		footer: () => import("../../messages/en/footer.json"),
		home: () => import("../../messages/en/home.json"),
		legal: () => import("../../messages/en/legal.json"),
		nav: () => import("../../messages/en/nav.json"),
		product: () => import("../../messages/en/product.json"),
		seo: () => import("../../messages/en/seo.json"),
	},
	es: {
		auth: () => import("../../messages/es/auth.json"),
		dashboard: () => import("../../messages/es/dashboard.json"),
		footer: () => import("../../messages/es/footer.json"),
		home: () => import("../../messages/es/home.json"),
		legal: () => import("../../messages/es/legal.json"),
		nav: () => import("../../messages/es/nav.json"),
		product: () => import("../../messages/es/product.json"),
		seo: () => import("../../messages/es/seo.json"),
	},
} as const;

export async function loadMessagesForLocale(
	locale: keyof typeof messageLoaders
) {
	const localeLoaders = messageLoaders[locale];
	const [auth, dashboard, footer, home, legal, nav, product, seo] =
		await Promise.all([
			localeLoaders.auth(),
			localeLoaders.dashboard(),
			localeLoaders.footer(),
			localeLoaders.home(),
			localeLoaders.legal(),
			localeLoaders.nav(),
			localeLoaders.product(),
			localeLoaders.seo(),
		]);

	return {
		auth: auth.default,
		dashboard: dashboard.default,
		footer: footer.default,
		home: home.default,
		legal: legal.default,
		nav: nav.default,
		product: product.default,
		seo: seo.default,
	};
}

export default getRequestConfig(async ({ requestLocale }) => {
	const requestedLocale = await requestLocale;
	const locale =
		requestedLocale && hasLocale(routing.locales, requestedLocale)
			? requestedLocale
			: routing.defaultLocale;

	return {
		locale,
		messages: await loadMessagesForLocale(locale),
	};
});
