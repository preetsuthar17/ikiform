import ResetPasswordPage from "@/app/reset-password/page";
import { requireLocale } from "@/lib/i18n/locale";
import { buildMetadata } from "@/lib/seo/build-metadata";
import type { Metadata } from "next";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	return buildMetadata({
		locale: requireLocale(locale),
		routeKey: "resetPassword",
	});
}

export default function LocalizedResetPassword() {
	return <ResetPasswordPage />;
}
