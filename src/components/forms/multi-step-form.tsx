"use client";

import React, { useState, useEffect } from "react";

// UI Components
import { Card } from "@/components/ui/card";

// Types
import type { MultiStepFormProps } from "./multi-step-form/types";

// Hooks
import { useFormNavigation, useFormState } from "./multi-step-form/hooks";

// Utilities
import { processFormBlocks, calculateProgress } from "./multi-step-form/utils";

// Form Components
import {
  SuccessScreen,
  FormProgress,
  FormContent,
  FormNavigation,
  FormFooter,
} from "./multi-step-form/components";

// Password Protection
import { PasswordProtectionModal } from "@/components/forms/public-form/components/PasswordProtectionModal";
import toast from "react-hot-toast";

export function MultiStepForm({
  formId,
  schema,
  dir,
}: MultiStepFormProps & { dir?: string }) {
  const blocks = processFormBlocks(schema);
  const totalSteps = blocks.length;

  const formState = useFormState(formId, schema, blocks);
  const { currentStep, formData, errors, submitting, submitted } = formState;
  const { handleNext, handlePrevious, handleSubmit, handleFieldValueChange } =
    formState;

  const currentBlock = blocks[currentStep];
  const progress = calculateProgress(currentStep, totalSteps);

  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const passwordProtection = schema.settings.passwordProtection;
    if (passwordProtection?.enabled && passwordProtection?.password) {
      setIsPasswordProtected(true);
      setShowPasswordModal(true);
    }

    // Show loading progress for 2 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowForm(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [schema.settings.passwordProtection]);

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
    // Redirect to home page or show a message
    window.location.href = "/";
  };

  useFormNavigation({
    currentStep,
    totalSteps,
    onNext: handleNext,
    onPrevious: handlePrevious,
    onSubmit: handleSubmit,
  });

  if (submitted) {
    return <SuccessScreen schema={schema} />;
  }

  // Show password modal if form is password protected and password hasn't been verified
  if (isPasswordProtected && !passwordVerified) {
    return (
      <PasswordProtectionModal
        isOpen={showPasswordModal}
        message={
          schema.settings.passwordProtection?.message ||
          "This form is password protected. Please enter the password to continue."
        }
        onPasswordSubmit={handlePasswordSubmit}
        onCancel={handlePasswordCancel}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center w-full">
        <div className="max-w-md mx-auto flex flex-col gap-6 w-full px-4">
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-2000 ease-out"
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      dir={dir}
      className={`py-12 bg-background flex items-center justify-center w-full transition-opacity duration-500 ${
        showForm ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className="max-w-2xl mx-auto flex flex-col gap-8 w-full"
        id="embeddable-form"
      >
        <Card
          className={`rounded-card flex flex-col gap-6 p-8 ${schema.settings.designMode === "minimal" ? "bg-transparent border-none shadow-none hover:bg-transparent" : ""}`}
          variant={
            schema.settings.designMode === "minimal" ? "ghost" : "default"
          }
        >
          <FormProgress
            progress={progress}
            totalSteps={totalSteps}
            showProgress={schema.settings.showProgress !== false}
          />
          <FormContent
            currentBlock={currentBlock}
            formData={formData}
            errors={errors}
            onFieldValueChange={handleFieldValueChange}
            title={schema.settings.title}
            description={schema.settings.description}
            schema={schema}
          />
          <FormNavigation
            currentStep={currentStep}
            totalSteps={totalSteps}
            submitting={submitting}
            onNext={handleNext}
            onPrevious={handlePrevious}
            schema={schema}
          />
        </Card>

        <FormFooter schema={schema} />
      </div>
    </div>
  );
}
