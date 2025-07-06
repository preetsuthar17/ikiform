"use client";

import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { usePremiumStatus } from "@/hooks/use-premium-status";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicForm } from "@/components/forms/public-form";
import { Badge } from "@/components/ui/badge";

interface PreviewFormPageProps {
  params: Promise<{ id: string }>;
}

export default function PreviewFormPage({ params }: PreviewFormPageProps) {
  const { user, loading } = useAuth();
  const { hasPremium, checkingPremium: checking } = usePremiumStatus(user);
  const [form, setForm] = useState<any>(null);
  const [fetching, setFetching] = useState(true);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const p = await params;
      setId(p.id);
    })();
  }, [params]);

  useEffect(() => {
    if (!id || !user || !hasPremium) return;
    setFetching(true);
    const fetchForm = async () => {
      try {
        const supabase = createClient();
        const { data: form, error } = await supabase
          .from("forms")
          .select("*")
          .eq("id", id)
          .single();
        if (error || !form) {
          setForm(null);
        } else {
          setForm(form);
        }
      } catch {
        setForm(null);
      } finally {
        setFetching(false);
      }
    };
    fetchForm();
  }, [id, user, hasPremium]);

  if (loading || checking || !id || fetching) {
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
          You need a premium subscription to preview forms. Upgrade to unlock
          all features.
        </div>
        <Link href="/#pricing">
          <Button size="lg">View Pricing</Button>
        </Link>
      </div>
    );
  }

  if (!form) {
    notFound();
  }

  return (
    <div className="relative">
      <Badge className="w-fit absolute bottom-10 right-10">Preview</Badge>
      <PublicForm formId={form.id} schema={form.schema} />
    </div>
  );
}
