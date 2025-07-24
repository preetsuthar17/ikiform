// Libraries
import React, { useState, useEffect } from "react";
import Link from "next/link";

// UI Components
import { Progress } from "@/components/ui/progress";
import { SingleStepFormContent } from "./single-step-form-content";
import { SocialMediaIcons } from "@/components/ui/social-media-icons";
import { SingleStepSuccessScreen } from "./single-step-success-screen";
import { PasswordProtectionModal } from "./PasswordProtectionModal";

// Hooks
import { useSingleStepForm } from "../hooks/use-single-step-form";

// Utilities
import { getAllFields } from "../utils/form-utils";
import { getFormLayoutClasses } from "@/lib/utils/form-layout";

// Types
import type { PublicFormProps } from "../types";

import toast from "react-hot-toast";

export const SingleStepForm: React.FC<PublicFormProps & { dir?: string }> = ({
  formId,
  schema,
  dir,
}) => {
  const fields = getAllFields(schema);
  const {
    formData,
    errors,
    submitting,
    submitted,
    handleFieldValueChange,
    handleSubmit,
    fieldVisibility,
    logicMessages,
  } = useSingleStepForm(formId, schema, fields);

  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const { containerClass, marginClass } = getFormLayoutClasses(schema);

  useEffect(() => {
    const passwordProtection = schema.settings.passwordProtection;
    if (passwordProtection?.enabled && passwordProtection?.password) {
      setIsPasswordProtected(true);
      setShowPasswordModal(true);
    }
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowForm(true);
    }, 1500);

    return () => clearTimeout(timer);
  });

  if (submitted) {
    return <SingleStepSuccessScreen schema={schema} />;
  }

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
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <Progress value={100} size="sm" className="w-[200px]" />
      </div>
    );
  }

  return (
    <div
      dir={dir}
      className={`bg-background flex items-center justify-center w-full transition-opacity duration-500 ${showForm ? "opacity-100" : "opacity-0"} ${marginClass}`}
    >
      <div className={`flex flex-col gap-8 w-full ${containerClass}`}>
        <SingleStepFormContent
          schema={schema}
          fields={fields}
          formData={formData}
          errors={errors}
          submitting={submitting}
          onFieldValueChange={handleFieldValueChange}
          onSubmit={handleSubmit}
          fieldVisibility={fieldVisibility}
          logicMessages={logicMessages}
        />

        <div className="text-center flex flex-col gap-4">
          {schema.settings.branding?.socialMedia?.enabled &&
            schema.settings.branding.socialMedia.platforms &&
            (schema.settings.branding.socialMedia.position === "footer" ||
              schema.settings.branding.socialMedia.position === "both") && (
              <SocialMediaIcons
                platforms={schema.settings.branding.socialMedia.platforms}
                iconSize={schema.settings.branding.socialMedia.iconSize || "md"}
                className="justify-center"
              />
            )}
          {Boolean(
            schema.settings.branding &&
              (schema.settings.branding as any).showIkiformBranding !== false,
          ) && (
            <p className="text-sm text-muted-foreground">
              Powered by{" "}
              <span className="font-medium underline text-foreground">
                <Link href="https://www.ikiform.com">Ikiform</Link>
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
