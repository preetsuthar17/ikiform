// External libraries
import React from "react";
import { ChevronRight } from "lucide-react";

// UI components
import { Button } from "@/components/ui/button";

// Types
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
    <div className="flex justify-between items-center gap-4">
      {isLastStep ? (
        <Button type="submit" className="w-full sm:w-auto">
          {schema.settings.submitText || "Submit"}
        </Button>
      ) : (
        <Button onClick={onNextStep} className="flex items-center gap-2">
          Continue to Next Step
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
