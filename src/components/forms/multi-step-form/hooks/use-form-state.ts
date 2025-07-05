// Libraries
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

// Types
import type { FormSchema, FormBlock } from "@/lib/database.types";
import type { FormState, FormActions } from "../types";

// Utilities
import { validateStep } from "../utils/validation";
import { submitForm } from "../utils/form-utils";

export const useFormState = (
  formId: string,
  schema: FormSchema,
  blocks: FormBlock[]
): FormState & FormActions => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const totalSteps = blocks.length;

  const handleFieldValueChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors((prev) => ({ ...prev, [fieldId]: "" }));
    }
  };

  const handleNext = () => {
    const { errors: validationErrors, isValid } = validateStep(
      currentStep,
      blocks,
      formData
    );

    if (isValid) {
      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    } else {
      setErrors(validationErrors);
      toast.error("Please fix the errors in this step");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      const result = await submitForm(formId, formData);

      if (result.success) {
        setSubmitted(true);
        toast.success("Form submitted successfully!");

        if (schema.settings.redirectUrl) {
          setTimeout(() => {
            window.location.href = schema.settings.redirectUrl!;
          }, 2000);
        }
      } else {
        toast.error(result.message || "Failed to submit form");
      }
    } catch {
      toast.error("Failed to submit form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    currentStep,
    formData,
    errors,
    submitting,
    submitted,
    setCurrentStep,
    setFormData,
    setErrors,
    setSubmitting,
    setSubmitted,
    handleFieldValueChange,
    handleNext,
    handlePrevious,
    handleSubmit,
  };
};
