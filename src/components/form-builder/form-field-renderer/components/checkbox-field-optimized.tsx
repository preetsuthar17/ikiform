import dynamic from "next/dynamic";
import { Suspense } from "react";
import type { BaseFieldProps } from "../types";
import { CheckboxFieldSkeleton } from "./checkbox-field-skeleton";

const CheckboxFieldClient = dynamic(
  () =>
    import("./checkbox-field-client").then((mod) => ({
      default: mod.CheckboxFieldClient,
    })),
  {
    ssr: false,
    loading: () => <CheckboxFieldSkeleton />,
  },
);

/**
 * Server-optimized CheckboxField component
 * Uses Suspense boundaries and skeletons for optimal loading experience
 */
export function CheckboxFieldOptimized(props: BaseFieldProps) {
  return (
    <Suspense fallback={<CheckboxFieldSkeleton />}>
      <CheckboxFieldClient {...props} />
    </Suspense>
  );
}
