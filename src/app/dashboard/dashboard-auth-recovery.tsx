"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Loader } from "@/components/ui";
import { getLocaleFromPathname, withLocaleHref } from "@/lib/i18n/pathname";
import { createClient } from "@/utils/supabase/client";

const RECOVERY_ATTEMPT_KEY = "dashboardAuthRecoveryAttempted";

export default function DashboardAuthRecovery() {
	const pathname = usePathname();
	const locale = getLocaleFromPathname(pathname);

	useEffect(() => {
		let ignore = false;

		const recoverSession = async () => {
			const loginPath = locale ? withLocaleHref("/login", locale) : "/login";
			const loginWithNext = `${loginPath}?next=${encodeURIComponent(pathname)}`;

			if (sessionStorage.getItem(RECOVERY_ATTEMPT_KEY) === "1") {
				sessionStorage.removeItem(RECOVERY_ATTEMPT_KEY);
				window.location.replace(loginWithNext);
				return;
			}

			const supabase = createClient();
			const {
				data: { session },
			} = await supabase.auth.getSession();

			if (!(session?.access_token && session.refresh_token)) {
				window.location.replace(loginWithNext);
				return;
			}

			sessionStorage.setItem(RECOVERY_ATTEMPT_KEY, "1");
			const syncResponse = await fetch("/api/auth/sync-session", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					accessToken: session.access_token,
					refreshToken: session.refresh_token,
				}),
			});

			const verifyResponse = await fetch("/api/user", {
				cache: "no-store",
				method: "GET",
			});

			if (!ignore && syncResponse.ok && verifyResponse.ok) {
				sessionStorage.removeItem(RECOVERY_ATTEMPT_KEY);
				window.location.replace(pathname);
				return;
			}

			if (!ignore) {
				sessionStorage.removeItem(RECOVERY_ATTEMPT_KEY);
				window.location.replace(loginWithNext);
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
