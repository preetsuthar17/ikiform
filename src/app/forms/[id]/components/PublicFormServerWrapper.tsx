import { Suspense } from 'react';
import PublicFormClient from '../PublicFormClient';
import { FormSkeleton } from './FormSkeletons';

interface PublicFormServerWrapperProps {
  formId: string;
  schema: any;
}

export default function PublicFormServerWrapper({
  formId,
  schema,
}: PublicFormServerWrapperProps) {
  const isMultiStep = schema.settings?.multiStep || schema.blocks?.length > 1;

  return (
    <Suspense
      fallback={
        <FormSkeleton
          showProgress={isMultiStep}
          variant={isMultiStep ? 'multi-step' : 'single-step'}
        />
      }
    >
      <PublicFormClient formId={formId} schema={schema} />
    </Suspense>
  );
}
