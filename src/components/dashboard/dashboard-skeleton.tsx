import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <section className="mx-auto w-full max-w-[95%] px-6">
      <div className="flex flex-col gap-8">
        {}
        <div className="rounded-card border bg-card p-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16" variant="avatar" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        </div>

        {}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-10 w-28" />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard
                className="h-48"
                key={i}
                showFooter={true}
                showImage={false}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
