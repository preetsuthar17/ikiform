import { Suspense } from 'react';
import { ensureDefaultRateLimitSettings } from '@/lib/forms/form-defaults';
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
  const normalizedSchema = ensureDefaultRateLimitSettings(schema);
  const isMultiStep =
    normalizedSchema.settings?.multiStep || normalizedSchema.blocks?.length > 1;

  return (
    <Suspense
      fallback={
        <FormSkeleton
          showProgress={isMultiStep}
          variant={isMultiStep ? 'multi-step' : 'single-step'}
        />
      }
    >
      <PublicFormClient formId={formId} schema={normalizedSchema} />
    </Suspense>
  );
}
