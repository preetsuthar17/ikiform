import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { FormSchema } from "@/lib/ai-builder/types";

const JsonModalLazy = lazy(() =>
  import("./json-modal").then((module) => ({ default: module.JsonModal }))
);

interface JsonModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  activeForm: FormSchema | undefined;
}

/**
 * Optimized JsonModal wrapper with lazy loading
 * Only loads the modal when it's actually needed
 */
export function JsonModalWrapper({
  isOpen,
  onClose,
  activeForm,
}: JsonModalWrapperProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="max-h-[90vh] w-full max-w-4xl p-6">
            <div className="flex flex-col gap-4 rounded-card bg-background p-6">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-64 w-full" />
              <div className="flex justify-end gap-2">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-20" />
              </div>
            </div>
          </div>
        </div>
      }
    >
      <JsonModalLazy
        activeForm={activeForm}
        isOpen={isOpen}
        onClose={onClose}
      />
    </Suspense>
  );
}
