"use client";

import React, { useEffect, useState } from "react";
import { FormBuilder } from "@/components/form-builder/form-builder";
import { useAuth } from "@/hooks/use-auth";
import { usePremiumStatus } from "@/hooks/use-premium-status";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import Link from "next/link";

interface FormBuilderPageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function FormBuilderPage({ params }: FormBuilderPageProps) {
  const { user, loading } = useAuth();
  const { hasPremium, checkingPremium: checking } = usePremiumStatus(user);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const p = await params;
      setId(p.id);
    })();
  }, [params]);

  if (loading || checking || !id) {
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
