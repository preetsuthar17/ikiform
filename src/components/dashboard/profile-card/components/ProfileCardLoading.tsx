import { CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ProfileLoadingProps } from "../types";

export function ProfileCardLoading({ className }: ProfileLoadingProps) {
  return (
    <Skeleton
      aria-label="Loading user profile"
      className={`relative flex h-fit max-h-min w-full grow flex-col items-center gap-6 rounded-xl py-11.5 shadow-none ${className ?? ""}`}
      role="region"
    >
      {/* Avatar Skeleton */}
      <Skeleton className="h-16 w-16 rounded-full" />

      {/* Profile Info Skeleton */}
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1 text-center">
          <div className="flex items-center justify-center gap-2">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-5 w-5 rounded" />
          </div>
          <Skeleton className="mx-auto h-4 w-40" />
        </div>
      </CardContent>
    </Skeleton>
  );
}
