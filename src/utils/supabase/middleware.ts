import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const LOCALE_PREFIX_REGEX = /^\/(en|es|fr|de|pt|hi|ja|zh|it|ar|ko|ru|tr|nl)(?=\/|$)/;
const STRIP_LOCALE_PREFIX_REGEX = /^\/(?:en|es|fr|de|pt|hi|ja|zh|it|ar|ko|ru|tr|nl)(?=\/|$)/;

export async function updateSession(
	request: NextRequest
): Promise<NextResponse> {
	const supabaseResponse = NextResponse.next({ request });

	const authHeader = request.headers.get("authorization");
	const accessToken = authHeader?.startsWith("Bearer ")
		? authHeader.replace("Bearer ", "")
		: null;

	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
	if (!(supabaseUrl && supabaseAnonKey)) {
		return supabaseResponse;
	}

	try {
		const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
			cookies: {
				getAll: () => request.cookies.getAll(),
				setAll: (cookiesToSet) => {
					for (const { name, value, options } of cookiesToSet) {
						request.cookies.set(name, value);
						supabaseResponse.cookies.set(name, value, options);
					}
				},
			},
			...(accessToken && {
				global: { headers: { Authorization: `Bearer ${accessToken}` } },
			}),
		});

		const {
			data: { user },
		} = await supabase.auth.getUser();

		const pathname = request.nextUrl.pathname;
		const localeMatch = pathname.match(LOCALE_PREFIX_REGEX);
		const localePrefix = localeMatch ? `/${localeMatch[1]}` : "";
		const normalizedPathname =
			pathname.replace(STRIP_LOCALE_PREFIX_REGEX, "") || "/";
		const isProtectedPath =
			normalizedPathname.startsWith("/dashboard") ||
			normalizedPathname.startsWith("/form-builder") ||
			normalizedPathname.startsWith("/admin") ||
			normalizedPathname.startsWith("/checkout") ||
			normalizedPathname.startsWith("/portal");

		if (!user && isProtectedPath) {
			if (normalizedPathname.startsWith("/dashboard")) {
				return supabaseResponse;
			}
			const url = request.nextUrl.clone();
			url.pathname = localePrefix ? `${localePrefix}/login` : "/login";
			url.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
			return NextResponse.redirect(url);
		}

		// Avoid redirect loops when server-rendered protected pages and middleware
		// temporarily disagree about session validity.
	} catch (error) {
		// Don't take down page/API requests when an auth cookie is malformed.
		console.error("[updateSession] Failed to refresh auth session:", error);
	}

	return supabaseResponse;
}
