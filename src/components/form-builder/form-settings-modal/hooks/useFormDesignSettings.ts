import { useCallback, useEffect } from "react";
import {
  generateFormStyles,
  injectFormStyles,
  removeFormStyles,
} from "@/lib/utils/form-styles";
import { loadGoogleFont } from "@/lib/utils/google-fonts";
import type { LocalSettings } from "../types";

export function useFormDesignSettings(
  localSettings: LocalSettings,
  formId?: string
) {
  // Load Google Font when font family changes
  useEffect(() => {
    const fontFamily = localSettings.typography?.fontFamily;
    if (fontFamily && typeof window !== "undefined") {
      loadGoogleFont(fontFamily).catch(console.error);
    }
  }, [localSettings.typography?.fontFamily]);

  // Inject form styles when settings change
  useEffect(() => {
    if (formId && typeof window !== "undefined") {
      const styleConfig = generateFormStyles(localSettings);
      injectFormStyles(styleConfig, formId);

      return () => {
        removeFormStyles(formId);
      };
    }
  }, [localSettings, formId]);

  const previewStyles = useCallback(() => {
    const config = generateFormStyles(localSettings);
    return {
      backgroundColor: config.colors?.background || "#ffffff",
      color: config.colors?.text || "#000000",
      fontFamily: config.typography?.fontFamily
        ? `"${config.typography.fontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
        : undefined,
      maxWidth: config.layout?.maxWidth || "600px",
      padding: config.layout?.padding || "24px",
      margin: `${config.layout?.margin || "16px"} auto`,
      borderRadius: config.layout?.borderRadius || "8px",
      border: `1px solid ${config.colors?.border || "#e2e8f0"}`,
    };
  }, [localSettings]);

  return {
    previewStyles,
  };
}

export function useColorValidation() {
  const isValidHexColor = useCallback((color: string): boolean => {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexRegex.test(color);
  }, []);

  const isValidCSSColor = useCallback((color: string): boolean => {
    const style = new Option().style;
    style.color = color;
    return style.color !== "";
  }, []);

  const normalizeColor = useCallback(
    (color: string): string => {
      if (isValidHexColor(color)) return color;
      if (isValidCSSColor(color)) return color;
      return "#000000"; // fallback
    },
    [isValidHexColor, isValidCSSColor]
  );

  return {
    isValidHexColor,
    isValidCSSColor,
    normalizeColor,
  };
}
