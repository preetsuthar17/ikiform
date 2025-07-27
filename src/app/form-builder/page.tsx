'use client';

import Link from 'next/link';
import { FormBuilder } from '@/components/form-builder/form-builder';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { useAuth } from '@/hooks/use-auth';
import { usePremiumStatus } from '@/hooks/use-premium-status';

export default function NewFormBuilderPage() {
  const { user, loading } = useAuth();
  const { hasPremium, checkingPremium: checking } = usePremiumStatus(user);

  if (loading || checking) {
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

  return <FormBuilder />;
}
