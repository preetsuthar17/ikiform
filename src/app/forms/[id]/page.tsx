import { notFound } from "next/navigation";
import PublicFormClient from "./PublicFormClient";
import { formsDbServer } from "@/lib/database";

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
    const title = form.schema?.settings?.title || form.title || "Form";
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
        url: `https://www.ikiform.com/forms/${id}`,
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

    return <PublicFormClient formId={form.id} schema={form.schema} />;
  } catch (error) {
    console.error("Error loading form:", error);
    notFound();
  }
}
