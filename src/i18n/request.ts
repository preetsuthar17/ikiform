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

const messageLoaders: Record<
	string,
	Record<MessageNamespace, () => Promise<{ default: Record<string, unknown> }>>
> = {
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
