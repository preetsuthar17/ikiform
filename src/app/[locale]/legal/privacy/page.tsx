import { LegalMarkdownPage } from "@/components/legal/legal-markdown-page";
import { JsonLd } from "@/components/seo/json-ld";
import { requireLocale } from "@/lib/i18n/locale";
import { buildMetadata } from "@/lib/seo/build-metadata";
import { getLegalLabel } from "@/lib/seo/legal-labels";
import { getBreadcrumbJsonLd } from "@/lib/seo/structured-data";
import type { Metadata } from "next";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	return buildMetadata({
		locale: requireLocale(locale),
		routeKey: "legalPrivacy",
	});
}

export default async function LocalizedPrivacy({
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
					{ name: getLegalLabel("privacy", currentLocale), path: "/legal/privacy" },
				])}
			/>
			<LegalMarkdownPage document="privacy" locale={currentLocale} />
		</>
	);
}
