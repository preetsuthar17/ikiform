"use client";

import React, { useEffect, useState } from "react";
import { FormBuilder } from "@/components/form-builder/form-builder";
import { useAuth } from "@/hooks/use-auth";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import Link from "next/link";

interface FormBuilderPageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function FormBuilderPage({ params }: FormBuilderPageProps) {
  const { user, loading } = useAuth();
  const [hasPremium, setHasPremium] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const p = await params;
      setId(p.id);
    })();
  }, [params]);

  useEffect(() => {
    if (!user) {
      setHasPremium(false);
      return;
    }
    setChecking(true);
    const checkPremium = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("users")
        .select("has_premium")
        .eq("email", user.email)
        .single();
      setHasPremium(data?.has_premium || false);
      setChecking(false);
    };
    checkPremium();
  }, [user]);

  if (loading || checking || hasPremium === null || !id) {
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
          You need a premium subscription to use the form builder. Upgrade to
          unlock all features.
        </div>
        <Link href="/pricing">
          <Button size="lg">View Pricing</Button>
        </Link>
      </div>
    );
  }

  return <FormBuilder formId={id} />;
}
