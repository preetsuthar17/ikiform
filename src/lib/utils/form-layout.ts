import type { FormSchema } from "@/lib/database";

export interface LayoutClasses {
  maxWidthClass: string;
  paddingClass: string;
  containerClass: string;
  marginClass: string;
}

export const getFormLayoutClasses = (schema: FormSchema): LayoutClasses => {
  const layout = schema.settings?.layout || {};

  let maxWidthClass = "max-w-2xl";
  switch (layout?.maxWidth) {
    case "sm":
      maxWidthClass = "max-w-sm";
      break;
    case "md":
      maxWidthClass = "max-w-2xl";
      break;
    case "lg":
      maxWidthClass = "max-w-4xl";
      break;
    case "xl":
      maxWidthClass = "max-w-6xl";
      break;
    case "full":
      maxWidthClass = "max-w-full";
      break;
  }

  let paddingClass = "md:p-6 p-2";
  switch (layout?.padding) {
    case "none":
      paddingClass = "p-0";
      break;
    case "sm":
      paddingClass = "md:p-4 p-2";
      break;
    case "md":
      paddingClass = "md:p-6 p-2";
      break;
    case "lg":
      paddingClass = "md:p-8 p-4";
      break;
  }

  let containerClass = "max-w-2xl mx-auto";
  switch (layout?.maxWidth) {
    case "sm":
      containerClass = "max-w-sm mx-auto";
      break;
    case "md":
      containerClass = "max-w-2xl mx-auto";
      break;
    case "lg":
      containerClass = "max-w-4xl mx-auto";
      break;
    case "xl":
      containerClass = "max-w-6xl mx-auto";
      break;
    case "full":
      containerClass = "w-full";
      break;
  }

  let marginClass = "";
  switch (layout?.margin) {
    case "sm":
      marginClass = "my-2";
      break;
    case "md":
      marginClass = "my-4";
      break;
    case "lg":
      marginClass = "my-8";
      break;
    default:
      marginClass = "";
  }

  return { maxWidthClass, paddingClass, containerClass, marginClass };
};

export const getDesignModeClass = (designMode?: string) => {
  return designMode === "minimal"
    ? "bg-transparent border-none shadow-none hover:bg-transparent"
    : "";
};
