import type { FormSchema } from "@/lib/database";
import {
  generateFormStyles,
  getBorderRadiusValue,
  getFontSizeValue,
  getFontWeightValue,
  getMarginValue,
  getMaxWidthValue,
  getPaddingValue,
} from "./form-styles";
import { loadGoogleFont } from "./google-fonts";

export interface LayoutClasses {
  maxWidthClass: string;
  paddingClass: string;
  containerClass: string;
  marginClass: string;
}

export interface FormCustomStyles {
  containerStyle: React.CSSProperties;
  cardStyle: React.CSSProperties;
  formStyle: React.CSSProperties;
  textStyle: React.CSSProperties;
  headingStyle: React.CSSProperties;
}

export const getFormLayoutClasses = (schema: FormSchema): LayoutClasses => {
  const layout = schema.settings?.layout || {};

  let maxWidthClass = "max-w-2xl"; // Default to medium (2xl)
  let containerClass = "w-full max-w-2xl mx-auto"; // Always w-full with max-width constraint

  // Handle custom width
  if ((layout as any)?.maxWidth === "custom" && (layout as any)?.customWidth) {
    maxWidthClass = "";
    containerClass = "w-full mx-auto"; // Keep w-full, max-width will be set via CSS
  } else {
    switch (layout?.maxWidth) {
      case "sm":
        maxWidthClass = "max-w-sm";
        containerClass = "w-full max-w-sm mx-auto";
        break;
      case "md":
        maxWidthClass = "max-w-2xl";
        containerClass = "w-full max-w-2xl mx-auto";
        break;
      case "lg":
        maxWidthClass = "max-w-4xl";
        containerClass = "w-full max-w-4xl mx-auto";
        break;
      case "xl":
        maxWidthClass = "max-w-6xl";
        containerClass = "w-full max-w-6xl mx-auto";
        break;
      case "full":
        maxWidthClass = "max-w-full";
        containerClass = "w-full max-w-full mx-auto";
        break;
    }
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

export const getFormCustomStyles = async (
  schema: FormSchema
): Promise<FormCustomStyles> => {
  const settings = schema.settings || {};
  const colors = (settings as any).colors || {};
  const typography = (settings as any).typography || {};
  const layout = settings.layout || {};

  // Load Google Font if specified
  if (typography.fontFamily && typeof window !== "undefined") {
    try {
      await loadGoogleFont(typography.fontFamily);
    } catch (error) {
      console.warn("Failed to load Google Font:", typography.fontFamily, error);
    }
  }

  const containerStyle: React.CSSProperties = {
    backgroundColor: colors.background || undefined,
    color: colors.text || undefined,
    fontFamily: typography.fontFamily
      ? `"${typography.fontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
      : undefined,
    fontSize: typography.fontSize
      ? getFontSizeValue(typography.fontSize)
      : undefined,
    fontWeight: typography.fontWeight
      ? getFontWeightValue(typography.fontWeight)
      : undefined,
    maxWidth:
      (layout as any).maxWidth === "custom" && (layout as any).customWidth
        ? (layout as any).customWidth
        : layout.maxWidth
          ? getMaxWidthValue(layout.maxWidth)
          : getMaxWidthValue("md"), // Default to medium if no width specified
    width: "100%", // Always full width, constrained by max-width
    margin: layout.margin ? `${getMarginValue(layout.margin)} auto` : "0 auto",
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: colors.background || undefined,
    borderColor: colors.border || undefined,
    borderRadius: layout.borderRadius
      ? getBorderRadiusValue(layout.borderRadius)
      : undefined,
    padding: layout.padding ? getPaddingValue(layout.padding) : undefined,
  };

  const formStyle: React.CSSProperties = {
    fontFamily: typography.fontFamily
      ? `"${typography.fontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
      : undefined,
  };

  const textStyle: React.CSSProperties = {
    color: colors.text || undefined,
    fontFamily: typography.fontFamily
      ? `"${typography.fontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
      : undefined,
    fontSize: typography.fontSize
      ? getFontSizeValue(typography.fontSize)
      : undefined,
    fontWeight: typography.fontWeight
      ? getFontWeightValue(typography.fontWeight)
      : undefined,
  };

  const headingStyle: React.CSSProperties = {
    color: colors.text || undefined,
    fontFamily: typography.fontFamily
      ? `"${typography.fontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
      : undefined,
  };

  return {
    containerStyle,
    cardStyle,
    formStyle,
    textStyle,
    headingStyle,
  };
};

export const getDesignModeClass = () =>
  "bg-transparent border-none  hover:bg-transparent";
