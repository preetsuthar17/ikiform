'use client';

import { Card } from '@/components/ui/card';

interface ChartSkeletonProps {
  height?: number;
  title?: boolean;
  className?: string;
}

export function ChartSkeleton({
  height = 300,
  title = true,
  className = '',
}: ChartSkeletonProps) {
  return (
    <Card className={`p-4 ${className}`}>
      {title && (
        <div className="mb-4">
          <div className="h-5 w-1/3 animate-pulse rounded bg-muted" />
        </div>
      )}
      <div
        className="relative animate-pulse overflow-hidden rounded-lg bg-gradient-to-br from-muted/30 to-muted/60"
        style={{ height: `${height}px` }}
      >
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-muted/20 to-transparent" />
        <div className="absolute right-4 bottom-4 left-4">
          <div className="flex items-end justify-between gap-1">
            {Array.from({ length: 7 }, (_, i) => (
              <div
                className="rounded-t bg-muted/40"
                key={i}
                style={{
                  height: `${Math.random() * 60 + 20}%`,
                  width: '12%',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

export function AreaChartSkeleton({
  height = 300,
  title = true,
  className = '',
}: ChartSkeletonProps) {
  return (
    <Card className={`p-4 ${className}`}>
      {title && (
        <div className="mb-4">
          <div className="h-5 w-1/3 animate-pulse rounded bg-muted" />
        </div>
      )}
      <div
        className="relative animate-pulse overflow-hidden rounded-lg bg-gradient-to-br from-muted/30 to-muted/60"
        style={{ height: `${height}px` }}
      >
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-muted/20 to-transparent" />
        <svg
          className="absolute inset-4"
          preserveAspectRatio="none"
          viewBox="0 0 400 200"
        >
          <path
            className="animate-pulse text-muted/40"
            d="M 0 100 Q 50 80 100 90 T 200 70 T 300 85 T 400 75"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            className="animate-pulse text-muted/20"
            d="M 0 100 Q 50 80 100 90 T 200 70 T 300 85 T 400 75 L 400 200 L 0 200 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </Card>
  );
}

export function PieChartSkeleton({
  height = 300,
  title = true,
  className = '',
}: ChartSkeletonProps) {
  return (
    <Card className={`p-4 ${className}`}>
      {title && (
        <div className="mb-4">
          <div className="h-5 w-1/3 animate-pulse rounded bg-muted" />
        </div>
      )}
      <div
        className="relative flex animate-pulse items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-muted/30 to-muted/60"
        style={{ height: `${height}px` }}
      >
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-muted/20 to-transparent" />
        <div className="h-32 w-32 animate-spin rounded-full border-8 border-muted/40 border-t-muted/60" />
      </div>
    </Card>
  );
}
