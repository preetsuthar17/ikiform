import { Skeleton } from '@/components/ui/skeleton';

/**
 * Skeleton loading state for SelectField
 */
export function SelectFieldSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-10 w-full rounded-md border" />
    </div>
  );
}
