"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Loader } from "@/components/ui";
import { getLocaleFromPathname, withLocaleHref } from "@/lib/i18n/pathname";
import { createClient } from "@/utils/supabase/client";

export default function DashboardAuthRecovery() {
	const pathname = usePathname();
	const locale = getLocaleFromPathname(pathname);

	useEffect(() => {
		let ignore = false;

		const recoverSession = async () => {
			const supabase = createClient();
			const {
				data: { session },
			} = await supabase.auth.getSession();

			if (session?.access_token && session.refresh_token) {
				const syncResponse = await fetch("/api/auth/sync-session", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						accessToken: session.access_token,
						refreshToken: session.refresh_token,
					}),
				});

				if (!ignore && syncResponse.ok) {
					window.location.replace(pathname);
					return;
				}
			}

			if (!ignore) {
				const loginPath = locale ? withLocaleHref("/login", locale) : "/login";
				window.location.replace(
					`${loginPath}?next=${encodeURIComponent(pathname)}`
				);
			}
		};

		recoverSession();
		return () => {
			ignore = true;
		};
	}, [locale, pathname]);

	return (
		<div className="flex min-h-[40vh] items-center justify-center">
			<Loader />
		</div>
	);
}
