import { Skeleton } from '@/components/ui/skeleton';

export function LoginSkeleton() {
  return (
    <div className="mx-3 flex min-h-screen flex-col items-center justify-center gap-4 overflow-hidden bg-muted">
      <div className="w-full max-w-sm">
        <div className="flex w-full flex-col items-center justify-center gap-8 rounded-xl border-none bg-transparent p-0 shadow-none">
          <div className="flex w-full flex-col items-center gap-2">
            <Skeleton className="h-7 w-36 rounded-md" />
          </div>
          <div className="flex w-full flex-col gap-6">
            <form className="flex w-full flex-col gap-4">
              <div className="relative w-full">
                <Skeleton className="h-12 w-full rounded-full" />
                <Skeleton className="absolute top-2 left-4 h-4 w-28 rounded" />
              </div>
              <div className="relative w-full">
                <Skeleton className="h-12 w-full rounded-full" />
                <Skeleton className="absolute top-2 left-4 h-4 w-24 rounded" />
              </div>
              <Skeleton className="h-12 w-full rounded-full" />
              <Skeleton className="h-12 w-full rounded-full" />
              <Skeleton className="mx-auto h-4 w-20 rounded" />
              <div className="flex w-full flex-col gap-2">
                <Skeleton className="mx-auto h-4 w-32 rounded" />
                <Skeleton className="mx-auto h-4 w-24 rounded" />
              </div>
            </form>
            <div className="flex w-full flex-col gap-2">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="h-px w-full bg-muted-foreground/20" />
                </div>
                <div className="relative flex justify-center">
                  <Skeleton className="h-4 w-10 rounded" />
                </div>
              </div>
              <div className="flex w-full flex-col items-start justify-center gap-2">
                <Skeleton className="h-12 w-full rounded-full" />
                <Skeleton className="h-12 w-full rounded-full" />
              </div>
            </div>
            <div className="text-center">
              <Skeleton className="mx-auto h-4 w-48 rounded" />
            </div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <Skeleton className="mx-auto h-3 w-56 rounded" />
        </div>
      </div>
    </div>
  );
}
