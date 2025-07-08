// External imports
import React, { useState, useEffect } from "react";

// Component imports
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Utility imports
import { getBaseClasses } from "../utils";
import {
  validateEmail,
  autoCompleteEmail,
} from "@/lib/validation/email-validation";

// Type imports
import type { BaseFieldProps } from "../types";

export function EmailInputField({
  field,
  value,
  onChange,
  error,
}: BaseFieldProps) {
  const baseClasses = getBaseClasses(field, error);
  const [inputValue, setInputValue] = useState(value || "");
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const emailSettings = field.settings?.emailValidation;

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const validateEmailField = (email: string) => {
    return validateEmail(email, emailSettings);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Show auto-complete suggestion if user is typing username and auto-complete is enabled
    if (emailSettings?.autoCompleteDomain && !newValue.includes("@")) {
      setShowAutoComplete(true);
    } else {
      setShowAutoComplete(false);
    }

    // Validate and update parent
    const validation = validateEmailField(newValue);
    if (validation.isValid || !newValue) {
      onChange(newValue);
    } else {
      onChange(newValue); // Still update the value but validation will show error
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

    // Auto-complete on blur if user only entered username
    if (
      emailSettings?.autoCompleteDomain &&
      inputValue &&
      !inputValue.includes("@")
    ) {
      handleAutoComplete();
    }
  };

  const validation = validateEmailField(inputValue);

  // Only show one error, and avoid duplicate messages
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

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          type="email"
          id={field.id}
          placeholder={
            field.placeholder ||
            (emailSettings?.autoCompleteDomain
              ? `username@${emailSettings.autoCompleteDomain}`
              : "Enter email address")
          }
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={`flex gap-2 ${baseClasses}`}
        />

        {showAutoComplete && emailSettings?.autoCompleteDomain && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-accent border border-border rounded-md p-2 z-10">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Press Tab or click to complete:{" "}
                <strong>
                  {inputValue}@{emailSettings.autoCompleteDomain}
                </strong>
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleAutoComplete}
                className="h-6 px-2 text-xs"
              >
                Complete
              </Button>
            </div>
          </div>
        )}
      </div>

      {emailSettings?.autoCompleteDomain && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            Auto-complete: @{emailSettings.autoCompleteDomain}
          </Badge>
        </div>
      )}

      {emailSettings?.allowedDomains &&
        emailSettings.allowedDomains.length > 0 && (
          <div className="flex flex-wrap gap-1">
            <span className="text-xs text-muted-foreground">
              Allowed domains:
            </span>
            {emailSettings.allowedDomains.map((domain, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                @{domain}
              </Badge>
            ))}
          </div>
        )}
    </div>
  );
}
