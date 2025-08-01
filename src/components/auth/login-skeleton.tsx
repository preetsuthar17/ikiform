import { Skeleton, SkeletonCard } from '@/components/ui/skeleton';

export function LoginSkeleton() {
  return (
    <div className="flex min-h-screen">
      {}
      <div className="hidden w-1/2 lg:block">
        <div className="relative h-full">
          <Skeleton className="h-full w-full rounded-none" />
          <div className="absolute inset-0 bg-black/20" />

          {}
          <div className="absolute inset-0 flex flex-col justify-center p-12 text-white">
            <div className="space-y-6">
              <div className="space-y-4">
                <Skeleton className="h-12 w-3/4 bg-white/20" />
                <Skeleton className="h-6 w-full bg-white/10" />
                <Skeleton className="h-6 w-2/3 bg-white/10" />
              </div>

              <div className="space-y-4">
                <Skeleton className="h-6 w-32 bg-white/20" />
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div className="flex items-center gap-3" key={i}>
                      <Skeleton className="h-5 w-5 bg-white/20" />
                      <Skeleton className="h-5 w-48 bg-white/10" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md space-y-6">
          {}
          <div className="space-y-2 text-center">
            <Skeleton className="mx-auto h-8 w-32" />
            <Skeleton className="mx-auto h-5 w-48" />
          </div>

          {}
          <div className="space-y-4">
            <div className="space-y-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton className="h-12 w-full" key={i} />
              ))}
            </div>

            <div className="text-center">
              <Skeleton className="mx-auto h-4 w-24" />
            </div>

            <Skeleton className="h-1 w-full" />

            <Skeleton className="h-12 w-full" />
          </div>

          {}
          <div className="text-center">
            <Skeleton className="mx-auto h-4 w-40" />
          </div>
        </div>
      </div>
    </div>
  );
}
