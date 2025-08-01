'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton';

const ProfileCard = dynamic(
  () => import('@/components/dashboard/profile-card/ProfileCard'),
  {
    loading: () => (
      <div className="rounded-card border bg-card p-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 animate-pulse rounded-card bg-accent" />
            <div className="flex flex-col gap-2">
              <div className="h-6 w-48 animate-pulse rounded bg-accent" />
              <div className="h-4 w-32 animate-pulse rounded bg-accent" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-9 w-24 animate-pulse rounded bg-accent" />
            <div className="h-9 w-24 animate-pulse rounded bg-accent" />
          </div>
        </div>
      </div>
    ),
  }
);

const FormsManagement = dynamic(
  () =>
    import('@/components/dashboard/forms-management').then((mod) => ({
      default: mod.FormsManagement,
    })),
  {
    loading: () => (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-32 animate-pulse rounded bg-accent" />
          <div className="h-10 w-28 animate-pulse rounded bg-accent" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              className="h-48 animate-pulse rounded-card border bg-card"
              key={i}
            />
          ))}
        </div>
      </div>
    ),
  }
);

export default function DashboardClient() {
  return (
    <section className="mx-auto w-full max-w-[95%] px-6">
      <div className="flex flex-col gap-8">
        <Suspense
          fallback={
            <div className="rounded-card border bg-card p-6">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 animate-pulse rounded-card bg-accent" />
                  <div className="flex flex-col gap-2">
                    <div className="h-6 w-48 animate-pulse rounded bg-accent" />
                    <div className="h-4 w-32 animate-pulse rounded bg-accent" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-9 w-24 animate-pulse rounded bg-accent" />
                  <div className="h-9 w-24 animate-pulse rounded bg-accent" />
                </div>
              </div>
            </div>
          }
        >
          <ProfileCard />
        </Suspense>

        <Suspense
          fallback={
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="h-8 w-32 animate-pulse rounded bg-accent" />
                <div className="h-10 w-28 animate-pulse rounded bg-accent" />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    className="h-48 animate-pulse rounded-card border bg-card"
                    key={i}
                  />
                ))}
              </div>
            </div>
          }
        >
          <FormsManagement />
        </Suspense>
      </div>
    </section>
  );
}
