import { Skeleton } from "@/components/ui/skeleton";

interface RadioFieldSkeletonProps {
  optionsCount?: number;
}

/**
 * Skeleton loading state for RadioField
 * Provides immediate visual feedback while content loads
 */
export function RadioFieldSkeleton({
  optionsCount = 3,
}: RadioFieldSkeletonProps) {
  return (
    <div className="flex flex-col gap-2">
      {}
      <Skeleton className="h-5 w-24" />

      {}
      <div className="flex flex-col gap-3">
        {Array.from({ length: optionsCount }).map((_, index) => (
          <div className="flex items-center gap-3" key={index}>
            <Skeleton className="h-4 w-4" variant="circle" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>

      {}
      <Skeleton className="h-4 w-32" />
    </div>
  );
}
