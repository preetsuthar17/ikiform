import type React from "react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { validateEmail } from "@/lib/validation/email-validation";
import type { BaseFieldProps } from "../types";
import { applyBuilderMode, getBaseClasses, getBuilderMode } from "../utils";

export function EmailInputField(props: BaseFieldProps) {
  const { field, value, onChange, error, disabled } = props;
  const builderMode = getBuilderMode(props);
  const baseClasses = getBaseClasses(field, error);
  const [inputValue, setInputValue] = useState(value || "");
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const getEmailSettings = () => field.settings?.emailValidation;

  const getEmailPlaceholder = () => {
    const emailSettings = getEmailSettings();
    return (
      field.placeholder ||
      (emailSettings?.autoCompleteDomain
        ? `username@${emailSettings.autoCompleteDomain}`
        : "Enter email address")
    );
  };

  const validateEmailField = (email: string) => {
    const emailSettings = getEmailSettings();
    return validateEmail(email, emailSettings);
  };

  const getEmailValidation = () => validateEmailField(inputValue);

  const getErrorMessage = () => {
    const validation = getEmailValidation();

    if (error && validation.message && error === validation.message) {
      return error;
    }
    if (error) {
      return error;
    }
    if (
      isValidating &&
      !validation.isValid &&
      inputValue &&
      validation.message
    ) {
      return validation.message;
    }
    return "";
  };

  const shouldShowAutoComplete = () => {
    const emailSettings = getEmailSettings();
    return (
      showAutoComplete && emailSettings?.autoCompleteDomain && !builderMode
    );
  };

  const shouldShowAutoCompleteBadge = () => {
    const emailSettings = getEmailSettings();
    return emailSettings?.autoCompleteDomain;
  };

  const shouldShowAllowedDomains = () => {
    const emailSettings = getEmailSettings();
    return (
      emailSettings?.allowedDomains && emailSettings.allowedDomains.length > 0
    );
  };

  const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    const emailSettings = getEmailSettings();
    if (emailSettings?.autoCompleteDomain && !newValue.includes("@")) {
      setShowAutoComplete(true);
    } else {
      setShowAutoComplete(false);
    }

    const validation = validateEmailField(newValue);
    onChange(newValue);
  };

  const handleEmailInputBlur = () => {
    setShowAutoComplete(false);
    setIsValidating(true);

    const emailSettings = getEmailSettings();
    if (
      emailSettings?.autoCompleteDomain &&
      inputValue &&
      !inputValue.includes("@")
    ) {
      handleAutoComplete();
    }
  };

  const handleEmailInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Escape") {
      e.currentTarget.blur();
    }
  };

  const handleAutoComplete = () => {
    const emailSettings = getEmailSettings();
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

  const handleAutoCompleteButtonClick = () => {
    handleAutoComplete();
  };

  const renderAutoCompleteDropdown = () => {
    if (!shouldShowAutoComplete()) return null;

    const emailSettings = getEmailSettings();
    if (!emailSettings?.autoCompleteDomain) return null;

    return (
      <div className="absolute top-full right-0 left-0 z-10 mt-1 rounded-xl border border-border bg-accent p-2">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">
            Press Tab or click to complete:{" "}
            <strong>
              {inputValue}@{emailSettings.autoCompleteDomain}
            </strong>
          </span>
          <Button
            aria-label="Complete email address"
            className="h-6 px-2 text-xs"
            onClick={handleAutoCompleteButtonClick}
            size="sm"
            variant="outline"
          >
            Complete
          </Button>
        </div>
      </div>
    );
  };

  const renderAutoCompleteBadge = () => {
    if (!shouldShowAutoCompleteBadge()) return null;

    const emailSettings = getEmailSettings();
    return (
      <div className="flex items-center gap-2">
        <Badge className="text-xs" variant="secondary">
          Auto-complete: @{emailSettings?.autoCompleteDomain ?? ""}
        </Badge>
      </div>
    );
  };

  const renderAllowedDomains = () => {
    if (!shouldShowAllowedDomains()) return null;

    const emailSettings = getEmailSettings();
    return (
      <div className="flex flex-wrap gap-1">
        <span className="text-muted-foreground text-xs">Allowed domains:</span>
        {(emailSettings?.allowedDomains ?? []).map((domain, index) => (
          <Badge className="text-xs" key={index} variant="outline">
            @{domain}
          </Badge>
        ))}
      </div>
    );
  };

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const inputProps = applyBuilderMode(
    {
      className: `flex gap-2 ${baseClasses}`,
      disabled,
      id: field.id,
      name: field.id,
      autoComplete: "email",
      inputMode: "email" as const,
      onBlur: handleEmailInputBlur,
      onChange: handleEmailInputChange,
      onKeyDown: handleEmailInputKeyDown,
      placeholder: getEmailPlaceholder(),
      type: "email",
      value: inputValue,
    },
    builderMode
  );

  const errorMessage = getErrorMessage();

  return (
    <div className="flex flex-col gap-2">
      <div className={`relative ${builderMode ? "pointer-events-none" : ""}`}>
        <Input {...inputProps} />
        {renderAutoCompleteDropdown()}
      </div>

      {renderAutoCompleteBadge()}
      {renderAllowedDomains()}
    </div>
  );
}
