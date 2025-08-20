import {
  Skeleton,
  SkeletonButton,
  SkeletonCard,
  SkeletonText,
} from '@/components/ui/skeleton';

interface FormSkeletonProps {
  variant?: 'single-step' | 'multi-step';
  showProgress?: boolean;
}

const transparentClass = 'bg-transparent/40';

export function FormSkeleton({
  variant = 'single-step',
  showProgress = false,
}: FormSkeletonProps) {
  if (variant === 'multi-step') {
    return (
      <div className="mx-auto flex max-w-xl w-full flex-col gap-6 p-4">
        {showProgress && (
          <div className="flex flex-col gap-2">
            <SkeletonText className={`h-4 w-24 ${transparentClass}`} />
            <Skeleton className={`h-2 w-full rounded-full ${transparentClass}`} />
          </div>
        )}

        <SkeletonCard
          className={`min-h-xl ${transparentClass}`}
          showFooter={false}
          showHeader={true}
          showImage={false}
        />

        <div className="flex justify-between">
          <SkeletonButton size="default" className={transparentClass} />
          <SkeletonButton size="default" className={transparentClass} />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-xl w-full flex-col gap-6 p-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className={`h-8 w-3/4 ${transparentClass}`} />
          <SkeletonText className={`h-4 w-full ${transparentClass}`} />
          <SkeletonText className={`h-4 w-2/3 ${transparentClass}`} />
        </div>
        <div className="flex flex-col gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div className="flex flex-col gap-2" key={i}>
              <SkeletonText className={`h-4 w-32 ${transparentClass}`} />
              <Skeleton className={`h-10 w-full rounded-card ${transparentClass}`} />
            </div>
          ))}
        </div>
        <div className="pt-4">
          <SkeletonButton className={`w-full ${transparentClass}`} size="lg" />
        </div>
      </div>
    </div>
  );
}

export function FormFieldSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <SkeletonText className="h-4 w-32 bg-transparent/40" />
      <Skeleton className="h-10 w-full rounded-card bg-transparent/40" />
    </div>
  );
}

export function FormProgressSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <SkeletonText className="h-4 w-24 bg-transparent/40" />
        <SkeletonText className="h-4 w-16 bg-transparent/40" />
      </div>
      <Skeleton className="h-2 w-full rounded-full bg-transparent/40" />
    </div>
  );
}
