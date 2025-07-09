// Loading state component for profile card
import React from "react";

// UI Components
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Skeleton,
  SkeletonAvatar,
  SkeletonText,
} from "@/components/ui/skeleton";

// Types
import type { ProfileLoadingProps } from "../types";

export function ProfileCardLoading({ className }: ProfileLoadingProps) {
  return (
    <Card
      className={`flex flex-col items-center gap-6 w-full grow relative ${className || ""}`}
    >
      <CardHeader className="flex items-center gap-2">
        <SkeletonAvatar size="xl" />
      </CardHeader>
      <div className="absolute right-3 top-3">
        <Skeleton className="w-8 h-8 rounded-full" />
      </div>
      <CardContent className="flex flex-col flex flex-col gap-1 w-full items-center">
        <SkeletonText className="h-7 w-32 mb-2" />
        <SkeletonText className="h-5 w-40" />
      </CardContent>
    </Card>
  );
}
