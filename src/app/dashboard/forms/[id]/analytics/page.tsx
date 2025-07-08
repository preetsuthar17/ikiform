"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { FormAnalytics } from "@/components/forms/form-analytics";
import { useAuth } from "@/hooks/use-auth";
import { usePremiumStatus } from "@/hooks/use-premium-status";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

interface FormAnalyticsPageProps {
  params: Promise<{ id: string }>;
}

export default function FormAnalyticsPage({ params }: FormAnalyticsPageProps) {
  const { user, loading } = useAuth();
  const { hasPremium, checkingPremium: checking } = usePremiumStatus(user);
  const [form, setForm] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(true);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const loadForm = async () => {
      const p = await params;
      setId(p.id);
    };
    loadForm();
  }, [params]);

  useEffect(() => {
    const fetchForm = async () => {
      if (!user || !id) return;

      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("forms")
          .select("*")
          .eq("id", id)
          .eq("user_id", user.id)
          .single();

        if (error || !data) {
          notFound();
        }

        setForm(data);
      } catch (error) {
        console.error("Error loading form:", error);
        notFound();
      } finally {
        setFormLoading(false);
      }
    };

    if (user && id && hasPremium) {
      fetchForm();
    } else if (user && id && !hasPremium) {
      setFormLoading(false);
    }
  }, [user, id, hasPremium]);

  if (loading || checking || (hasPremium && formLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!user || !hasPremium) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6">
        <div className="text-2xl font-semibold">Requires Premium</div>
        <div className="text-muted-foreground text-center max-w-md">
          You need a premium subscription to access form analytics. Upgrade to
          unlock all features.
        </div>
        <Link href="/pricing">
          <Button size="lg">View Pricing</Button>
        </Link>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return <FormAnalytics form={form} />;
}
