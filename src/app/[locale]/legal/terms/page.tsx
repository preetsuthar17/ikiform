import { LegalMarkdownPage } from "@/components/legal/legal-markdown-page";
import { JsonLd } from "@/components/seo/json-ld";
import { requireLocale } from "@/lib/i18n/locale";
import { buildMetadata } from "@/lib/seo/build-metadata";
import { getBreadcrumbJsonLd } from "@/lib/seo/structured-data";
import type { Metadata } from "next";

const LABELS = {
	en: "Terms of Service",
	es: "Términos del servicio",
};

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	return buildMetadata({
		locale: requireLocale(locale),
		routeKey: "legalTerms",
	});
}

export default async function LocalizedTerms({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const currentLocale = requireLocale(locale);

	return (
		<>
			<JsonLd
				data={getBreadcrumbJsonLd(currentLocale, [
					{ name: "Ikiform", path: "/" },
					{ name: LABELS[currentLocale], path: "/legal/terms" },
				])}
			/>
			<LegalMarkdownPage document="terms" locale={currentLocale} />
		</>
	);
}
