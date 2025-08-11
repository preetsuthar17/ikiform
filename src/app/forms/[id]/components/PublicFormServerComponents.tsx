import { Suspense } from "react";
import { SkeletonCard } from "@/components/ui/skeleton";

export function PublicFormServerLayout({
  children,
  dir = "ltr",
  theme,
}: {
  children: React.ReactNode;
  dir?: string;
  theme?: string;
}) {
  return (
    <div
      className={`flex flex-col gap-4${theme ? `theme-${theme}` : ""}`}
      dir={dir}
    >
      <Suspense
        fallback={
          <div className="mx-auto max-w-2xl space-y-6 p-4">
            <SkeletonCard
              className="min-h-[400px]"
              showFooter={true}
              showHeader={true}
              showImage={false}
            />
          </div>
        }
      >
        {children}
      </Suspense>
    </div>
  );
}

export function PublicFormMetadata({ schema }: { schema: any }) {
  const isMultiStep = schema.settings?.multiStep || schema.blocks?.length > 1;
  const dir = schema.settings?.rtl ? "rtl" : "ltr";
  const borderRadius = schema?.settings?.layout?.borderRadius || "md";

  return {
    isMultiStep,
    dir,
    borderRadius,
  };
}
