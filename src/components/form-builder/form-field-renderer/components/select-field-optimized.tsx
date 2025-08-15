import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import type { BaseFieldProps } from '../types';
import { SelectFieldSkeleton } from './select-field-skeleton';

const SelectFieldClient = dynamic(
  () => import('./select-field-client').then((mod) => mod.SelectFieldClient),
  {
    ssr: false,
    loading: () => <SelectFieldSkeleton />,
  }
);

/**
 * Server-optimized SelectField component
 * Uses Suspense boundaries and skeletons for optimal loading experience
 */
export function SelectFieldOptimized(props: BaseFieldProps) {
  return (
    <Suspense fallback={<SelectFieldSkeleton />}>
      <SelectFieldClient {...props} />
    </Suspense>
  );
}
