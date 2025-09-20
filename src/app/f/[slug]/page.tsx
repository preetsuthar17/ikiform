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
    const title = getPublicFormTitle(form.schema);
    const description =
      form.schema?.settings?.description ||
      form.description ||
      "Fill out this form.";
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://www.ikiform.com/f/${slug}`,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
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
