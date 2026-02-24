import SuccessPage from "@/app/success/page";
import { requireLocale } from "@/lib/i18n/locale";
import { buildMetadata } from "@/lib/seo/build-metadata";
import type { Metadata } from "next";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	return buildMetadata({ locale: requireLocale(locale), routeKey: "success" });
}

export default function LocalizedSuccess({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	return <SuccessPage searchParams={searchParams} />;
}
