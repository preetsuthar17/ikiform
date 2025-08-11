import {
  Skeleton,
  SkeletonButton,
  SkeletonCard,
  SkeletonText,
} from "@/components/ui/skeleton";

interface FormSkeletonProps {
  variant?: "single-step" | "multi-step";
  showProgress?: boolean;
}

export function FormSkeleton({
  variant = "single-step",
  showProgress = false,
}: FormSkeletonProps) {
  if (variant === "multi-step") {
    return (
      <div className="mx-auto max-w-2xl space-y-6 p-4">
        {showProgress && (
          <div className="space-y-2">
            <SkeletonText className="h-4 w-24" />
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        )}

        <SkeletonCard
          className="min-h-[400px]"
          showFooter={false}
          showHeader={true}
          showImage={false}
        />

        <div className="flex justify-between">
          <SkeletonButton size="default" />
          <SkeletonButton size="default" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4">
      <div className="space-y-4">
        {}
        <div className="space-y-2">
          <Skeleton className="h-8 w-3/4" />
          <SkeletonText className="h-4 w-full" />
          <SkeletonText className="h-4 w-2/3" />
        </div>

        {}
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div className="space-y-2" key={i}>
              <SkeletonText className="h-4 w-32" />
              <Skeleton className="h-10 w-full rounded-ele" />
            </div>
          ))}
        </div>

        {}
        <div className="pt-4">
          <SkeletonButton className="w-full" size="lg" />
        </div>
      </div>
    </div>
  );
}

export function FormFieldSkeleton() {
  return (
    <div className="space-y-2">
      <SkeletonText className="h-4 w-32" />
      <Skeleton className="h-10 w-full rounded-ele" />
    </div>
  );
}

export function FormProgressSkeleton() {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <SkeletonText className="h-4 w-24" />
        <SkeletonText className="h-4 w-16" />
      </div>
      <Skeleton className="h-2 w-full rounded-full" />
    </div>
  );
}
