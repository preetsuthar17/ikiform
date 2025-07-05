// React hooks
import { useState, useEffect } from "react";

// Types
import type { FormSchema } from "@/lib/database";

export function useFormPreviewState(
  schema: FormSchema,
  selectedBlockId?: string | null,
) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const isMultiStep = schema.blocks?.length > 1;
  const allFields =
    schema.blocks?.flatMap((block) => block.fields) || schema.fields || [];
  const currentStep = isMultiStep ? schema.blocks?.[currentStepIndex] : null;
  const currentStepFields = isMultiStep ? currentStep?.fields || [] : allFields;

  useEffect(() => {
    if (selectedBlockId && schema.blocks) {
      const blockIndex = schema.blocks.findIndex(
        (block) => block.id === selectedBlockId,
      );
      if (blockIndex !== -1) {
        setCurrentStepIndex(blockIndex);
      }
    }
  }, [selectedBlockId, schema.blocks]);

  const handleFieldValueChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const nextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < (schema.blocks?.length || 1)) {
      setCurrentStepIndex(nextIndex);
      return nextIndex;
    }
    return currentStepIndex;
  };

  const prevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStepIndex(prevIndex);
      return prevIndex;
    }
    return currentStepIndex;
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < (schema.blocks?.length || 1)) {
      setCurrentStepIndex(stepIndex);
    }
  };

  return {
    formData,
    currentStepIndex,
    isMultiStep,
    allFields,
    currentStep,
    currentStepFields,
    handleFieldValueChange,
    nextStep,
    prevStep,
    goToStep,
  };
}
