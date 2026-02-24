import { ChangelogPage } from "@/components/changelog/changelog-page";
import { JsonLd } from "@/components/seo/json-ld";
import { requireLocale } from "@/lib/i18n/locale";
import { buildMetadata } from "@/lib/seo/build-metadata";
import { getBreadcrumbJsonLd } from "@/lib/seo/structured-data";
import type { Metadata } from "next";

const BREADCRUMB_LABEL = {
	en: "Changelog",
	es: "Novedades",
} as const;

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	return buildMetadata({
		locale: requireLocale(locale),
		routeKey: "changelog",
	});
}

export default async function LocalizedChangelog({
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
					{
						name:
							BREADCRUMB_LABEL[currentLocale as keyof typeof BREADCRUMB_LABEL] ??
							"Changelog",
						path: "/changelog",
					},
				])}
			/>
			<ChangelogPage locale={currentLocale} />
		</>
	);
}
