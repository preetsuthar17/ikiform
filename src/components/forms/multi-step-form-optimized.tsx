import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import type { MultiStepFormProps } from './multi-step-form/types';
import { MultiStepFormSkeleton } from './multi-step-form-skeleton';

const MultiStepFormClient = dynamic(
  () =>
    import('./multi-step-form-client').then((mod) => mod.MultiStepFormClient),
  {
    ssr: false,
    loading: () => <MultiStepFormSkeleton />,
  }
);

/**
 * Server-optimized MultiStepForm component
 * Uses Suspense boundaries and skeletons for optimal loading experience
 * Processes form blocks and settings on the server when possible
 */
export function MultiStepFormOptimized(
  props: MultiStepFormProps & { dir?: string }
) {
  return (
    <Suspense fallback={<MultiStepFormSkeleton />}>
      <MultiStepFormClient {...props} />
    </Suspense>
  );
}
