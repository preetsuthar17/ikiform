import type { FormBlock } from '@/lib/database';

import { validateEmail } from '@/lib/validation/email-validation';

export const validateStep = (
  stepIndex: number,
  blocks: FormBlock[],
  formData: Record<string, any>
): { errors: Record<string, string>; isValid: boolean } => {
  const block = blocks[stepIndex];
  const errors: Record<string, string> = {};

  block.fields.forEach((field) => {
    const value = formData[field.id];

    if (field.required) {
      let isEmpty = false;

      if (Array.isArray(value)) {
        isEmpty = value.length === 0;
      } else if (field.type === 'radio' || field.settings?.isQuizField) {
        isEmpty = !value || value === '';
      } else {
        isEmpty = !value || (typeof value === 'string' && value.trim() === '');
      }

      if (isEmpty) {
        errors[field.id] =
          field.validation?.requiredMessage || 'This field is required';
      }
    }

    if (value && field.type === 'email') {
      const emailValidation = validateEmail(
        value,
        field.settings?.emailValidation
      );
      if (!emailValidation.isValid) {
        errors[field.id] =
          emailValidation.message ||
          field.validation?.emailMessage ||
          'Please enter a valid email address';
      }
    } else if (['text', 'textarea', 'email'].includes(field.type) && value) {
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
    } else if (field.type === 'number' && value) {
      const numValue = Number.parseFloat(value);
      if (isNaN(numValue)) {
        errors[field.id] =
          field.validation?.numberMessage || 'Please enter a valid number';
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
    } else if (field.type === 'phone' && value) {
      const phoneValidation =
        require('@/lib/validation/phone-validation').validatePhoneNumber(value);
      if (!phoneValidation.isValid) {
        errors[field.id] =
          phoneValidation.message || 'Please enter a valid phone number';
      }
    } else if (field.type === 'link' && value) {
      const urlValidation =
        require('@/lib/validation/url-validation').validateUrl(value);
      if (!urlValidation.isValid) {
        errors[field.id] = urlValidation.message || 'Please enter a valid URL';
      }
    } else if (field.type === 'address' && value) {
      const requiredKeys = ['line1', 'city', 'state', 'zip', 'country'];
      for (const key of requiredKeys) {
        if (!value[key]) {
          errors[field.id] =
            `Please enter ${key.replace(/\b\w/g, (c) => c.toUpperCase())}`;
          break;
        }
      }
    } else if (
      field.validation?.pattern &&
      value &&
      !new RegExp(field.validation.pattern).test(value)
    ) {
      errors[field.id] = field.validation?.patternMessage || 'Invalid format';
    }
  });

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};
