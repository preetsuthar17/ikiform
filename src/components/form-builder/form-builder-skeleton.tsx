import { Skeleton } from '@/components/ui/skeleton';

export function FormBuilderSkeleton() {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <div className="z-20 flex-shrink-0 border-border border-b bg-card px-4 py-3 md:py-4">
        <div className="flex h-full flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-0">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex items-center gap-2 md:gap-3">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>

          <div className="flex gap-2 md:hidden">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-20" />
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-16" />
            <Skeleton className="h-9 w-16" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-80 flex-shrink-0 border-border border-r bg-card">
          <div className="h-full p-4">
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />

              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    className="flex flex-col items-center gap-2 rounded-lg border bg-background p-3 transition-colors hover:bg-muted/50"
                    key={i}
                  >
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-muted/20">
          <div className="h-full overflow-auto p-6">
            <div className="mx-auto max-w-2xl">
              {/* Form header */}
              <div className="mb-8 space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-full" />
              </div>

              <div className="rounded-xl border bg-background p-8 shadow-sm">
                <div className="space-y-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div className="space-y-3" key={i}>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-3 rounded-full" />
                      </div>
                      {i % 3 === 0 ? (
                        <Skeleton className="h-10 w-full" />
                      ) : i % 3 === 1 ? (
                        <Skeleton className="h-24 w-full" />
                      ) : (
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="pt-4">
                    <Skeleton className="h-11 w-32" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-80 flex-shrink-0 border-border border-l bg-card">
          <div className="h-full">
            {/* Panel tabs */}
            <div className="border-border border-b p-4">
              <div className="flex gap-1">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>

            <div className="p-4">
              <div className="space-y-6">
                <Skeleton className="h-5 w-28" />

                {Array.from({ length: 6 }).map((_, i) => (
                  <div className="space-y-2" key={i}>
                    <Skeleton className="h-4 w-20" />
                    {i % 4 === 0 ? (
                      <Skeleton className="h-9 w-full" />
                    ) : i % 4 === 1 ? (
                      <Skeleton className="h-20 w-full" />
                    ) : i % 4 === 2 ? (
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    ) : (
                      <Skeleton className="h-9 w-full" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-4">
        <div className="flex items-center gap-2 rounded-lg bg-background/95 px-3 py-2 shadow-lg backdrop-blur-sm">
          <Skeleton className="h-2 w-2 rounded-full" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}
