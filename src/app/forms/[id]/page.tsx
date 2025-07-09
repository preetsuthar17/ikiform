import { notFound } from "next/navigation";
import PublicFormClient from "./PublicFormClient";
import { formsDbServer } from "@/lib/database";

interface PublicFormPageProps {
  params: Promise<{ id: string }>;
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
