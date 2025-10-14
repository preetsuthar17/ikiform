import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { FormAnalyticsProps } from "./types";

function FormAnalyticsSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-[95%] flex-col gap-6 px-6">
      {}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div className="rounded-2xl border bg-card p-6" key={i}>
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12" variant="circle" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-12" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {}
      <div className="rounded-2xl border bg-card p-6">
        <Skeleton className="mb-4 h-6 w-32" />
        <Skeleton className="h-64 w-full" />
      </div>

      {}
      <div className="rounded-2xl border bg-card p-6">
        <Skeleton className="mb-4 h-6 w-32" />
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div className="flex items-center gap-4" key={i}>
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const FormAnalyticsClient = dynamic(
  () =>
    import("./form-analytics-client").then((mod) => ({
      default: mod.FormAnalyticsClient,
    })),
  {
    ssr: false,
    loading: () => <FormAnalyticsSkeleton />,
  }
);

/**
 * Server component wrapper for FormAnalytics
 * Provides immediate skeleton loading while client components initialize
 */
export function FormAnalyticsOptimized(props: FormAnalyticsProps) {
  return (
    <Suspense fallback={<FormAnalyticsSkeleton />}>
      <FormAnalyticsClient {...props} />
    </Suspense>
  );
}
