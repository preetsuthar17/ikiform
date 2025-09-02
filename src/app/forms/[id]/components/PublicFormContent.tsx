import dynamic from "next/dynamic";
import { Suspense } from "react";
import { CSSPropertiesProvider } from "./CSSPropertiesProvider";
import { FormSkeleton } from "./FormSkeletons";

const MultiStepForm = dynamic(
  () =>
    import("@/components/forms/multi-step-form").then((mod) => ({
      default: mod.MultiStepForm,
    })),
  {
    loading: () => <FormSkeleton showProgress={true} variant="multi-step" />,
  }
);

const SingleStepForm = dynamic(
  () =>
    import("@/components/forms/public-form/components").then((mod) => ({
      default: mod.SingleStepForm,
    })),
  {
    loading: () => <FormSkeleton variant="single-step" />,
  }
);

interface PublicFormContentProps {
  formId: string;
  schema: any;
}

export default function PublicFormContent({
  formId,
  schema,
}: PublicFormContentProps) {
  const isMultiStep = schema.settings?.multiStep || schema.blocks?.length > 1;
  const dir = schema.settings?.rtl ? "rtl" : "ltr";
  const borderRadius = schema?.settings?.layout?.borderRadius || "md";

  return (
    <CSSPropertiesProvider borderRadius={borderRadius}>
      <div className="light">
        <div className="flex flex-col gap-4" dir={dir}>
          <Suspense
            fallback={
              <FormSkeleton
                showProgress={isMultiStep}
                variant={isMultiStep ? "multi-step" : "single-step"}
              />
            }
          >
            {isMultiStep ? (
              <MultiStepForm dir={dir} formId={formId} schema={schema} />
            ) : (
              <SingleStepForm dir={dir} formId={formId} schema={schema} />
            )}
          </Suspense>
        </div>
      </div>
    </CSSPropertiesProvider>
  );
}
