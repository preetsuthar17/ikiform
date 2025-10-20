import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton loading state for SignatureField
 * Provides visual feedback during component loading
 */
export function SignatureFieldSkeleton() {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="relative w-full overflow-hidden rounded-md border-2 border-muted border-dashed bg-background">
        <Skeleton className="h-[120px] w-full" />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-muted-foreground">
          <Skeleton className="size-40" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-12" />
      </div>
    </div>
  );
}
