import { notFound } from "next/navigation";
import { PublicForm } from "@/components/forms/public-form";
import { createClient } from "@/utils/supabase/server";

interface PreviewFormPageProps {
  params: Promise<{ id: string }>;
}

export default async function PreviewFormPage({
  params,
}: PreviewFormPageProps) {
  const { id } = await params;

  try {
    // For preview, we get any form (not just published ones)
    const supabase = await createClient();
    const { data: form, error } = await supabase
      .from("forms")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !form) {
      notFound();
    }

    return (
      <div>
        {/* Preview banner */}
        <div className="bg-blue-600 text-white px-4 py-2 text-center text-sm font-medium">
          Preview Mode - This form is not yet published
        </div>
        <PublicForm formId={form.id} schema={form.schema} />
      </div>
    );
  } catch (error) {
    console.error("Error loading form:", error);
    notFound();
  }
}
