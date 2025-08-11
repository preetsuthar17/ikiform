import dynamic from "next/dynamic";
import { Suspense } from "react";
import { FormBuilderSkeleton } from "@/components/form-builder/form-builder-skeleton";

const FormBuilderClient = dynamic(
  () => import("@/components/form-builder/form-builder-client"),
  {
    ssr: true,
    loading: () => <FormBuilderSkeleton />,
  },
);

export default function NewFormBuilderPage() {
  return (
    <Suspense fallback={<FormBuilderSkeleton />}>
      <FormBuilderClient />
    </Suspense>
  );
}
