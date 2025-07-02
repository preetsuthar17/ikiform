import { notFound } from "next/navigation";
import { PublicForm } from "@/components/forms/public-form";
import { createClient } from "@/utils/supabase/server";
import { Badge } from "@/components/ui/badge";

interface PreviewFormPageProps {
  params: Promise<{ id: string }>;
}

export default async function PreviewFormPage({
  params,
}: PreviewFormPageProps) {
  const { id } = await params;

  try {
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
      <div className="relative">
        <Badge className="w-fit absolute bottom-10 right-10">Preview</Badge>
        <PublicForm formId={form.id} schema={form.schema} />
      </div>
    );
  } catch (error) {
    console.error("Error loading form:", error);
    notFound();
  }
}
