import { routing, type AppLocale } from "@/i18n/routing";

const localeSet = new Set(routing.locales);

export function isSupportedLocale(value: string): value is AppLocale {
	return localeSet.has(value as AppLocale);
}

export function getLocaleFromPathname(pathname: string): AppLocale | null {
	const [, maybeLocale] = pathname.split("/");
	return maybeLocale && isSupportedLocale(maybeLocale) ? maybeLocale : null;
}

export function stripLocalePrefix(pathname: string): string {
	const locale = getLocaleFromPathname(pathname);
	if (!locale) return pathname;
	const stripped = pathname.slice(`/${locale}`.length);
	return stripped.length > 0 ? stripped : "/";
}

export function withLocalePath(pathname: string, locale: AppLocale): string {
	const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
	if (normalized === "/") return `/${locale}`;
	return `/${locale}${normalized}`;
}

export function withLocaleHref(href: string, locale: AppLocale): string {
	if (!href.startsWith("/") || href.startsWith("//")) {
		return href;
	}

	if (href.startsWith(`/${locale}`)) {
		return href;
	}

	const hashIndex = href.indexOf("#");
	const queryIndex = href.indexOf("?");
	const cutIndex =
		hashIndex === -1
			? queryIndex
			: queryIndex === -1
				? hashIndex
				: Math.min(hashIndex, queryIndex);

	if (cutIndex === -1) {
		return withLocalePath(href, locale);
	}

	const path = href.slice(0, cutIndex);
	const suffix = href.slice(cutIndex);
	return `${withLocalePath(path, locale)}${suffix}`;
}

export function getPreferredLocaleFromCookie(
	value: string | undefined
): AppLocale {
	return value && isSupportedLocale(value) ? value : routing.defaultLocale;
}
