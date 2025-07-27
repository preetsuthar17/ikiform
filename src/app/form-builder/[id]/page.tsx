'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FormBuilder } from '@/components/form-builder/form-builder';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { useAuth } from '@/hooks/use-auth';
import { usePremiumStatus } from '@/hooks/use-premium-status';

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
      <div className="flex min-h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!(user && hasPremium)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6">
        <div className="font-semibold text-2xl">Requires Premium</div>
        <div className="max-w-md text-center text-muted-foreground">
          You need a premium subscription to use the form builder. Upgrade to
          unlock all features.
        </div>
        <Link href="/#pricing">
          <Button size="lg">View Pricing</Button>
        </Link>
      </div>
    );
  }

  return <FormBuilder formId={id} />;
}
