"use client";

import { useEffect, useState } from "react";
import type { FormSchema } from "@/lib/database";
import type { FormCustomStyles } from "@/lib/utils/form-layout";
import { getFormCustomStyles } from "@/lib/utils/form-layout";
import { loadGoogleFont } from "@/lib/utils/google-fonts";

export function useFormStyling(schema: FormSchema) {
  const [customStyles, setCustomStyles] = useState<FormCustomStyles>({
    containerStyle: {},
    cardStyle: {},
    formStyle: {},
    textStyle: {},
  });
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    async function loadStyles() {
      try {
        const styles = await getFormCustomStyles(schema);
        setCustomStyles(styles);

        // Load Google Font if specified
        const fontFamily = (schema.settings as any)?.typography?.fontFamily;
        if (fontFamily && typeof window !== "undefined") {
          await loadGoogleFont(fontFamily);
          setFontLoaded(true);
        } else {
          setFontLoaded(true);
        }
      } catch (error) {
        console.warn("Failed to load form styles:", error);
        setFontLoaded(true);
      }
    }

    loadStyles();
  }, [schema.settings]);

  // Create CSS variables for dynamic styling
  useEffect(() => {
    if (typeof window === "undefined") return;

    const colors = (schema.settings as any)?.colors;
    if (colors) {
      const root = document.documentElement;

      if (colors.primary) {
        root.style.setProperty("--form-primary-color", colors.primary);
      }
      if (colors.text) {
        root.style.setProperty("--form-text-color", colors.text);
      }
      if (colors.background) {
        root.style.setProperty("--form-background-color", colors.background);
      }
      if (colors.border) {
        root.style.setProperty("--form-border-color", colors.border);
      }

      return () => {
        root.style.removeProperty("--form-primary-color");
        root.style.removeProperty("--form-text-color");
        root.style.removeProperty("--form-background-color");
        root.style.removeProperty("--form-border-color");
      };
    }
  }, [(schema.settings as any)?.colors]);

  // Generate custom CSS class names based on settings
  const getFormClasses = () => {
    const classes = ["ikiform-customized", "w-full", "ikiform-minimal"];
    return classes.join(" ");
  };

  const getFieldStyles = () => {
    const colors = (schema.settings as any)?.colors;
    return {
      borderColor: colors?.border || undefined,
      fontFamily: customStyles.formStyle.fontFamily || undefined,
    };
  };

  const getButtonStyles = (isPrimary = false) => {
    const colors = (schema.settings as any)?.colors;
    if (isPrimary && colors?.primary) {
      return {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
        color: "#ffffff",
      };
    }
    return {};
  };

  return {
    customStyles,
    fontLoaded,
    getFormClasses,
    getFieldStyles,
    getButtonStyles,
  };
}
