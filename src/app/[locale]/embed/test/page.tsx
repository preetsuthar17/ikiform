import type { Metadata } from "next";
import EmbedTestPage from "@/app/embed/test/page";
import { requireLocale } from "@/lib/i18n/locale";
import { buildMetadata } from "@/lib/seo/build-metadata";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	return buildMetadata({ locale: requireLocale(locale), routeKey: "embedTest" });
}

export default function LocalizedEmbedTest() {
	return <EmbedTestPage />;
}
