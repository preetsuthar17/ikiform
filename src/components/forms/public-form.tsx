"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormFieldRenderer } from "@/components/form-builder/form-field-renderer";
import { RateLimitInfo } from "./rate-limit-info";
import { toast } from "@/hooks/use-toast";
import { MultiStepForm } from "./multi-step-form";
import type { FormSchema } from "@/lib/database.types";

interface PublicFormProps {
  formId: string;
  schema: FormSchema;
}

export function PublicForm({ formId, schema }: PublicFormProps) {
  // Check if this is a multi-step form
  // Multi-step if explicitly enabled OR if there are multiple blocks
  const isMultiStep = schema.settings.multiStep || schema.blocks?.length > 1;

  if (isMultiStep) {
    return <MultiStepForm formId={formId} schema={schema} />;
  }

  // For backward compatibility and single-step forms, use the original implementation
  return <SingleStepForm formId={formId} schema={schema} />;
}

// Original single-step form implementation
function SingleStepForm({ formId, schema }: PublicFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Get all fields - either from blocks or legacy fields array
  const allFields = schema.blocks?.length
    ? schema.blocks.flatMap((block) => block.fields)
    : schema.fields || [];

  // Get form styling classes
  const getFormClasses = () => {
    const maxWidthClass = {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      full: "max-w-full",
    }[schema.settings.layout?.maxWidth || "lg"];

    const paddingClass = {
      none: "p-0",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    }[schema.settings.layout?.padding || "md"];

    const spacingClass = {
      compact: "space-y-4",
      normal: "space-y-6",
      relaxed: "space-y-8",
    }[schema.settings.layout?.spacing || "normal"];

    const alignmentClass = {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    }[schema.settings.layout?.alignment || "left"];

    return {
      container: `mx-auto ${maxWidthClass} ${paddingClass} ${alignmentClass}`,
      form: spacingClass,
    };
  };

  const formClasses = getFormClasses();

  // Apply theme styles
  const getThemeStyles = () => {
    if (!schema.settings.theme) return {};

    return {
      "--form-primary-color": schema.settings.theme.primaryColor,
      "--form-background-color": schema.settings.theme.backgroundColor,
      "--form-text-color": schema.settings.theme.textColor,
      "--form-border-color": schema.settings.theme.borderColor,
    } as React.CSSProperties;
  };

  const handleFieldValueChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));

    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors((prev) => ({
        ...prev,
        [fieldId]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    allFields.forEach((field) => {
      const value = formData[field.id];

      // Required field validation
      if (field.required) {
        if (
          !value ||
          (Array.isArray(value) && value.length === 0) ||
          value === ""
        ) {
          newErrors[field.id] =
            field.validation?.requiredMessage || `This field is required`;
          return;
        }
      }

      // Skip other validations if field is empty and not required
      if (!value && !field.required) return;

      // Email validation
      if (field.type === "email" && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors[field.id] =
            field.validation?.emailMessage ||
            "Please enter a valid email address";
        }
      }

      // Text length validation
      if (["text", "textarea", "email"].includes(field.type) && value) {
        if (
          field.validation?.minLength &&
          value.length < field.validation.minLength
        ) {
          newErrors[field.id] =
            field.validation?.minLengthMessage ||
            `Must be at least ${field.validation.minLength} characters`;
        }
        if (
          field.validation?.maxLength &&
          value.length > field.validation.maxLength
        ) {
          newErrors[field.id] =
            field.validation?.maxLengthMessage ||
            `Must be no more than ${field.validation.maxLength} characters`;
        }
      }

      // Number validation
      if (field.type === "number" && value) {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
          newErrors[field.id] =
            field.validation?.numberMessage || "Please enter a valid number";
        } else {
          if (
            field.validation?.min !== undefined &&
            numValue < field.validation.min
          ) {
            newErrors[field.id] =
              field.validation?.minMessage ||
              `Must be at least ${field.validation.min}`;
          }
          if (
            field.validation?.max !== undefined &&
            numValue > field.validation.max
          ) {
            newErrors[field.id] =
              field.validation?.maxMessage ||
              `Must be no more than ${field.validation.max}`;
          }
        }
      }

      // Pattern validation
      if (field.validation?.pattern && value) {
        try {
          const regex = new RegExp(field.validation.pattern);
          if (!regex.test(value)) {
            newErrors[field.id] =
              field.validation?.patternMessage || "Invalid format";
          }
        } catch (e) {
          // Invalid regex pattern - skip validation
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setSubmitting(true);

    try {
      // Process form data for submission
      const submissionData = { ...formData };

      // Use the API endpoint instead of direct database call
      const response = await fetch(`/api/forms/${formId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ submissionData }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          // Rate limit exceeded
          toast.error(
            result.message || "Too many submissions. Please try again later."
          );
        } else {
          throw new Error(result.error || "Failed to submit form");
        }
        return;
      }

      setSubmitted(true);
      toast.success("Form submitted successfully!");

      // Redirect if URL is provided
      if (schema.settings.redirectUrl) {
        setTimeout(() => {
          window.location.href = schema.settings.redirectUrl!;
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="p-8 text-center rounded-card">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-accent-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Thank You!
            </h2>
            <p className="text-muted-foreground">
              {schema.settings.successMessage ||
                "Your form has been submitted successfully."}
            </p>
            {schema.settings.redirectUrl && (
              <p className="text-sm text-muted-foreground/70 mt-4">
                Redirecting you in a moment...
              </p>
            )}
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="p-8 space-y-6 rounded-card">
          {/* Form Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {schema.settings.title}
            </h1>
            {schema.settings.description && (
              <p className="text-muted-foreground">
                {schema.settings.description}
              </p>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {allFields.map((field, index) => (
              <div key={field.id}>
                <FormFieldRenderer
                  field={field}
                  value={formData[field.id]}
                  onChange={(value) => handleFieldValueChange(field.id, value)}
                  error={errors[field.id]}
                />
              </div>
            ))}

            <div>
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={submitting}
              >
                {submitting
                  ? "Submitting..."
                  : schema.settings.submitText || "Submit"}
              </Button>
            </div>
          </form>
        </Card>

        {/* Powered by */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Powered by <span className="font-medium">Ikiform</span>
          </p>
        </div>
      </div>
    </div>
  );
}
