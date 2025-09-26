import type React from "react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  autoCompleteEmail,
  validateEmail,
} from "@/lib/validation/email-validation";

import type { BaseFieldProps } from "../types";

import { applyBuilderMode, getBaseClasses, getBuilderMode } from "../utils";

export function EmailInputField(props: BaseFieldProps) {
  const { field, value, onChange, error, disabled } = props;
  const builderMode = getBuilderMode(props);
  const baseClasses = getBaseClasses(field, error);
  const [inputValue, setInputValue] = useState(value || "");
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const emailSettings = field.settings?.emailValidation;

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const validateEmailField = (email: string) =>
    validateEmail(email, emailSettings);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (emailSettings?.autoCompleteDomain && !newValue.includes("@")) {
      setShowAutoComplete(true);
    } else {
      setShowAutoComplete(false);
    }

    const validation = validateEmailField(newValue);
    if (validation.isValid || !newValue) {
      onChange(newValue);
    } else {
      onChange(newValue);
    }
  };

  const handleAutoComplete = () => {
    if (
      emailSettings?.autoCompleteDomain &&
      inputValue &&
      !inputValue.includes("@")
    ) {
      const completedEmail = `${inputValue}@${emailSettings.autoCompleteDomain}`;
      setInputValue(completedEmail);
      setShowAutoComplete(false);
      onChange(completedEmail);
    }
  };

  const handleBlur = () => {
    setShowAutoComplete(false);
    setIsValidating(true);

    if (
      emailSettings?.autoCompleteDomain &&
      inputValue &&
      !inputValue.includes("@")
    ) {
      handleAutoComplete();
    }
  };

  const validation = validateEmailField(inputValue);

  let errorMessage = "";
  if (error && validation.message && error === validation.message) {
    errorMessage = error;
  } else if (error) {
    errorMessage = error;
  } else if (
    isValidating &&
    !validation.isValid &&
    inputValue &&
    validation.message
  ) {
    errorMessage = validation.message;
  }
  const showError = !!errorMessage;

  const inputProps = applyBuilderMode(
    {
      className: `flex gap-2 ${baseClasses}`,
      disabled,
      id: field.id,
      onBlur: handleBlur,
      onChange: handleInputChange,
      placeholder:
        field.placeholder ||
        (emailSettings?.autoCompleteDomain
          ? `username@${emailSettings.autoCompleteDomain}`
          : "Enter email address"),
      type: "email",
      value: inputValue,
    },
    builderMode
  );

  return (
    <div
      className={`flex flex-col gap-2 ${builderMode ? "pointer-events-none" : ""}`}
    >
      <div className={`relative ${builderMode ? "pointer-events-none" : ""}`}>
        <Input {...inputProps} />

        {showAutoComplete &&
          emailSettings?.autoCompleteDomain &&
          !builderMode && (
            <div className="absolute top-full right-0 left-0 z-10 mt-1 rounded-ele border border-border bg-accent p-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">
                  Press Tab or click to complete:{" "}
                  <strong>
                    {inputValue}@{emailSettings.autoCompleteDomain}
                  </strong>
                </span>
                <Button
                  className="h-6 px-2 text-xs"
                  onClick={handleAutoComplete}
                  size="sm"
                  variant="outline"
                >
                  Complete
                </Button>
              </div>
            </div>
          )}
      </div>

      {emailSettings?.autoCompleteDomain && (
        <div className="flex items-center gap-2">
          <Badge className="text-xs" variant="secondary">
            Auto-complete: @{emailSettings.autoCompleteDomain}
          </Badge>
        </div>
      )}

      {emailSettings?.allowedDomains &&
        emailSettings.allowedDomains.length > 0 && (
          <div className="flex flex-wrap gap-1">
            <span className="text-muted-foreground text-xs">
              Allowed domains:
            </span>
            {emailSettings.allowedDomains.map((domain, index) => (
              <Badge className="text-xs" key={index} variant="outline">
                @{domain}
              </Badge>
            ))}
          </div>
        )}
    </div>
  );
}
