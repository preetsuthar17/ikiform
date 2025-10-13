import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import {
  SKELETON_BUTTONS_COUNT,
  SKELETON_FORM_COUNT,
  SKELETON_STATS_COUNT,
} from "../constants";

import type { LoadingSkeletonProps } from "../types";

export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div className={`flex flex-col gap-8 ${className || ""}`}>
      {}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-5 w-72" />
        </div>
        <Skeleton className="h-11 w-full sm:w-40" />
      </div>

      {}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[...Array(SKELETON_STATS_COUNT)].map((_, i) => (
          <Card className="rounded-xl border-border bg-card p-4" key={i}>
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-2xl" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-7 w-8" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {[...Array(SKELETON_FORM_COUNT)].map((_, i) => (
          <Card className="rounded-2xl border-border bg-card p-6" key={i}>
            {}
            <div className="mb-4 flex items-start justify-between">
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <Skeleton className="h-6 w-16 rounded-2xl" />
            </div>

            {}
            <div className="mb-6 flex items-center justify-between border-border/50 border-t pt-2 text-sm">
              <div className="flex items-center gap-1">
                <Skeleton className="h-2 w-2 rounded-2xl" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-4 w-20" />
            </div>

            {}
            <div className="flex items-center gap-1">
              {[...Array(SKELETON_BUTTONS_COUNT)].map((_, btnIndex) => (
                <Skeleton className="h-9 w-9 rounded-xl" key={btnIndex} />
              ))}
              <div className="flex-1" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
