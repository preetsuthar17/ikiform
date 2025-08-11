import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton loading state for SelectField
 */
export function SelectFieldSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-10 w-full rounded-md border" />
    </div>
  );
}
