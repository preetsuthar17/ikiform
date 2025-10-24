"use client";

import dynamic from "next/dynamic";
import { Suspense, useMemo } from "react";
import { useFormsManagement } from "@/components/dashboard/forms-management/hooks";
import { Skeleton } from "@/components/ui/skeleton";

const ProfileCard = dynamic(
  () => import("@/components/dashboard/profile-card/ProfileCard"),
  {
    loading: () => (
      <div aria-label="Loading profile" className="shadow-none" role="status">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <Skeleton className="size-16 rounded-2xl" />
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
    ),
  }
);

const FormsSidebar = dynamic(
  () =>
    import(
      "@/components/dashboard/forms-management/components/FormsSidebar"
    ).then((mod) => ({
      default: mod.FormsSidebar,
    })),
  {
    loading: () => (
      <div
        aria-label="Loading forms sidebar"
        className="grid grid-cols-3 gap-4"
        role="status"
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton className="h-20 rounded-2xl" key={i} />
        ))}
      </div>
    ),
  }
);

const FormsManagement = dynamic(
  () =>
    import("@/components/dashboard/forms-management").then((mod) => ({
      default: mod.FormsManagement,
    })),
  {
    loading: () => (
      <div
        aria-label="Loading forms management"
        className="flex flex-col gap-6"
        role="status"
      >
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-28" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton className="h-48 rounded-2xl" key={i} />
          ))}
        </div>
      </div>
    ),
  }
);

const ProfileCardSkeleton = () => (
  <div
    aria-label="Loading profile"
    className="rounded-2xl border p-6 shadow-none"
    role="status"
  >
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Skeleton className="size-16 rounded-2xl" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </div>
  </div>
);

const FormsSidebarSkeleton = () => (
  <div
    aria-label="Loading forms sidebar"
    className="grid grid-cols-3 gap-4"
    role="status"
  >
    {Array.from({ length: 3 }).map((_, i) => (
      <Skeleton className="h-20 rounded-2xl" key={i} />
    ))}
  </div>
);

const FormsManagementSkeleton = () => (
  <div
    aria-label="Loading forms management"
    className="relative flex flex-col gap-6 overflow-hidden"
    role="status"
  >
    <div className="flex items-center justify-between">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-10 w-28" />
    </div>
    <div className="flex flex-col gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton className="h-20 rounded-xl" key={i} />
      ))}
    </div>
  </div>
);

export default function DashboardClient() {
  const { forms, loading } = useFormsManagement();

  const sidebarProps = useMemo(() => ({ forms, loading }), [forms, loading]);

  return (
    <main className="mx-auto w-full max-w-7xl">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        <aside className="flex w-full flex-col gap-8 lg:w-80 lg:flex-shrink-0">
          <Suspense fallback={<ProfileCardSkeleton />}>
            <ProfileCard />
          </Suspense>

          <Suspense fallback={<FormsSidebarSkeleton />}>
            <FormsSidebar {...sidebarProps} />
          </Suspense>
        </aside>

        <section className="flex-1">
          <Suspense fallback={<FormsManagementSkeleton />}>
            <FormsManagement />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
