'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { FormSkeleton } from './components/FormSkeletons';

const ThemeProvider = dynamic(() => import('./components/ThemeProvider'), {
  ssr: false,
});

const PublicFormContent = dynamic(
  () => import('./components/PublicFormContent'),
  {
    ssr: false,
    loading: () => <FormSkeleton variant="single-step" />,
  }
);

interface PublicFormClientProps {
  formId: string;
  schema: any;
  theme?: string;
}

function PublicFormSkeleton() {
  return <FormSkeleton variant="single-step" />;
}

export default function PublicFormClient({
  formId,
  schema,
  theme,
}: PublicFormClientProps) {
  return (
    <Suspense fallback={<PublicFormSkeleton />}>
      <ThemeProvider theme={theme}>
        <PublicFormContent formId={formId} schema={schema} theme={theme} />
      </ThemeProvider>
    </Suspense>
  );
}
