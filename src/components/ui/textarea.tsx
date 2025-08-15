'use client';

import React, { Suspense } from 'react';
import { Skeleton } from './skeleton';
import { Textarea as BaseTextarea, type TextareaProps } from './textarea-base';

interface SuspenseTextareaProps extends TextareaProps {
  loading?: boolean;
  suspenseFallback?: React.ReactNode;
}

/**
 * Textarea component with Suspense wrapper for enhanced loading states
 */
export const SuspenseTextarea = React.forwardRef<
  HTMLTextAreaElement,
  SuspenseTextareaProps
>(({ loading = false, suspenseFallback, ...props }, ref) => {
  const defaultFallback = <Skeleton className="min-h-[80px] w-full" />;

  const fallback = suspenseFallback || defaultFallback;

  if (loading) {
    return fallback;
  }

  return (
    <Suspense fallback={fallback}>
      <BaseTextarea ref={ref} {...props} />
    </Suspense>
  );
});

SuspenseTextarea.displayName = 'SuspenseTextarea';

export const Textarea = SuspenseTextarea;
export type { TextareaProps, SuspenseTextareaProps };
