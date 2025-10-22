import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { FormAnalytics } from "@/components/forms/form-analytics/form-analytics";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { createClient } from "@/utils/supabase/server";

interface FormAnalyticsPageProps {
  params: Promise<{ id: string }>;
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

  return data;
}

async function getUserAndPremiumStatus() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/auth/signin");
  }

  const { data: subscription } = await supabase
    .from("users")
    .select("has_premium")
    .eq("uid", user.id)
    .single();

  const hasPremium = subscription?.has_premium;

  return { user, hasPremium };
}

function PremiumRequired() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <div className="font-semibold text-2xl">Requires Premium</div>
      <div className="max-w-md text-center text-muted-foreground">
        You need a premium subscription to access form analytics. Upgrade to
        unlock all features.
      </div>
      <Link href="/#pricing">
        <Button size="lg">View Pricing</Button>
      </Link>
    </div>
  );
}

export default async function FormAnalyticsPage({
  params,
}: FormAnalyticsPageProps) {
  const { id } = await params;
  const { user, hasPremium } = await getUserAndPremiumStatus();

  if (!hasPremium) {
    return <PremiumRequired />;
  }

  const form = await getFormData(id, user.id);

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader />
        </div>
      }
    >
      <FormAnalytics form={form} />
    </Suspense>
  );
}
