import dynamic from "next/dynamic";
import { Suspense } from "react";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";

const DashboardClient = dynamic(
  () => import("@/components/dashboard/dashboard-client"),
  {
    loading: () => <DashboardSkeleton />,
  }
);

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardClient />
    </Suspense>
  );
}
