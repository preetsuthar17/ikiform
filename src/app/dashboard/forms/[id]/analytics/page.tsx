import { notFound, redirect } from "next/navigation";
import { FormAnalytics } from "@/components/forms/form-analytics";
import { formsDbServer } from "@/lib/database";
import { createClient } from "@/utils/supabase/server";

interface FormAnalyticsPageProps {
  params: Promise<{ id: string }>;
}

export default async function FormAnalyticsPage({
  params,
}: FormAnalyticsPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  try {
    // Verify form ownership
    const hasAccess = await formsDbServer.verifyFormOwnership(id, user!.id);
    if (!hasAccess) {
      notFound();
    }

    // Get form data
    const supabaseClient = await createClient();
    const { data: form, error } = await supabaseClient
      .from("forms")
      .select("*")
      .eq("id", id)
      .eq("user_id", user?.id)
      .single();

    if (error || !form) {
      notFound();
    }

    return <FormAnalytics form={form} />;
  } catch (error) {
    console.error("Error loading form analytics:", error);
    notFound();
  }
}
