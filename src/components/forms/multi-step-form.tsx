"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getLivePatternError } from "@/components/form-builder/form-field-renderer/components/TextInputField";

import { PasswordProtectionModal } from "@/components/forms/public-form/components/PasswordProtectionModal";

import { Card } from "@/components/ui/card";
import { useFormStyling } from "@/hooks/use-form-styling";
import { getFormLayoutClasses } from "@/lib/utils/form-layout";
import { Progress } from "../ui/progress";

import {
  FormContent,
  FormFooter,
  FormNavigation,
  FormProgress,
  SuccessScreen,
} from "./multi-step-form/components";

import { useFormNavigation, useFormState } from "./multi-step-form/hooks";

import type { MultiStepFormProps } from "./multi-step-form/types";

import { calculateProgress, processFormBlocks } from "./multi-step-form/utils";

export function MultiStepForm({
  formId,
  schema,
  dir,
}: MultiStepFormProps & { dir?: string }) {
  const blocks = processFormBlocks(schema);
  const totalSteps = blocks.length;

  const formState = useFormState(formId, schema, blocks);
  const {
    currentStep,
    formData,
    errors,
    submitting,
    submitted,
    fieldVisibility,
    logicMessages,
  } = formState;
  const { handleNext, handlePrevious, handleSubmit, handleFieldValueChange } =
    formState;

  const currentBlock = blocks[currentStep];
  const progress = calculateProgress(currentStep, totalSteps);

  const hasLivePatternError = currentBlock.fields.some(
    (field) =>
      ["text", "email", "textarea"].includes(field.type) &&
      getLivePatternError(field, formData[field.id])
  );
  const isStepDisabled = submitting || hasLivePatternError;

  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const { containerClass, marginClass } = getFormLayoutClasses(schema);
  const { customStyles, fontLoaded, getFormClasses } = useFormStyling(schema);

  // Check if custom width is used
  const isCustomWidth =
    (schema.settings?.layout as any)?.maxWidth === "custom" &&
    (schema.settings?.layout as any)?.customWidth;

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

  useFormNavigation({
    currentStep,
    totalSteps,
    onNext: isStepDisabled ? () => {} : handleNext,
    onPrevious: handlePrevious,
    onSubmit: isStepDisabled ? () => {} : handleSubmit,
    isStepDisabled,
  });

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
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <Progress className="w-[200px]" size="sm" value={100} />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center transition-opacity duration-500 ${showForm ? "opacity-100" : "opacity-0"} ${marginClass} ${getFormClasses()}`}
      dir={dir}
      style={customStyles.containerStyle}
    >
      <div
        className={`flex w-full flex-col gap-8 ${containerClass} ${isCustomWidth ? "ikiform-custom-width" : ""}`}
      >
        <Card
          className="flex w-full grow flex-col gap-6 rounded-card border-none bg-transparent hover:bg-transparent"
          style={customStyles.cardStyle}
          variant="ghost"
        >
          <FormProgress
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
              fieldVisibility={fieldVisibility}
              formData={formData}
              formId={formId}
              logicMessages={logicMessages}
              onFieldValueChange={handleFieldValueChange}
              schema={schema}
              title={schema.settings.title}
            />
          </div>
          <FormNavigation
            currentFields={currentBlock.fields}
            currentStep={currentStep}
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
