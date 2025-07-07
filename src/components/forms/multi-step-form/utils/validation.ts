// Types
import type { FormBlock } from "@/lib/database";

// Utility imports
import { validateEmail } from "@/lib/validation/email-validation";

export const validateStep = (
  stepIndex: number,
  blocks: FormBlock[],
  formData: Record<string, any>
): { errors: Record<string, string>; isValid: boolean } => {
  const block = blocks[stepIndex];
  const errors: Record<string, string> = {};

  block.fields.forEach((field) => {
    const value = formData[field.id];

    if (
      field.required &&
      (!value || (Array.isArray(value) && value.length === 0))
    ) {
      errors[field.id] =
        field.validation?.requiredMessage || "This field is required";
    } else if (field.type === "email" && value) {
      const emailValidation = validateEmail(
        value,
        field.settings?.emailValidation
      );
      if (!emailValidation.isValid) {
        errors[field.id] =
          emailValidation.message ||
          field.validation?.emailMessage ||
          "Please enter a valid email address";
      }
    } else if (["text", "textarea", "email"].includes(field.type) && value) {
      if (
        field.validation?.minLength &&
        value.length < field.validation.minLength
      ) {
        errors[field.id] =
          field.validation?.minLengthMessage ||
          `Must be at least ${field.validation.minLength} characters`;
      }
      if (
        field.validation?.maxLength &&
        value.length > field.validation.maxLength
      ) {
        errors[field.id] =
          field.validation?.maxLengthMessage ||
          `Must be no more than ${field.validation.maxLength} characters`;
      }
    } else if (field.type === "number" && value) {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        errors[field.id] =
          field.validation?.numberMessage || "Please enter a valid number";
      } else {
        if (
          field.validation?.min !== undefined &&
          numValue < field.validation.min
        ) {
          errors[field.id] =
            field.validation?.minMessage ||
            `Must be at least ${field.validation.min}`;
        }
        if (
          field.validation?.max !== undefined &&
          numValue > field.validation.max
        ) {
          errors[field.id] =
            field.validation?.maxMessage ||
            `Must be no more than ${field.validation.max}`;
        }
      }
    } else if (
      field.validation?.pattern &&
      value &&
      !new RegExp(field.validation.pattern).test(value)
    ) {
      errors[field.id] = field.validation?.patternMessage || "Invalid format";
    }
  });

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};
