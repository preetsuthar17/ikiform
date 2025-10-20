import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { FormActionsProps } from "../types";

export function FormActions({
  schema,
  currentStepIndex,
  fieldsLength,
  isMultiStep,
  onNextStep,
}: FormActionsProps) {
  if (fieldsLength === 0) return null;

  const isLastStep =
    !isMultiStep || currentStepIndex === (schema.blocks?.length || 1) - 1;

  return (
    <div className="flex items-center justify-between gap-4">
      {isLastStep ? (
        <Button className="w-full sm:w-auto" type="submit">
          {schema.settings.submitText || "Submit"}
        </Button>
      ) : (
        <Button className="flex items-center gap-2" onClick={onNextStep}>
          Continue to Next Step
          <ChevronRight className="size-4" />
        </Button>
      )}
    </div>
  );
}
