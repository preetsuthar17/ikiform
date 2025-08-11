import type { FormField } from "@/lib/database";
import type { FieldSize, FieldVariant, FieldWidth } from "../types";

export const getWidthClass = (width?: FieldWidth) => {
  switch (width) {
    case "half":
      return "flex-1 basis-1/2";
    case "third":
      return "flex-1 basis-1/3";
    case "quarter":
      return "flex-1 basis-1/4";
    default:
      return "flex-1 basis-full";
  }
};

export const getSizeClasses = (size?: FieldSize) => {
  switch (size) {
    case "sm":
      return "text-sm gap-2 h-8";
    case "lg":
      return "text-lg gap-4 h-14";
    default:
      return "gap-3 h-10";
  }
};

export const getVariantClasses = (variant?: FieldVariant) => {
  switch (variant) {
    case "filled":
      return "bg-muted/50 border-muted";
    case "ghost":
      return "bg-transparent border-transparent shadow-none";
    case "underline":
      return "rounded-none border-0 border-b-2 border-input bg-transparent gap-0 py-2 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-b-2 focus-visible:border-input text-inherit placeholder:text-muted-foreground";
    default:
      return "";
  }
};

export const getBaseClasses = (field: FormField, error?: string) => {
  const sizeClasses = getSizeClasses(field.settings?.size as FieldSize);
  const variantClasses = getVariantClasses(
    field.settings?.variant as FieldVariant,
  );
  const errorClasses = error
    ? "border-destructive focus:border-destructive"
    : "";

  return `${sizeClasses} ${variantClasses} ${errorClasses}`.trim();
};

export const getErrorClasses = (error?: string) => {
  return error ? "border-destructive focus:border-destructive" : "";
};

export const getErrorRingClasses = (error?: string) => {
  return error ? "ring-2 ring-destructive/20" : "";
};

export { createFieldComponent } from "./fieldFactory";
