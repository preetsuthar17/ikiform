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
}) {
  const { id } = await params;
  try {
    const form = await formsDbServer.getPublicForm(id);
    if (!form) return {};
    const title = getPublicFormTitle(form.schema);
    const description =
      form.schema?.settings?.description ||
      form.description ||
      "Fill out this form.";
    const identifier = form.slug || id;
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://www.ikiform.com/f/${identifier}`,
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
