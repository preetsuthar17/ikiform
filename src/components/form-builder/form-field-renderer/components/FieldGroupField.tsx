import React from "react";
import type { BaseFieldProps } from "../types";
import { createFieldComponent } from "../utils/fieldFactory";

export function FieldGroupField({
  field,
  value,
  onChange,
  error,
  disabled,
  formId,
}: BaseFieldProps) {
  const groupFields = field.settings?.groupFields || [];
  const groupLayout = field.settings?.groupLayout || "horizontal";
  const groupSpacing = field.settings?.groupSpacing || "normal";
  const groupColumns = field.settings?.groupColumns || 2;

  const getSpacingClass = () => {
    switch (groupSpacing) {
      case "compact":
        return "gap-2";
      case "relaxed":
        return "gap-6";
      default:
        return "gap-4";
    }
  };

  const getLayoutClass = () => {
    if (groupLayout === "vertical") {
      return "flex flex-col";
    }

    // Horizontal layout with responsive columns
    switch (groupColumns) {
      case 3:
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
      case 4:
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
      default:
        return "grid grid-cols-1 md:grid-cols-2";
    }
  };

  const handleFieldChange = (fieldId: string, fieldValue: any) => {
    const currentValues = value || {};
    onChange({
      ...currentValues,
      [fieldId]: fieldValue,
    });
  };


  return (
    <div className={`${getLayoutClass()} ${getSpacingClass()}`}>
      {groupFields.map((groupField) => {
        const fieldValue = value?.[groupField.id];

        return (
          <div className="flex-1" key={groupField.id}>
            <div className="flex flex-col gap-2">
              {groupField.label && (
                <label className="text-sm font-medium text-foreground">
                  {groupField.label}
                  {groupField.required && <span className="text-destructive ml-1">*</span>}
                </label>
              )}
              {createFieldComponent(
                groupField,
                fieldValue,
                (fieldValue) => handleFieldChange(groupField.id, fieldValue),
                typeof error === "object" && error !== null && groupField.id in error
                  ? (error as Record<string, string | undefined>)[groupField.id]
                  : undefined,
                undefined,
                disabled,
                formId
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
