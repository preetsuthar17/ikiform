// Loading skeleton component for forms management
import React from "react";

// UI Components
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Constants
import {
  SKELETON_FORM_COUNT,
  SKELETON_STATS_COUNT,
  SKELETON_BUTTONS_COUNT,
} from "../constants";

// Types
import type { LoadingSkeletonProps } from "../types";

export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div className={`space-y-8 ${className || ""}`}>
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-card border border-border rounded-card">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-5 w-72" />
        </div>
        <Skeleton className="h-11 w-full sm:w-40" />
      </div>

      {/* Stats Skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[...Array(SKELETON_STATS_COUNT)].map((_, i) => (
          <Card key={i} className="p-4 bg-card border-border rounded-ele">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-7 w-8" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Forms Grid Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(SKELETON_FORM_COUNT)].map((_, i) => (
          <Card key={i} className="p-6 bg-card border-border rounded-card">
            {/* Card Header Skeleton */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>

            {/* Metadata Skeleton */}
            <div className="flex items-center justify-between text-sm mb-6 pt-2 border-t border-border/50">
              <div className="flex items-center gap-1">
                <Skeleton className="w-2 h-2 rounded-full" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-4 w-20" />
            </div>

            {/* Action Buttons Skeleton */}
            <div className="flex items-center gap-1">
              {[...Array(SKELETON_BUTTONS_COUNT)].map((_, btnIndex) => (
                <Skeleton key={btnIndex} className="h-9 w-9 rounded-md" />
              ))}
              <div className="flex-1"></div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
