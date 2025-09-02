import dynamic from "next/dynamic";
import { Suspense } from "react";
import { FormBuilderSkeleton } from "@/components/form-builder/form-builder-skeleton";

const DemoFormBuilder = dynamic(
  () => import("@/components/form-builder/form-builder/DemoFormBuilder"),
  {
    loading: () => <FormBuilderSkeleton />,
  }
);

export default function DemoFormBuilderPage() {
  return (
    <div className="flex items-center justify-center bg-background">
      <div className="mx-auto w-full">
        <Suspense fallback={<FormBuilderSkeleton />}>
          <DemoFormBuilder />
        </Suspense>
      </div>
    </div>
  );
}
