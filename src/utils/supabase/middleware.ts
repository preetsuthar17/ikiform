import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(
	request: NextRequest,
	requestHeaders?: Headers
): Promise<NextResponse> {
	const supabaseResponse = requestHeaders
		? NextResponse.next({
				request: {
					headers: requestHeaders,
				},
			})
		: NextResponse.next({ request });

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
		const normalizedPathname =
			pathname.replace(/^\/(?:en|es)(?=\/|$)/, "") || "/";
		const isProtectedPath =
			normalizedPathname.startsWith("/dashboard") ||
			normalizedPathname.startsWith("/form-builder") ||
			normalizedPathname.startsWith("/admin") ||
			normalizedPathname.startsWith("/checkout") ||
			normalizedPathname.startsWith("/portal");

		if (!user && isProtectedPath) {
			const url = request.nextUrl.clone();
			url.pathname = "/login";
			return NextResponse.redirect(url);
		}
	} catch (error) {
		// Don't take down page/API requests when an auth cookie is malformed.
		console.error("[updateSession] Failed to refresh auth session:", error);
	}

	return supabaseResponse;
}
