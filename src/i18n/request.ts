import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export type MessageNamespace =
	| "auth"
	| "dashboard"
	| "footer"
	| "home"
	| "legal"
	| "nav"
	| "product"
	| "seo";

type LocaleLoaders = Record<
	MessageNamespace,
	() => Promise<{ default: Record<string, unknown> }>
>;

const messageLoaders: Record<string, LocaleLoaders> = {
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
	fr: {
		auth: () => import("../../messages/fr/auth.json"),
		dashboard: () => import("../../messages/fr/dashboard.json"),
		footer: () => import("../../messages/fr/footer.json"),
		home: () => import("../../messages/fr/home.json"),
		legal: () => import("../../messages/fr/legal.json"),
		nav: () => import("../../messages/fr/nav.json"),
		product: () => import("../../messages/fr/product.json"),
		seo: () => import("../../messages/fr/seo.json"),
	},
	de: {
		auth: () => import("../../messages/de/auth.json"),
		dashboard: () => import("../../messages/de/dashboard.json"),
		footer: () => import("../../messages/de/footer.json"),
		home: () => import("../../messages/de/home.json"),
		legal: () => import("../../messages/de/legal.json"),
		nav: () => import("../../messages/de/nav.json"),
		product: () => import("../../messages/de/product.json"),
		seo: () => import("../../messages/de/seo.json"),
	},
	pt: {
		auth: () => import("../../messages/pt/auth.json"),
		dashboard: () => import("../../messages/pt/dashboard.json"),
		footer: () => import("../../messages/pt/footer.json"),
		home: () => import("../../messages/pt/home.json"),
		legal: () => import("../../messages/pt/legal.json"),
		nav: () => import("../../messages/pt/nav.json"),
		product: () => import("../../messages/pt/product.json"),
		seo: () => import("../../messages/pt/seo.json"),
	},
	hi: {
		auth: () => import("../../messages/hi/auth.json"),
		dashboard: () => import("../../messages/hi/dashboard.json"),
		footer: () => import("../../messages/hi/footer.json"),
		home: () => import("../../messages/hi/home.json"),
		legal: () => import("../../messages/hi/legal.json"),
		nav: () => import("../../messages/hi/nav.json"),
		product: () => import("../../messages/hi/product.json"),
		seo: () => import("../../messages/hi/seo.json"),
	},
	ja: {
		auth: () => import("../../messages/ja/auth.json"),
		dashboard: () => import("../../messages/ja/dashboard.json"),
		footer: () => import("../../messages/ja/footer.json"),
		home: () => import("../../messages/ja/home.json"),
		legal: () => import("../../messages/ja/legal.json"),
		nav: () => import("../../messages/ja/nav.json"),
		product: () => import("../../messages/ja/product.json"),
		seo: () => import("../../messages/ja/seo.json"),
	},
	zh: {
		auth: () => import("../../messages/zh/auth.json"),
		dashboard: () => import("../../messages/zh/dashboard.json"),
		footer: () => import("../../messages/zh/footer.json"),
		home: () => import("../../messages/zh/home.json"),
		legal: () => import("../../messages/zh/legal.json"),
		nav: () => import("../../messages/zh/nav.json"),
		product: () => import("../../messages/zh/product.json"),
		seo: () => import("../../messages/zh/seo.json"),
	},
	it: {
		auth: () => import("../../messages/it/auth.json"),
		dashboard: () => import("../../messages/it/dashboard.json"),
		footer: () => import("../../messages/it/footer.json"),
		home: () => import("../../messages/it/home.json"),
		legal: () => import("../../messages/it/legal.json"),
		nav: () => import("../../messages/it/nav.json"),
		product: () => import("../../messages/it/product.json"),
		seo: () => import("../../messages/it/seo.json"),
	},
	ar: {
		auth: () => import("../../messages/ar/auth.json"),
		dashboard: () => import("../../messages/ar/dashboard.json"),
		footer: () => import("../../messages/ar/footer.json"),
		home: () => import("../../messages/ar/home.json"),
		legal: () => import("../../messages/ar/legal.json"),
		nav: () => import("../../messages/ar/nav.json"),
		product: () => import("../../messages/ar/product.json"),
		seo: () => import("../../messages/ar/seo.json"),
	},
	ko: {
		auth: () => import("../../messages/ko/auth.json"),
		dashboard: () => import("../../messages/ko/dashboard.json"),
		footer: () => import("../../messages/ko/footer.json"),
		home: () => import("../../messages/ko/home.json"),
		legal: () => import("../../messages/ko/legal.json"),
		nav: () => import("../../messages/ko/nav.json"),
		product: () => import("../../messages/ko/product.json"),
		seo: () => import("../../messages/ko/seo.json"),
	},
	ru: {
		auth: () => import("../../messages/ru/auth.json"),
		dashboard: () => import("../../messages/ru/dashboard.json"),
		footer: () => import("../../messages/ru/footer.json"),
		home: () => import("../../messages/ru/home.json"),
		legal: () => import("../../messages/ru/legal.json"),
		nav: () => import("../../messages/ru/nav.json"),
		product: () => import("../../messages/ru/product.json"),
		seo: () => import("../../messages/ru/seo.json"),
	},
	tr: {
		auth: () => import("../../messages/tr/auth.json"),
		dashboard: () => import("../../messages/tr/dashboard.json"),
		footer: () => import("../../messages/tr/footer.json"),
		home: () => import("../../messages/tr/home.json"),
		legal: () => import("../../messages/tr/legal.json"),
		nav: () => import("../../messages/tr/nav.json"),
		product: () => import("../../messages/tr/product.json"),
		seo: () => import("../../messages/tr/seo.json"),
	},
	nl: {
		auth: () => import("../../messages/nl/auth.json"),
		dashboard: () => import("../../messages/nl/dashboard.json"),
		footer: () => import("../../messages/nl/footer.json"),
		home: () => import("../../messages/nl/home.json"),
		legal: () => import("../../messages/nl/legal.json"),
		nav: () => import("../../messages/nl/nav.json"),
		product: () => import("../../messages/nl/product.json"),
		seo: () => import("../../messages/nl/seo.json"),
	},
};

export async function loadMessagesForLocale(locale: string) {
	const localeLoaders = messageLoaders[locale] ?? messageLoaders.en;
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

export async function loadMessagesForNamespaces(
	locale: string,
	namespaces: MessageNamespace[]
) {
	const localeLoaders = messageLoaders[locale] ?? messageLoaders.en;
	const results = await Promise.all(
		namespaces.map((ns) => localeLoaders[ns]())
	);

	const messages: Record<string, Record<string, unknown>> = {};
	for (const [i, ns] of namespaces.entries()) {
		messages[ns] = results[i].default;
	}
	return messages;
}

const ROUTE_NAMESPACE_MAP: [RegExp, MessageNamespace[]][] = [
	[/^\/legal(\/|$)/, ["legal"]],
	[/^\/login(\/|$)/, ["auth"]],
	[/^\/reset-password(\/|$)/, ["auth"]],
	[/^\/success(\/|$)/, ["auth"]],
	[/^\/dashboard(\/|$)/, ["dashboard"]],
	[/^\/admin(\/|$)/, ["dashboard"]],
	[/^\/form-builder(\/|$)/, ["product"]],
	[/^\/embed(\/|$)/, ["product"]],
	[/^\/checkout(\/|$)/, ["product"]],
	[/^\/ai-builder(\/|$)/, ["product"]],
	[/^\/changelog(\/|$)/, ["home"]],
	[/^\/$/, ["home"]],
];

export function getNamespacesForRoute(
	pathname: string
): MessageNamespace[] {
	for (const [pattern, namespaces] of ROUTE_NAMESPACE_MAP) {
		if (pattern.test(pathname)) {
			return namespaces;
		}
	}
	return ["home"];
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
