import React from "react";

import { Label } from "@/components/ui/label";

import type { FieldWrapperProps } from "../types";

import { getWidthClass } from "../utils";

export function FieldWrapper({
  field,
  error,
  children,
  builderMode = false,
}: FieldWrapperProps) {
  const isStatement = field.type === "statement";
  const isQuizField = field.settings?.isQuizField;

  return (
    <div
      className={`flex flex-col gap-2 ${field.label ? "" : "-mt-2"} ${getWidthClass(field.settings?.width as any)}`}
    >
      {!(isStatement || isQuizField) && (
        <>
          <Label
            className="font-medium text-foreground text-sm"
            htmlFor={field.id}
          >
            {field.label && field.label.replace("*", "")}
            {field.label && field.required && (
              <span className="ml-1 text-destructive">*</span>
            )}
          </Label>
          {field.description && (
            <p className="form-description text-muted-foreground text-sm opacity-80">
              {field.description}
            </p>
          )}
        </>
      )}
      {children}
      {!isStatement && field.settings?.helpText && (
        <p className="text-muted-foreground text-xs">
          {field.settings.helpText}
        </p>
      )}
      {!isStatement && error && (
        <p className="flex items-start gap-1 text-destructive text-sm">
          {error}
        </p>
      )}
    </div>
  );
}
