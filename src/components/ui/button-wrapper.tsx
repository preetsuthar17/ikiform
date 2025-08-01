'use client';

import { Suspense } from 'react';
import { Button as BaseButton, type ButtonProps } from './button-base';
import { Skeleton } from './skeleton';

interface SuspenseButtonProps extends ButtonProps {
  loading?: boolean;
  suspenseFallback?: React.ReactNode;
}

/**
 * Button component with Suspense wrapper for enhanced loading states
 */
export function SuspenseButton({
  loading = false,
  suspenseFallback,
  ...props
}: SuspenseButtonProps) {
  const defaultFallback = <Skeleton className="h-9 w-20" />;

  const fallback = suspenseFallback || defaultFallback;

  if (loading) {
    return fallback;
  }

  return (
    <Suspense fallback={fallback}>
      <BaseButton {...props} />
    </Suspense>
  );
}

export const Button = SuspenseButton;
export type { ButtonProps, SuspenseButtonProps };
