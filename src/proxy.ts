import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import {
	getLocaleFromPathname,
	getPreferredLocaleFromCookie,
	stripLocalePrefix,
	withLocalePath,
} from "@/lib/i18n/pathname";
import { updateSession } from "@/utils/supabase/middleware";

const handleI18nRouting = createMiddleware(routing);

const LOCALIZED_PUBLIC_PATHS = new Set([
	"/",
	"/ai-builder",
	"/changelog",
	"/demo-form-builder",
	"/embed",
	"/embed/test",
	"/legal/privacy",
	"/legal/terms",
	"/legal/gdpr",
	"/legal/dpa",
	"/login",
	"/reset-password",
	"/success",
]);

const LOCALIZED_APP_PATH_PREFIXES = ["/dashboard", "/form-builder"] as const;

function isLocalizedPublicPath(pathname: string) {
	return LOCALIZED_PUBLIC_PATHS.has(pathname);
}

function isLocalizedAppPath(pathname: string) {
	return LOCALIZED_APP_PATH_PREFIXES.some(
		(prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
	);
}

function isNoindexPath(pathname: string) {
	if (
		pathname.startsWith("/dashboard") ||
		pathname.startsWith("/form-builder") ||
		pathname.startsWith("/admin") ||
		pathname.startsWith("/auth")
	) {
		return true;
	}

	return (
		pathname === "/login" ||
		pathname === "/reset-password" ||
		pathname === "/success" ||
		pathname === "/embed" ||
		pathname === "/embed/test" ||
		pathname === "/e2e-ui"
	);
}

function shouldRefreshAuthSession(pathname: string) {
	return (
		pathname === "/login" ||
		pathname.startsWith("/dashboard") ||
		pathname.startsWith("/form-builder") ||
		pathname.startsWith("/admin") ||
		pathname.startsWith("/checkout") ||
		pathname.startsWith("/portal")
	);
}

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const normalizedPathname = stripLocalePrefix(pathname);
	const localeFromPath = getLocaleFromPathname(pathname);

	if (normalizedPathname.startsWith("/forms/")) {
		const id = normalizedPathname.split("/")[2];

		if (id && id.length > 20) {
			return NextResponse.redirect(new URL(`/f/${id}`, request.url));
		}
	}

	if (isLocalizedPublicPath(normalizedPathname) && !localeFromPath) {
		const preferredLocale = getPreferredLocaleFromCookie(
			request.cookies.get("NEXT_LOCALE")?.value
		);
		const destinationPath =
			normalizedPathname === "/"
				? `/${preferredLocale}`
				: withLocalePath(normalizedPathname, preferredLocale);

		const url = request.nextUrl.clone();
		url.pathname = destinationPath;
		return NextResponse.redirect(url);
	}

	if (isLocalizedAppPath(normalizedPathname) && !localeFromPath) {
		const preferredLocale = getPreferredLocaleFromCookie(
			request.cookies.get("NEXT_LOCALE")?.value
		);
		const url = request.nextUrl.clone();
		url.pathname = withLocalePath(normalizedPathname, preferredLocale);
		return NextResponse.redirect(url);
	}

	if (localeFromPath) {
		const localeResponse = handleI18nRouting(request);
		if (localeResponse.headers.has("location")) {
			return localeResponse;
		}
	}

	const response = shouldRefreshAuthSession(normalizedPathname)
		? await updateSession(request)
		: NextResponse.next();
	if (localeFromPath) {
		response.cookies.set("NEXT_LOCALE", localeFromPath, {
			path: "/",
			sameSite: "lax",
		});
	}

	const isFormPage =
		normalizedPathname.startsWith("/f/") ||
		(normalizedPathname.startsWith("/forms/") &&
			normalizedPathname.split("/")[2]);

	if (isFormPage) {
		response.headers.set("X-Frame-Options", "SAMEORIGIN");
		response.headers.set("Content-Security-Policy", "frame-ancestors *;");
	} else {
		response.headers.set("X-Frame-Options", "DENY");
		response.headers.set("Content-Security-Policy", "frame-ancestors 'none';");
	}

	response.headers.set("X-Content-Type-Options", "nosniff");
	response.headers.set("X-XSS-Protection", "1; mode=block");
	response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
	if (isNoindexPath(normalizedPathname)) {
		response.headers.set("X-Robots-Tag", "noindex, follow");
	}

	return response;
}

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|webmanifest)$).*)",
	],
};
