// Libraries

import { ChevronLeft, ChevronRight } from 'lucide-react';
import type React from 'react';
import { getLivePatternError } from '@/components/form-builder/form-field-renderer/components/TextInputField';
// UI Components
import { Button } from '@/components/ui/button';

// Types
import type { FormSchema } from '@/lib/database';

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
      ['text', 'email', 'textarea'].includes(field.type) &&
      getLivePatternError(field, formData[field.id])
  );

  return (
    <div className="flex justify-end gap-4">
      <Button
        className="flex items-center gap-2"
        disabled={currentStep === 0}
        onClick={onPrevious}
        type="button"
        variant="outline"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      <Button
        className="flex items-center gap-2"
        disabled={submitting || hasLivePatternError}
        loading={submitting}
        onClick={onNext}
        type="button"
      >
        {isLastStep ? (
          submitting ? (
            'Submitting'
          ) : (
            schema.settings.submitText || 'Submit'
          )
        ) : (
          <>
            Next
            <ChevronRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
};
