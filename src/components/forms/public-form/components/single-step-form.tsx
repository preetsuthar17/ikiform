// Libraries
import React, { useState, useEffect } from "react";
import Link from "next/link";

// Types
import type { PublicFormProps } from "../types";

// Hooks
import { useSingleStepForm } from "../hooks/use-single-step-form";

// Utilities
import { getAllFields } from "../utils/form-utils";

// Components
import { SingleStepSuccessScreen } from "./single-step-success-screen";
import { SingleStepFormContent } from "./single-step-form-content";
import { PasswordProtectionModal } from "./PasswordProtectionModal";
import { Progress } from "@/components/ui/progress";
import { SocialMediaIcons } from "@/components/ui/social-media-icons";

import toast from "react-hot-toast";

export const SingleStepForm: React.FC<PublicFormProps & { dir?: string }> = ({
  formId,
  schema,
  dir,
}) => {
  const fields = getAllFields(schema);
  const formState = useSingleStepForm(formId, schema, fields);
  const {
    formData,
    errors,
    submitting,
    submitted,
    handleFieldValueChange,
    handleSubmit,
  } = formState;

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
      <div className="min-h-screen bg-background flex items-center justify-center w-full">
        <div className="max-w-sm mx-auto flex flex-col gap-6 w-full px-4">
          <Progress value={100} size="sm" className="max-w-sm" />
        </div>
      </div>
    );
  }

  return (
    <div
      dir={dir}
      className={`py-24 bg-background flex items-center justify-center w-full transition-opacity duration-500 ${
        showForm ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="max-w-2xl mx-auto flex flex-col gap-8 w-full">
        <SingleStepFormContent
          schema={schema}
          fields={fields}
          formData={formData}
          errors={errors}
          submitting={submitting}
          onFieldValueChange={handleFieldValueChange}
          onSubmit={handleSubmit}
        />

        <div className="text-center space-y-4">
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
};
