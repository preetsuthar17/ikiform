import React from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Skeleton,
  SkeletonAvatar,
  SkeletonText,
} from "@/components/ui/skeleton";

import type { ProfileLoadingProps } from "../types";

export function ProfileCardLoading({ className }: ProfileLoadingProps) {
  return (
    <Card
      className={`relative flex w-full grow flex-col items-center gap-6 ${className || ""}`}
    >
      <CardHeader className="flex items-center gap-2">
        <SkeletonAvatar size="xl" />
      </CardHeader>
      <div className="absolute top-3 right-3">
        <Skeleton className="h-8 w-8 rounded-card" />
      </div>
      <CardContent className="flex w-full flex-col items-center gap-1">
        <SkeletonText className="mb-2 h-7 w-32" />
        <SkeletonText className="h-5 w-40" />
      </CardContent>
    </Card>
  );
}
