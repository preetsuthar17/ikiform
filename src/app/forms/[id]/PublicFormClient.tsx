'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const ThemeProvider = dynamic(() => import('./components/ThemeProvider'), {
  ssr: false,
});

const PublicFormContent = dynamic(
  () => import('./components/PublicFormContent'),
  {
    ssr: false,
    loading: () => <></>,
  }
);

interface PublicFormClientProps {
  formId: string;
  schema: any;
  theme?: string;
}


export default function PublicFormClient({
  formId,
  schema,
  theme,
}: PublicFormClientProps) {
  return (
    <Suspense fallback={<></>}>
      <ThemeProvider theme={theme}>
        <PublicFormContent formId={formId} schema={schema} theme={theme} />
      </ThemeProvider>
    </Suspense>
  );
}
