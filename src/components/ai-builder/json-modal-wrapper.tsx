import { lazy, Suspense } from "react";
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
    <Suspense fallback={null}>
      <JsonModalLazy
        activeForm={activeForm}
        isOpen={isOpen}
        onClose={onClose}
      />
    </Suspense>
  );
}
