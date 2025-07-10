// Libraries
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { getLivePatternError } from "@/components/form-builder/form-field-renderer/components/TextInputField";

// Types
import type { FormSchema } from "@/lib/database";

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  submitting: boolean;
  onNext: () => void;
  onPrevious: () => void;
  schema: FormSchema;
  currentFields: any[];
  formData: Record<string, any>;
}

export const FormNavigation: React.FC<FormNavigationProps> = ({
  currentStep,
  totalSteps,
  submitting,
  onNext,
  onPrevious,
  schema,
  currentFields,
  formData,
}) => {
  const isLastStep = currentStep === totalSteps - 1;

  const hasLivePatternError = currentFields.some(
    (field) =>
      ["text", "email", "textarea"].includes(field.type) &&
      getLivePatternError(field, formData[field.id]),
  );

  return (
    <div className="flex justify-end gap-4">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 0}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </Button>

      <Button
        type="button"
        onClick={onNext}
        disabled={submitting || hasLivePatternError}
        loading={submitting}
        className="flex items-center gap-2"
      >
        {isLastStep ? (
          submitting ? (
            "Submitting"
          ) : (
            schema.settings.submitText || "Submit"
          )
        ) : (
          <>
            Next
            <ChevronRight className="w-4 h-4" />
          </>
        )}
      </Button>
    </div>
  );
};
