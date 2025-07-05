"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FormFieldRenderer } from "@/components/form-builder/form-field-renderer";
import { toast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { FormSchema, FormBlock } from "@/lib/database.types";
import { Link } from "react-aria-components";
import { Kbd } from "../ui/kbd";

interface MultiStepFormProps {
  formId: string;
  schema: FormSchema;
}

export function MultiStepForm({ formId, schema }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const blocks: FormBlock[] = schema.blocks?.length
    ? schema.blocks
    : schema.fields?.length
    ? [{ id: "default", title: "Form", description: "", fields: schema.fields }]
    : [];

  const totalSteps = blocks.length;
  const currentBlock = blocks[currentStep];
  const progress =
    totalSteps > 1 ? ((currentStep + 1) / totalSteps) * 100 : 100;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        handleNext();
      } else if (event.key === "ArrowLeft") {
        handlePrevious();
      } else if (event.key === "Enter") {
        if (currentStep === totalSteps - 1) {
          handleSubmit();
        } else {
          handleNext();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep]);

  const handleFieldValueChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors((prev) => ({ ...prev, [fieldId]: "" }));
    }
  };

  const validateStep = (stepIndex: number) => {
    const block = blocks[stepIndex];
    const newErrors: Record<string, string> = {};

    block.fields.forEach((field) => {
      const value = formData[field.id];
      if (
        field.required &&
        (!value || (Array.isArray(value) && value.length === 0))
      ) {
        newErrors[field.id] =
          field.validation?.requiredMessage || "This field is required";
      } else if (
        field.type === "email" &&
        value &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ) {
        newErrors[field.id] =
          field.validation?.emailMessage ||
          "Please enter a valid email address";
      } else if (["text", "textarea", "email"].includes(field.type) && value) {
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
      } else if (field.type === "number" && value) {
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
      } else if (
        field.validation?.pattern &&
        value &&
        !new RegExp(field.validation.pattern).test(value)
      ) {
        newErrors[field.id] =
          field.validation?.patternMessage || "Invalid format";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    } else {
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
      const response = await fetch(`/api/forms/${formId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionData: formData }),
      });

      const result = await response.json();
      if (!response.ok) {
        toast.error(result.message || "Failed to submit form");
        return;
      }

      setSubmitted(true);
      toast.success("Form submitted successfully!");
      if (schema.settings.redirectUrl) {
        setTimeout(
          () => (window.location.href = schema.settings.redirectUrl!),
          2000
        );
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
      <div className="min-h-screen bg-background flex items-center justify-center w-full">
        <div className="max-w-2xl mx-auto flex flex-col gap-4 w-full">
          <Card className="p-8 text-center rounded-card flex flex-col gap-6">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto">
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
            <h2 className="text-2xl font-bold text-foreground">Thank You!</h2>
            <p className="text-muted-foreground">
              {schema.settings.successMessage ||
                "Your form has been submitted successfully."}
            </p>
            {schema.settings.redirectUrl && (
              <p className="text-sm text-muted-foreground/70">
                Redirecting you in a moment...
              </p>
            )}
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center w-full">
      <div className="max-w-2xl mx-auto flex flex-col gap-8 w-full">
        {totalSteps > 1 && schema.settings.showProgress !== false && (
          <div className="flex flex-col gap-2">
            <Progress value={progress} className="h-2" />
          </div>
        )}
        <Card className="p-8 flex flex-col gap-6 rounded-card">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-foreground">
              {currentBlock.title || schema.settings.title}
            </h1>
            {(currentBlock.description || schema.settings.description) && (
              <p className="text-muted-foreground">
                {currentBlock.description || schema.settings.description}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-6">
            {currentBlock.fields.map((field) => (
              <div key={field.id}>
                <FormFieldRenderer
                  field={field}
                  value={formData[field.id]}
                  onChange={(value) => handleFieldValueChange(field.id, value)}
                  error={errors[field.id]}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button
              type="button"
              onClick={handleNext}
              disabled={submitting}
              loading={submitting}
              className="flex items-center gap-2"
            >
              {currentStep === totalSteps - 1 ? (
                submitting ? (
                  "Submitting"
                ) : (
                  schema.settings.submitText || "Submit"
                )
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </Card>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Powered by{" "}
            <span className="font-medium underline text-foreground">
              <Link href="https://ikiform.com">Ikiform</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
