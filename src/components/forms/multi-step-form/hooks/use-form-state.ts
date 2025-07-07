// Libraries
import { useState, useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";

// Types
import type { FormSchema, FormBlock, FormField } from "@/lib/database";
import type { FormState, FormActions } from "../types";

// Utilities
import { validateStep } from "../utils/validation";
import { submitForm } from "../utils/form-utils";

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
const initializeFormData = (blocks: FormBlock[]): Record<string, any> => {
  const formData: Record<string, any> = {};

  blocks.forEach((block) => {
    block.fields?.forEach((field) => {
      formData[field.id] = getDefaultValueForField(field);
    });
  });

  return formData;
};

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
  const initializedFieldsRef = useRef<Set<string>>(new Set());

  const totalSteps = blocks.length;

  // Initialize form data when blocks change - only when new fields are added
  useEffect(() => {
    const allFieldIds = new Set<string>();
    blocks.forEach((block) => {
      block.fields?.forEach((field) => {
        allFieldIds.add(field.id);
      });
    });

    const newFieldIds = [...allFieldIds].filter(
      (id) => !initializedFieldsRef.current.has(id)
    );

    if (newFieldIds.length > 0) {
      // Preserve existing form data and only initialize new fields
      const newFormData = { ...formData };
      blocks.forEach((block) => {
        block.fields?.forEach((field) => {
          if (newFieldIds.includes(field.id)) {
            newFormData[field.id] = getDefaultValueForField(field);
          }
        });
      });
      setFormData(newFormData);
      newFieldIds.forEach((id) => initializedFieldsRef.current.add(id));
    }
  }, [blocks.length]);

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
