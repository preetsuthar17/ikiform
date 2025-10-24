import { useMemo } from "react";
import { CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ProfileLoadingProps } from "../types";

export function ProfileCardLoading({ className }: ProfileLoadingProps) {
  const containerClassName = useMemo(
    () =>
      `relative flex h-fit max-h-min w-full grow flex-col items-center gap-6 rounded-xl py-11.5 shadow-none ${className ?? ""}`,
    [className]
  );

  return (
    <Skeleton
      aria-label="Loading user profile information"
      className={containerClassName}
      role="status"
    >
      <Skeleton aria-hidden="true" className="size-16 rounded-full" />

      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1 text-center">
          <div className="flex items-center justify-center gap-2">
            <Skeleton aria-hidden="true" className="h-7 w-32" />
            <Skeleton aria-hidden="true" className="size-5 rounded" />
          </div>
          <Skeleton aria-hidden="true" className="mx-auto size-40" />
        </div>
      </CardContent>
    </Skeleton>
  );
}
