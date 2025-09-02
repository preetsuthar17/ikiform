"use client";

import { Suspense } from "react";
import { Button as BaseButton, type ButtonProps } from "./button-base";
import { Skeleton } from "./skeleton";

interface SuspenseButtonProps extends ButtonProps {
  loading?: boolean;
  suspenseFallback?: React.ReactNode;
}

export function SuspenseButton({
  suspenseFallback,
  ...props
}: SuspenseButtonProps) {
  const defaultFallback = <Skeleton className="h-8 w-20" />;
  const fallback = suspenseFallback || defaultFallback;

  return (
    <Suspense fallback={fallback}>
      <BaseButton {...props} />
    </Suspense>
  );
}

export const Button = SuspenseButton;
export type { ButtonProps, SuspenseButtonProps };
