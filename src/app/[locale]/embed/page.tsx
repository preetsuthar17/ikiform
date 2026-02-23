import type { Metadata } from "next";
import EmbedPage from "@/app/embed/page";
import { requireLocale } from "@/lib/i18n/locale";
import { buildMetadata } from "@/lib/seo/build-metadata";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	return buildMetadata({ locale: requireLocale(locale), routeKey: "embed" });
}

export default function LocalizedEmbed({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	return <EmbedPage searchParams={searchParams} />;
}
