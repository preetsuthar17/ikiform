import { Suspense } from 'react';
import type { BaseFieldProps } from '../types';
import { RadioFieldClient } from './radio-field-client';
import { RadioFieldSkeleton } from './radio-field-skeleton';

/**
 * Server component wrapper for RadioField
 * Handles static rendering and wraps client functionality in Suspense
 */
export function RadioFieldOptimized(props: BaseFieldProps) {
  const { field, error } = props;

  if (!field.optionsApi && field.options?.length) {
    return (
      <div className="flex flex-col gap-2">
        {field.label && (
          <label className="font-medium text-foreground text-sm">
            {field.label}
            {field.required && <span className="ml-1 text-destructive">*</span>}
          </label>
        )}

        <Suspense
          fallback={<RadioFieldSkeleton optionsCount={field.options.length} />}
        >
          <RadioFieldClient {...props} />
        </Suspense>

        {error && <p className="text-destructive text-sm">{error}</p>}

        {field.description && (
          <p className="text-muted-foreground text-sm">{field.description}</p>
        )}
      </div>
    );
  }

  return (
    <Suspense fallback={<RadioFieldSkeleton />}>
      <RadioFieldClient {...props} />
    </Suspense>
  );
}
