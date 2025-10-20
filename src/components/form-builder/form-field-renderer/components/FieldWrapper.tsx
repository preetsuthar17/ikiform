import { Label } from "@/components/ui/label";

import type { FieldWrapperProps } from "../types";

import { getWidthClass } from "../utils";

export function FieldWrapper({
  field,
  error,
  children,
  builderMode = false,
}: FieldWrapperProps) {
  const isStatementField = field.type === "statement";
  const isQuizField = field.settings?.isQuizField;
  const shouldShowLabel = !(isStatementField || isQuizField);
  const shouldShowHelpText = !isStatementField && field.settings?.helpText;
  const shouldShowError = !isStatementField && error;

  const getFieldLabel = () => (field.label ? field.label.replace("*", "") : "");

  const getFieldDescription = () => field.description;

  const getFieldHelpText = () => field.settings?.helpText;

  const getFieldWidthClass = () => getWidthClass(field.settings?.width as any);

  const getContainerClassName = () => {
    const baseClasses = "flex flex-col gap-2";
    const widthClass = getFieldWidthClass();
    const marginClass = field.label ? "" : "-mt-2";

    return `${baseClasses} ${widthClass} ${marginClass}`.trim();
  };

  const renderFieldLabel = () => {
    if (!(shouldShowLabel && field.label)) return null;

    return (
      <Label className="font-medium text-foreground text-sm" htmlFor={field.id}>
        {getFieldLabel()}
        {field.required && <span className="ml-1 text-destructive">*</span>}
      </Label>
    );
  };

  const renderFieldDescription = () => {
    const description = getFieldDescription();
    if (!(shouldShowLabel && description)) return null;

    return (
      <p className="form-description text-muted-foreground text-sm opacity-80">
        {description}
      </p>
    );
  };

  const renderFieldHelpText = () => {
    const helpText = getFieldHelpText();
    if (!(shouldShowHelpText && helpText)) return null;

    return <p className="text-muted-foreground text-xs">{helpText}</p>;
  };

  const renderFieldError = () => {
    if (!(shouldShowError && error)) return null;

    return (
      <p
        aria-live="polite"
        className="flex items-start gap-1 text-destructive text-sm"
        role="alert"
      >
        {error}
      </p>
    );
  };

  return (
    <div
      className={getContainerClassName()}
      data-builder-mode={builderMode ? "true" : undefined}
      onClick={
        builderMode
          ? (e) => {
              e.stopPropagation();
              const card =
                (e.currentTarget.closest('[role="button"]') as HTMLElement) ??
                undefined;
              card?.click();
            }
          : undefined
      }
      role={builderMode ? "group" : undefined}
    >
      {renderFieldLabel()}
      {renderFieldDescription()}
      {children}
      {renderFieldHelpText()}
      {renderFieldError()}
    </div>
  );
}
