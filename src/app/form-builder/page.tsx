"use client";

import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import Link from "next/link";
import { FormBuilder } from "@/components/form-builder/form-builder";

export default function NewFormBuilderPage() {
  const { user, loading } = useAuth();
  const [hasPremium, setHasPremium] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

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

  if (loading || checking || hasPremium === null) {
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

  return <FormBuilder />;
}
