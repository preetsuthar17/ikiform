import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formsDbServer } from "@/lib/database";
import { ensureDefaultRateLimitSettings } from "@/lib/forms/form-defaults";
import { getPublicFormTitle } from "@/lib/utils/form-utils";
import PublicFormServerWrapper from "../../forms/[id]/components/PublicFormServerWrapper";

interface PublicFormPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const form = await formsDbServer.getPublicForm(slug);
    if (!form) return {};

    const metadata = form.schema?.settings?.metadata || {};
    const baseUrl = "https://www.ikiform.com";
    const formUrl = `${baseUrl}/f/${slug}`;

    // Use custom metadata or fallback to defaults
    const title = metadata.title || getPublicFormTitle(form.schema);
    const description =
      metadata.description ||
      form.schema?.settings?.description ||
      form.description ||
      "Fill out this form.";
    const author = metadata.author;
    const keywords = metadata.keywords;
    const canonicalUrl = metadata.canonicalUrl || formUrl;

    // Build robots directive
    const robots = metadata.robots || "noindex";
    const robotsConfig = {
      index: !metadata.noIndex,
      follow: !metadata.noFollow,
      archive: !metadata.noArchive,
      snippet: !metadata.noSnippet,
      imageindex: !metadata.noImageIndex,
      translate: !metadata.noTranslate,
    };

    // Open Graph settings
    const ogTitle = metadata.ogTitle || title;
    const ogDescription = metadata.ogDescription || description;
    const ogImage = metadata.ogImage;
    const ogType = metadata.ogType || "website";

    // Twitter Card settings
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
  const { slug } = await params;

  try {
    const form = await formsDbServer.getPublicForm(slug);

    if (!form) {
      notFound();
    }

    return (
      <PublicFormServerWrapper
        formId={form.id}
        schema={ensureDefaultRateLimitSettings(form.schema)}
      />
    );
  } catch (error) {
    console.error("Error fetching form:", error);
    notFound();
  }
}
