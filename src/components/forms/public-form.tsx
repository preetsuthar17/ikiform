"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormFieldRenderer } from "@/components/form-builder/form-field-renderer";
import { formsDb } from "@/lib/database";
import { toast } from "@/hooks/use-toast";
import type { FormField, FormSchema } from "@/lib/database.types";

interface PublicFormProps {
  formId: string;
  schema: FormSchema;
}

export function PublicForm({ formId, schema }: PublicFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

    schema.fields.forEach((field) => {
      const value = formData[field.id];

      // Required field validation
      if (field.required) {
        if (
          !value ||
          (Array.isArray(value) && value.length === 0) ||
          value === ""
        ) {
          newErrors[field.id] = `${field.label} is required`;
          return;
        }
      }

      // Skip other validations if field is empty and not required
      if (!value && !field.required) return;

      // Email validation
      if (field.type === "email" && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors[field.id] = "Please enter a valid email address";
        }
      }

      // Text length validation
      if (["text", "textarea", "email"].includes(field.type) && value) {
        if (
          field.validation?.minLength &&
          value.length < field.validation.minLength
        ) {
          newErrors[
            field.id
          ] = `Must be at least ${field.validation.minLength} characters`;
        }
        if (
          field.validation?.maxLength &&
          value.length > field.validation.maxLength
        ) {
          newErrors[
            field.id
          ] = `Must be no more than ${field.validation.maxLength} characters`;
        }
      }

      // Number validation
      if (field.type === "number" && value) {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
          newErrors[field.id] = "Please enter a valid number";
        } else {
          if (
            field.validation?.min !== undefined &&
            numValue < field.validation.min
          ) {
            newErrors[field.id] = `Must be at least ${field.validation.min}`;
          }
          if (
            field.validation?.max !== undefined &&
            numValue > field.validation.max
          ) {
            newErrors[
              field.id
            ] = `Must be no more than ${field.validation.max}`;
          }
        }
      }

      // Pattern validation
      if (field.validation?.pattern && value) {
        try {
          const regex = new RegExp(field.validation.pattern);
          if (!regex.test(value)) {
            newErrors[field.id] = "Invalid format";
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

      await formsDb.submitForm(formId, submissionData);

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
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Thank You!
            </h2>
            <p className="text-gray-600">
              {schema.settings.successMessage ||
                "Your form has been submitted successfully."}
            </p>
            {schema.settings.redirectUrl && (
              <p className="text-sm text-gray-500 mt-4">
                Redirecting you in a moment...
              </p>
            )}
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="p-8">
          {/* Form Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {schema.settings.title}
            </h1>
            {schema.settings.description && (
              <p className="text-gray-600">{schema.settings.description}</p>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {schema.fields.map((field, index) => (
              <div key={field.id}>
                <FormFieldRenderer
                  field={field}
                  value={formData[field.id]}
                  onChange={(value) => handleFieldValueChange(field.id, value)}
                  error={errors[field.id]}
                />
              </div>
            ))}

            <div className="pt-6">
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
          <p className="text-sm text-gray-500">
            Powered by <span className="font-medium">Forms0</span>
          </p>
        </div>
      </div>
    </div>
  );
}
