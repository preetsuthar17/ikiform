// External imports
import React from "react";

// Component imports
import { Label } from "@/components/ui/label";

// Utility imports
import { getWidthClass } from "../utils";

// Type imports
import type { FieldWrapperProps } from "../types";

export function FieldWrapper({ field, error, children }: FieldWrapperProps) {
  const isStatement = field.type === "statement";
  return (
    <div
      className={`flex flex-col gap-2 ${getWidthClass(field.settings?.width as any)}`}
    >
      {!isStatement && (
        <>
          <Label
            htmlFor={field.id}
            className="text-sm font-medium text-foreground"
          >
            {field.label.replace("*", "")}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          {field.description && (
            <p className="text-sm text-muted-foreground">{field.description}</p>
          )}
        </>
      )}
      {children}
      {!isStatement && field.settings?.helpText && (
        <p className="text-xs text-muted-foreground">
          {field.settings.helpText}
        </p>
      )}
      {!isStatement && error && (
        <p className="text-sm text-destructive flex items-start gap-1">
          {error}
        </p>
      )}
    </div>
  );
}
