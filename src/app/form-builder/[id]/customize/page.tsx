import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { FormCustomizePage } from "@/components/form-builder/form-customize";
import { ensureDefaultFormSettings } from "@/lib/forms";
import { createClient } from "@/utils/supabase/server";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getFormData(id: string, userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("forms")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    notFound();
  }

  return {
    ...data,
    schema: ensureDefaultFormSettings(data.schema),
  };
}

async function getUserAndPremiumStatus() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: subscription } = await supabase
    .from("users")
    .select("has_premium")
    .eq("uid", user.id)
    .single();

  const hasPremium = subscription?.has_premium;

  return { user, hasPremium };
}

export default async function CustomizePage({ params }: PageProps) {
  const { id } = await params;

  try {
    const { user, hasPremium } = await getUserAndPremiumStatus();

    if (!hasPremium) {
      redirect("/dashboard");
    }

    const form = await getFormData(id, user.id);

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

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const { user } = await getUserAndPremiumStatus();
    const form = await getFormData(id, user.id);

    return {
      title: `Customize ${form.schema.settings.title}`,
      description: "Customize the design and appearance of your form",
    };
  } catch {
    return {
      title: "Customize Form",
      description: "Customize the design and appearance of your form",
    };
  }
}
