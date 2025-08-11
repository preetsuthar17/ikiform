import { Suspense } from "react";
import { redirect } from "next/navigation";
import { formsDb } from "@/lib/database";
import { FormCustomizePage } from "@/components/form-builder/form-customize";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CustomizePage({ params }: PageProps) {
  const { id } = await params;

  try {
    const form = await formsDb.getForm(id);

    if (!form) {
      redirect("/dashboard");
    }

    return (
      <Suspense fallback={<div>Loading customization...</div>}>
        <FormCustomizePage formId={id} schema={form.schema} />
      </Suspense>
    );
  } catch (error) {
    console.error("Error loading form for customization:", error);
    redirect("/dashboard");
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;

  try {
    const form = await formsDb.getForm(id);
    
    return {
      title: form ? `Customize ${form.schema.settings.title}` : "Customize Form",
      description: "Customize the design and appearance of your form",
    };
  } catch {
    return {
      title: "Customize Form",
      description: "Customize the design and appearance of your form",
    };
  }
}
