"use client";

import React, { Suspense } from "react";
import { Input as BaseInput, type InputProps } from "./input-base";
import { Skeleton } from "./skeleton";

interface SuspenseInputProps extends InputProps {
  loading?: boolean;
  suspenseFallback?: React.ReactNode;
}

/**
 * Input component with Suspense wrapper for enhanced loading states
 */
export const SuspenseInput = React.forwardRef<
  HTMLInputElement,
  SuspenseInputProps
>(({ loading = false, suspenseFallback, ...props }, ref) => {
  const defaultFallback = <Skeleton className="h-9 w-full" />;

  const fallback = suspenseFallback || defaultFallback;

  if (loading) {
    return fallback;
  }

  return (
    <Suspense fallback={fallback}>
      <BaseInput ref={ref} {...props} />
    </Suspense>
  );
});

SuspenseInput.displayName = "SuspenseInput";

export const Input = SuspenseInput;
export type { InputProps, SuspenseInputProps };
