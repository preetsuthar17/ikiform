import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formsDbServer } from "@/lib/database";
import { ensureDefaultRateLimitSettings } from "@/lib/forms/form-defaults";
import { getPublicFormTitle } from "@/lib/utils/form-utils";
import PublicFormServerWrapper from "./components/PublicFormServerWrapper";

interface PublicFormPageProps {
	params: Promise<{ id: string }>;
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	const { id } = await params;
	try {
		const form = await formsDbServer.getPublicForm(id);
		if (!form) return {};

		const metadata = form.schema?.settings?.metadata || {};
		const baseUrl = "https://www.ikiform.com";
		const identifier = form.slug || id;
		const formUrl = `${baseUrl}/f/${identifier}`;

		const title = metadata.title || getPublicFormTitle(form.schema);
		const description =
			metadata.description ||
			form.schema?.settings?.description ||
			form.description ||
			"Fill out this form.";
		const author = metadata.author;
		const keywords = metadata.keywords;
		const canonicalUrl = metadata.canonicalUrl || formUrl;

		const robots = metadata.robots || "noindex";
		const robotsConfig = {
			index: !metadata.noIndex,
			follow: !metadata.noFollow,
			archive: !metadata.noArchive,
			snippet: !metadata.noSnippet,
			imageindex: !metadata.noImageIndex,
			translate: !metadata.noTranslate,
		};

		const ogTitle = metadata.ogTitle || title;
		const ogDescription = metadata.ogDescription || description;
		const ogImage = metadata.ogImage;
		const ogType = metadata.ogType || "website";

		const twitterCard = metadata.twitterCard || "summary_large_image";
		const twitterTitle = metadata.twitterTitle || ogTitle;
		const twitterDescription = metadata.twitterDescription || ogDescription;
		const twitterImage = metadata.twitterImage || ogImage;
		const twitterSite = metadata.twitterSite;
		const twitterCreator = metadata.twitterCreator;

		const metadataResult: Metadata = {
			title,
			description,
			...(author && { authors: [{ name: author }] }),
			...(keywords && {
				keywords: keywords.split(",").map((k: string) => k.trim()),
			}),
			alternates: {
				canonical: canonicalUrl,
			},
			robots: robotsConfig,
			openGraph: {
				title: ogTitle,
				description: ogDescription,
				url: formUrl,
				type: ogType,
				...(ogImage && {
					images: [
						{
							url: ogImage,
							width: 1200,
							height: 630,
							alt: ogTitle,
						},
					],
				}),
			},
			twitter: {
				card: twitterCard,
				title: twitterTitle,
				description: twitterDescription,
				...(twitterImage && { images: [twitterImage] }),
				...(twitterSite && { site: twitterSite }),
				...(twitterCreator && { creator: twitterCreator }),
			},
		};

		return metadataResult;
	} catch {
		return {};
	}
}

export default async function PublicFormPage({ params }: PublicFormPageProps) {
	const { id } = await params;

	try {
		const form = await formsDbServer.getPublicForm(id);

		if (!form) {
			notFound();
		}

		return (
			<PublicFormServerWrapper
				formId={id}
				schema={ensureDefaultRateLimitSettings(form.schema)}
			/>
		);
	} catch (error) {
		console.error("Error loading form:", error);
		notFound();
	}
}
