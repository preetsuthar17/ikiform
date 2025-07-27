'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormAnalytics } from '@/components/forms/form-analytics';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { useAuth } from '@/hooks/use-auth';
import { usePremiumStatus } from '@/hooks/use-premium-status';
import { createClient } from '@/utils/supabase/client';

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
      if (!(user && id)) return;

      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('forms')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (error || !data) {
          notFound();
        }

        setForm(data);
      } catch (error) {
        console.error('Error loading form:', error);
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
          You need a premium subscription to access form analytics. Upgrade to
          unlock all features.
        </div>
        <Link href="/#pricing">
          <Button size="lg">View Pricing</Button>
        </Link>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  return <FormAnalytics form={form} />;
}
