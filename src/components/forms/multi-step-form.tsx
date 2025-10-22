"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FormFieldRenderer } from "@/components/form-builder/form-field-renderer";
import { getLivePatternError } from "@/components/form-builder/form-field-renderer/components/TextInputField";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { SocialMediaIcons } from "@/components/ui/social-media-icons";
import { useFormStyling } from "@/hooks/use-form-styling";
import type { FormBlock, FormSchema } from "@/lib/database";
import { cn } from "@/lib/utils";
import { getFormLayoutClasses } from "@/lib/utils/form-layout";
import { getPublicFormTitle } from "@/lib/utils/form-utils";
import { validateEmail } from "@/lib/validation/email-validation";
import { PasswordProtectionModal } from "./PasswordProtectionModal";

// Types
interface MultiStepFormProps {
  formId: string;
  schema: FormSchema;
  dir?: string;
}

interface FormState {
  currentStep: number;
  formData: Record<string, any>;
  errors: Record<string, string>;
  submitting: boolean;
  submitted: boolean;
  duplicateError: {
    message: string;
    timeRemaining?: number;
    attemptsRemaining?: number;
  } | null;
}

// Success Screen
function SuccessScreen({ schema }: { schema: FormSchema }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background py-8">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
        <Card className="p-6 shadow-none">
          <div className="flex flex-col items-center gap-6">
            <div className="flex size-16 items-center justify-center rounded-xl bg-accent">
              <svg
                className="size-8 text-accent-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M5 13l4 4L19 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <h1 className="font-semibold text-3xl text-foreground tracking-tight">
              Thank You!
            </h1>
            <p className="text-center text-base text-muted-foreground">
              {schema.settings.successMessage ||
                "Your form has been submitted successfully."}
            </p>
            {schema.settings.redirectUrl && (
              <p className="pt-1 text-muted-foreground/70 text-sm italic">
                Redirecting you in a moment…
              </p>
            )}
          </div>
        </Card>
        {Boolean(
          schema.settings.branding &&
            (schema.settings.branding as any).showIkiformBranding !== false
        ) && (
          <p className="text-center text-muted-foreground text-sm">
            Powered by{" "}
            <span className="font-medium text-foreground underline">
              Ikiform
            </span>
          </p>
        )}
      </div>
    </main>
  );
}

// Form Progress with enhanced design
function FormProgress({
  progress,
  totalSteps,
  showProgress,
  currentStep,
}: {
  progress: number;
  totalSteps: number;
  showProgress: boolean;
  currentStep: number;
}) {
  if (totalSteps <= 1 || !showProgress) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Badge className="text-xs" variant="secondary">
          {Math.round(progress)}%
        </Badge>
      </div>
      <Progress className="h-2 w-full" value={progress} />
    </div>
  );
}

// Form Content with enhanced accessibility
function FormContent({
  formId,
  currentBlock,
  formData,
  errors,
  onFieldValueChange,
  title,
  description,
  schema,
  fieldVisibility,
  logicMessages,
  customStyles,
}: {
  formId: string;
  currentBlock: FormBlock;
  formData: Record<string, any>;
  errors: Record<string, string>;
  onFieldValueChange: (fieldId: string, value: any) => void;
  title?: string;
  description?: string;
  schema: FormSchema;
  fieldVisibility?: Record<string, { visible: boolean; disabled: boolean }>;
  logicMessages?: string[];
  customStyles?: any;
}) {
  const firstFieldRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (
      firstFieldRef.current &&
      schema.settings.behavior?.autoFocusFirstField
    ) {
      firstFieldRef.current.focus();
    }
  }, [currentBlock, schema.settings.behavior?.autoFocusFirstField]);

  const visibleFields = fieldVisibility
    ? currentBlock.fields.filter(
        (field) => fieldVisibility[field.id]?.visible !== false
      )
    : currentBlock.fields;

  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        {!schema.settings.hideHeader && (
          <>
            <div className="flex flex-col gap-2">
              <h1
                className="font-bold text-2xl text-foreground"
                style={customStyles?.headingStyle}
              >
                {currentBlock.title || getPublicFormTitle(schema)}
              </h1>
              {(currentBlock.description || description) && (
                <p
                  className="text-muted-foreground"
                  style={customStyles?.textStyle}
                >
                  {currentBlock.description || description}
                </p>
              )}
            </div>
            <Separator />
          </>
        )}

        {/* Social Media Icons */}
        {schema.settings.branding?.socialMedia?.enabled &&
          schema.settings.branding.socialMedia.platforms &&
          (schema.settings.branding.socialMedia.position === "header" ||
            schema.settings.branding.socialMedia.position === "both") && (
            <SocialMediaIcons
              className="justify-start"
              iconSize={schema.settings.branding.socialMedia.iconSize || "md"}
              platforms={schema.settings.branding.socialMedia.platforms}
            />
          )}
      </div>

      {/* Form Fields */}
      <div className="flex flex-col gap-6">
        {visibleFields.map((field, idx) => (
          <div
            className={cn(
              "transition-opacity duration-200",
              fieldVisibility?.[field.id]?.disabled && "opacity-50"
            )}
            key={field.id}
          >
            <FormFieldRenderer
              disabled={fieldVisibility?.[field.id]?.disabled}
              error={errors[field.id]}
              field={field}
              fieldRef={idx === 0 ? firstFieldRef : undefined}
              formId={formId}
              onChange={(value) => onFieldValueChange(field.id, value)}
              value={formData[field.id]}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Enhanced Form Navigation
function FormNavigation({
  currentStep,
  totalSteps,
  submitting,
  onNext,
  onPrevious,
  schema,
  currentFields,
  formData,
  errors,
}: {
  currentStep: number;
  totalSteps: number;
  submitting: boolean;
  onNext: () => void;
  onPrevious: () => void;
  schema: FormSchema;
  currentFields: any[];
  formData: Record<string, any>;
  errors: Record<string, string>;
}) {
  const isLastStep = currentStep === totalSteps - 1;
  const { getButtonStyles } = useFormStyling(schema);

  const hasLivePatternError = currentFields.some(
    (field) =>
      ["text", "email", "textarea"].includes(field.type) &&
      getLivePatternError(field, formData[field.id])
  );

  const hasValidationErrors = Object.keys(errors).length > 0;
  const isNextDisabled =
    submitting || hasLivePatternError || hasValidationErrors;

  return (
    <div className="flex flex-col gap-4">
      {/* Navigation Buttons */}
      <div className="flex flex-wrap justify-between gap-4">
        <Button
          className="flex items-center gap-2"
          disabled={currentStep === 0}
          onClick={onPrevious}
          type="button"
          variant="outline"
        >
          <svg
            className="size-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M15 19l-7-7 7-7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
          Previous
        </Button>

        <Button
          className="flex items-center gap-2"
          disabled={isNextDisabled}
          loading={submitting}
          onClick={onNext}
          style={getButtonStyles(true)}
          type="button"
        >
          {isLastStep ? (
            schema.settings.submitText || "Submit"
          ) : (
            <>
              Next
              <svg
                className="size-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 5l7 7-7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// Form Footer
function FormFooter({ schema }: { schema: FormSchema }) {
  return (
    <div className="flex flex-col gap-4 text-center">
      {schema.settings.branding?.socialMedia?.enabled &&
        schema.settings.branding.socialMedia.platforms &&
        (schema.settings.branding.socialMedia.position === "footer" ||
          schema.settings.branding.socialMedia.position === "both") && (
          <SocialMediaIcons
            className="justify-center"
            iconSize={schema.settings.branding.socialMedia.iconSize || "md"}
            platforms={schema.settings.branding.socialMedia.platforms}
          />
        )}
      {Boolean(
        schema.settings.branding &&
          (schema.settings.branding as any).showIkiformBranding !== false
      ) && (
        <p className="text-muted-foreground text-sm">
          Powered by{" "}
          <span className="font-medium text-foreground underline">Ikiform</span>
        </p>
      )}
    </div>
  );
}

function MultiStepFormLoading() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-[200px] px-6 py-8">
      <Progress className="h-2 w-full" value={progress} />
    </div>
  );
}

// Main MultiStepForm Component with optimizations
export function MultiStepForm({ formId, schema, dir }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Memoized form blocks processing
  const blocks = useMemo(
    () =>
      schema.blocks?.length
        ? schema.blocks
        : schema.fields?.length
          ? [
              {
                id: "default",
                title: "Form",
                description: "",
                fields: schema.fields,
              },
            ]
          : [],
    [schema.blocks, schema.fields]
  );

  const totalSteps = blocks.length;
  const currentBlock = blocks[currentStep];
  const progress =
    totalSteps > 1 ? ((currentStep + 1) / totalSteps) * 100 : 100;

  const { containerClass, marginClass } = getFormLayoutClasses(schema);
  const { customStyles, getFormClasses } = useFormStyling(schema);

  // Password protection setup
  useEffect(() => {
    const passwordProtection = schema.settings.passwordProtection;
    if (passwordProtection?.enabled && passwordProtection?.password) {
      setIsPasswordProtected(true);
      setShowPasswordModal(true);
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowForm(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [schema.settings.passwordProtection]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (submitting) return;

      if (
        event.key === "ArrowRight" ||
        (event.key === "Enter" && !event.shiftKey)
      ) {
        event.preventDefault();
        handleNext();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        handlePrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep, totalSteps, submitting, formData]);

  // Memoized validation function
  const validateCurrentStep = useCallback(() => {
    const currentBlock = blocks[currentStep];
    const stepErrors: Record<string, string> = {};

    currentBlock.fields.forEach((field) => {
      const value = formData[field.id];

      // Check required fields
      if (field.required) {
        let isEmpty = false;

        if (Array.isArray(value)) {
          isEmpty = value.length === 0;
        } else if (field.type === "radio" || field.settings?.isQuizField) {
          isEmpty = !value || value === "";
        } else if (field.type === "rating" || field.type === "slider") {
          isEmpty = value === null || value === undefined;
        } else if (field.type === "checkbox") {
          isEmpty = !Array.isArray(value) || value.length === 0;
        } else if (field.type === "select") {
          isEmpty = !value || value === "";
        } else if (typeof value === "string") {
          isEmpty = value.trim() === "";
        } else {
          isEmpty =
            !value || value === "" || value === null || value === undefined;
        }

        if (isEmpty) {
          stepErrors[field.id] =
            field.validation?.requiredMessage || "This field is required";
        }
      }

      // Email validation
      if (value && field.type === "email") {
        const emailValidation = validateEmail(
          value,
          field.settings?.emailValidation
        );
        if (!emailValidation.isValid) {
          stepErrors[field.id] =
            emailValidation.message || "Please enter a valid email address";
        }
      }

      // Text length validation
      if (["text", "textarea", "email"].includes(field.type) && value) {
        if (
          field.validation?.minLength &&
          value.length < field.validation.minLength
        ) {
          stepErrors[field.id] =
            field.validation?.minLengthMessage ||
            `Must be at least ${field.validation.minLength} characters`;
        }
        if (
          field.validation?.maxLength &&
          value.length > field.validation.maxLength
        ) {
          stepErrors[field.id] =
            field.validation?.maxLengthMessage ||
            `Must be no more than ${field.validation.maxLength} characters`;
        }
      }
    });

    return {
      errors: stepErrors,
      isValid: Object.keys(stepErrors).length === 0,
    };
  }, [blocks, currentStep, formData]);

  // Event handlers
  const handlePasswordSubmit = (password: string) => {
    const expectedPassword = schema.settings.passwordProtection?.password;
    if (password === expectedPassword) {
      setPasswordVerified(true);
      setShowPasswordModal(false);
    } else {
      toast.error("Incorrect password!");
    }
  };

  const handlePasswordCancel = () => {
    window.location.href = "/";
  };

  const handleFieldValueChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors((prev) => ({ ...prev, [fieldId]: "" }));
    }
  };

  const handleNext = () => {
    // Validate current step before proceeding
    const { errors: validationErrors, isValid } = validateCurrentStep();

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    // Clear any existing errors for this step
    setErrors({});

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
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

      if (response.ok) {
        setSubmitted(true);
        toast.success("Form submitted successfully!");
        if (schema.settings.redirectUrl) {
          setTimeout(() => {
            window.location.href = schema.settings.redirectUrl!;
          }, 2000);
        }
      } else {
        toast.error("Failed to submit form");
      }
    } catch (error) {
      toast.error("Failed to submit form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Render states
  if (submitted) {
    return <SuccessScreen schema={schema} />;
  }

  if (isPasswordProtected && !passwordVerified) {
    return (
      <PasswordProtectionModal
        isOpen={showPasswordModal}
        message={
          schema.settings.passwordProtection?.message ||
          "This form is password protected. Please enter the password to continue."
        }
        onCancel={handlePasswordCancel}
        onPasswordSubmit={handlePasswordSubmit}
      />
    );
  }

  if (isLoading) {
    return <MultiStepFormLoading />;
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center transition-opacity duration-500",
        showForm ? "opacity-100" : "opacity-0",
        marginClass,
        getFormClasses()
      )}
      dir={dir}
      style={customStyles.containerStyle}
    >
      <div className={cn("flex w-full flex-col gap-8", containerClass)}>
        <Card
          className="flex w-full grow flex-col gap-6 p-8 shadow-none"
          style={customStyles.cardStyle}
        >
          <FormProgress
            currentStep={currentStep}
            progress={progress}
            showProgress={schema.settings.showProgress !== false}
            totalSteps={totalSteps}
          />
          <div style={customStyles.formStyle}>
            <FormContent
              currentBlock={currentBlock}
              customStyles={customStyles}
              description={schema.settings.description}
              errors={errors}
              fieldVisibility={{}}
              formData={formData}
              formId={formId}
              logicMessages={[]}
              onFieldValueChange={handleFieldValueChange}
              schema={schema}
              title={schema.settings.title}
            />
          </div>
          <FormNavigation
            currentFields={currentBlock.fields}
            currentStep={currentStep}
            errors={errors}
            formData={formData}
            onNext={handleNext}
            onPrevious={handlePrevious}
            schema={schema}
            submitting={submitting}
            totalSteps={totalSteps}
          />
        </Card>

        <FormFooter schema={schema} />
      </div>
    </div>
  );
}
