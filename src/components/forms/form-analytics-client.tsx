'use client';

import { FormAnalytics } from '@/components/forms/form-analytics';

interface FormAnalyticsClientProps {
  form: any;
}

export function FormAnalyticsClient({ form }: FormAnalyticsClientProps) {
  return <FormAnalytics form={form} />;
}
