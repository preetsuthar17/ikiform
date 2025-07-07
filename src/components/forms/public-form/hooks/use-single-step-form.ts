// Hooks
import { useState, useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";

// Types
import type { FormSchema, FormField } from "@/lib/database";
import type { SingleStepFormState, SingleStepFormActions } from "../types";

// Utilities
import {
  validateSingleStepForm,
  submitSingleStepForm,
} from "../utils/form-utils";

// Utility function to get default value for a field type
const getDefaultValueForField = (field: FormField): any => {
  switch (field.type) {
    case "tags":
      return [];
    case "checkbox":
      return [];
    case "radio":
      return "";
    case "select":
      return "";
    case "slider":
      return field.settings?.defaultValue || 50;
    case "number":
      return "";
    case "text":
    case "email":
    case "textarea":
    default:
      return "";
  }
};

// Utility function to initialize form data with proper defaults
const initializeFormData = (fields: FormField[]): Record<string, any> => {
  const formData: Record<string, any> = {};

  fields.forEach((field) => {
    formData[field.id] = getDefaultValueForField(field);
  });

  return formData;
};

export const useSingleStepForm = (
  formId: string,
  schema: FormSchema,
  fields: FormField[]
): SingleStepFormState & SingleStepFormActions => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const initializedFieldsRef = useRef<Set<string>>(new Set());

  // Initialize form data when fields change - only when new fields are added
  useEffect(() => {
    const currentFieldIds = new Set(fields.map((field) => field.id));
    const newFieldIds = [...currentFieldIds].filter(
      (id) => !initializedFieldsRef.current.has(id)
    );

    if (newFieldIds.length > 0) {
      // Preserve existing form data and only initialize new fields
      const newFormData = { ...formData };
      fields.forEach((field) => {
        if (newFieldIds.includes(field.id)) {
          newFormData[field.id] = getDefaultValueForField(field);
        }
      });
      setFormData(newFormData);
      newFieldIds.forEach((id) => initializedFieldsRef.current.add(id));
    }
  }, [fields.length]);

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
      formData
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
