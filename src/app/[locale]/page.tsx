import HomePage from "@/app/(home)/page";
import { JsonLd } from "@/components/seo/json-ld";
import { requireLocale } from "@/lib/i18n/locale";
import { buildMetadata } from "@/lib/seo/build-metadata";
import {
	getFaqJsonLd,
	getOrganizationJsonLd,
	getWebsiteJsonLd,
} from "@/lib/seo/structured-data";
import type { Metadata } from "next";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	return buildMetadata({ locale: requireLocale(locale), routeKey: "home" });
}

export default async function LocalizedHome({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const currentLocale = requireLocale(locale);

	return (
		<>
			<JsonLd data={getOrganizationJsonLd(currentLocale)} />
			<JsonLd data={getWebsiteJsonLd(currentLocale)} />
			<JsonLd data={getFaqJsonLd(currentLocale)} />
			<HomePage />
		</>
	);
}
