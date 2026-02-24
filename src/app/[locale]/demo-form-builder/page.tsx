import DemoFormBuilderPage from "@/app/demo-form-builder/page";
import { JsonLd } from "@/components/seo/json-ld";
import { requireLocale } from "@/lib/i18n/locale";
import { buildMetadata } from "@/lib/seo/build-metadata";
import {
	getBreadcrumbJsonLd,
	getSoftwareApplicationJsonLd,
} from "@/lib/seo/structured-data";
import type { Metadata } from "next";

const LABELS = {
	en: "Demo Form Builder",
	es: "Demo del creador de formularios",
} as const;

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	return buildMetadata({
		locale: requireLocale(locale),
		routeKey: "demoFormBuilder",
	});
}

export default async function LocalizedDemoFormBuilder({
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
						name: LABELS[currentLocale as keyof typeof LABELS] ?? "Demo Form Builder",
						path: "/demo-form-builder",
					},
				])}
			/>
			<DemoFormBuilderPage />
		</>
	);
}
