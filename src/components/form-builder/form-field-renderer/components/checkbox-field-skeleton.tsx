import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton loading state for CheckboxField
 * Provides visual feedback during component loading
 */
export function CheckboxFieldSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-4 rounded-sm" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-4 rounded-sm" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-4 rounded-sm" />
        <Skeleton className="h-4 w-28" />
      </div>
    </div>
  );
}
