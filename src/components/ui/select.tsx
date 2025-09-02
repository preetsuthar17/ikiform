"use client";

import { Suspense } from "react";
import {
  Select as BaseSelect,
  SelectContent as BaseSelectContent,
  SelectItem as BaseSelectItem,
  SelectTrigger as BaseSelectTrigger,
  SelectValue as BaseSelectValue,
} from "./select-base";
import { Skeleton } from "./skeleton";

interface SuspenseSelectProps extends React.ComponentProps<typeof BaseSelect> {
  loading?: boolean;
  suspenseFallback?: React.ReactNode;
}

interface SuspenseSelectTriggerProps
  extends React.ComponentProps<typeof BaseSelectTrigger> {
  loading?: boolean;
  suspenseFallback?: React.ReactNode;
}

interface SuspenseSelectContentProps
  extends React.ComponentProps<typeof BaseSelectContent> {
  loading?: boolean;
  suspenseFallback?: React.ReactNode;
}

/**
 * Select component with Suspense wrapper
 */
export function SuspenseSelect({
  loading = false,
  suspenseFallback,
  ...props
}: SuspenseSelectProps) {
  const fallback = suspenseFallback || <Skeleton className="h-9 w-full" />;

  if (loading) {
    return fallback;
  }

  return (
    <Suspense fallback={fallback}>
      <BaseSelect {...props} />
    </Suspense>
  );
}

/**
 * SelectTrigger component with Suspense wrapper
 */
export function SuspenseSelectTrigger({
  loading = false,
  suspenseFallback,
  ...props
}: SuspenseSelectTriggerProps) {
  const fallback = suspenseFallback || <Skeleton className="h-9 w-full" />;

  if (loading) {
    return fallback;
  }

  return (
    <Suspense fallback={fallback}>
      <BaseSelectTrigger {...props} />
    </Suspense>
  );
}

/**
 * SelectContent component with Suspense wrapper
 */
export function SuspenseSelectContent({
  loading = false,
  suspenseFallback,
  ...props
}: SuspenseSelectContentProps) {
  const fallback = suspenseFallback || <Skeleton className="h-32 w-full" />;

  if (loading) {
    return fallback;
  }

  return (
    <Suspense fallback={fallback}>
      <BaseSelectContent {...props} />
    </Suspense>
  );
}

export const Select = SuspenseSelect;
export const SelectTrigger = SuspenseSelectTrigger;
export const SelectContent = SuspenseSelectContent;
export const SelectItem = BaseSelectItem;
export const SelectValue = BaseSelectValue;
