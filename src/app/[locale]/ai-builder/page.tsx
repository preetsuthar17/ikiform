import AiBuilderPage from "@/app/ai-builder/page";
import { JsonLd } from "@/components/seo/json-ld";
import { requireLocale } from "@/lib/i18n/locale";
import { buildMetadata } from "@/lib/seo/build-metadata";
import {
	getBreadcrumbJsonLd,
	getSoftwareApplicationJsonLd,
} from "@/lib/seo/structured-data";
import type { Metadata } from "next";

const LABELS = {
	en: "AI Form Builder",
	es: "Creador de formularios con IA",
} as const;

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	return buildMetadata({
		locale: requireLocale(locale),
		routeKey: "aiBuilder",
	});
}

export default async function LocalizedAiBuilder({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const currentLocale = requireLocale(locale);

	return (
		<>
			<JsonLd data={getSoftwareApplicationJsonLd(currentLocale)} />
			<JsonLd
				data={getBreadcrumbJsonLd(currentLocale, [
					{ name: "Ikiform", path: "/" },
					{
						name:
							LABELS[currentLocale as keyof typeof LABELS] ??
							"AI Form Builder",
						path: "/ai-builder",
					},
				])}
			/>
			<AiBuilderPage />
		</>
	);
}
