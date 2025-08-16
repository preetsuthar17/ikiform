'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

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
}

export default function PublicFormClient({
  formId,
  schema,
}: PublicFormClientProps) {
  return (
    <Suspense fallback={<></>}>
      <PublicFormContent formId={formId} schema={schema} />
    </Suspense>
  );
}
