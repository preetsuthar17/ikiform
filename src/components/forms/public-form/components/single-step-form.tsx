import Link from "next/link";
import type React from "react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SocialMediaIcons } from "@/components/ui/social-media-icons";
import { useFormStyling } from "@/hooks/use-form-styling";
import { cn } from "@/lib/utils";
import { getFormLayoutClasses } from "@/lib/utils/form-layout";
import { PasswordProtectionModal } from "../../PasswordProtectionModal";
import { useSingleStepForm } from "../hooks/use-single-step-form";
import type { PublicFormProps } from "../types";
import { getAllFields } from "../utils/form-utils";
import { SingleStepFormContent } from "./single-step-form-content";
import { SingleStepSuccessScreen } from "./single-step-success-screen";

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
    duplicateError,
    handleFieldValueChange,
    handleSubmit,
    fieldVisibility,
    logicMessages,
    quizResults,
  } = useSingleStepForm(formId, schema, fields);

  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const { containerClass, marginClass } = getFormLayoutClasses(schema);
  const { customStyles, fontLoaded, getFormClasses } = useFormStyling(schema);

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
    const progressTimer = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      setShowForm(true);
    }, 1500);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(loadingTimer);
    };
  }, []);

  if (submitted) {
    return (
      <SingleStepSuccessScreen quizResults={quizResults} schema={schema} />
    );
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
        <div className="w-full max-w-[200px] px-6 py-8">
          <Progress className="h-2 w-full" value={loadingProgress} />
        </div>
      </div>
    );
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
          <div style={customStyles.formStyle}>
            <SingleStepFormContent
              duplicateError={duplicateError}
              errors={errors}
              fields={fields}
              fieldVisibility={fieldVisibility}
              formData={formData}
              formId={formId}
              logicMessages={logicMessages}
              onFieldValueChange={handleFieldValueChange}
              onSubmit={handleSubmit}
              schema={schema}
              submitting={submitting}
            />
          </div>
        </Card>
        <div
          className="flex flex-col gap-4 text-center"
          style={customStyles.textStyle}
        >
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
              <span className="font-medium text-foreground underline">
                <Link href="https://www.ikiform.com">Ikiform</Link>
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
