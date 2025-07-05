// Hooks
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

// Types
import type { FormSchema, FormField } from "@/lib/database";
import type { SingleStepFormState, SingleStepFormActions } from "../types";

// Utilities
import {
  validateSingleStepForm,
  submitSingleStepForm,
} from "../utils/form-utils";

export const useSingleStepForm = (
  formId: string,
  schema: FormSchema,
  fields: FormField[],
): SingleStepFormState & SingleStepFormActions => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFieldValueChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors((prev) => ({ ...prev, [fieldId]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { errors: validationErrors, isValid } = validateSingleStepForm(
      fields,
      formData,
    );

    if (!isValid) {
      setErrors(validationErrors);
      toast.error("Please fix the errors in the form");
      return;
    }

    setSubmitting(true);

    try {
      const result = await submitSingleStepForm(formId, formData);

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
    formData,
    errors,
    submitting,
    submitted,
    setFormData,
    setErrors,
    setSubmitting,
    setSubmitted,
    handleFieldValueChange,
    handleSubmit,
  };
};
