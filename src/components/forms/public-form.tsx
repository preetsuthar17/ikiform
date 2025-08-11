"use client";

import React, { useEffect } from "react";

import { MultiStepForm } from "./multi-step-form";
import { SingleStepForm } from "./public-form/components";

import type { PublicFormProps } from "./public-form/types";

export function PublicForm({ formId, schema, theme }: PublicFormProps) {
  const isMultiStep = schema.settings.multiStep || schema.blocks?.length > 1;
  const dir = schema.settings.rtl ? "rtl" : "ltr";

  useEffect(() => {
    const settings = schema?.settings;
    const layout = settings?.layout;
    const colors = (settings as any)?.colors;
    const typography = (settings as any)?.typography;

    // Set border radius
    const val = layout?.borderRadius || "md";
    let borderRadiusValue = "8px";
    let cardRadiusValue = "16px";
    switch (val) {
      case "none":
        borderRadiusValue = "0px";
        cardRadiusValue = "0px";
        break;
      case "sm":
        borderRadiusValue = "4px";
        cardRadiusValue = "8px";
        break;
      case "md":
        borderRadiusValue = "10px";
        cardRadiusValue = "16px";
        break;
      case "lg":
        borderRadiusValue = "16px";
        cardRadiusValue = "24px";
        break;
      case "xl":
        borderRadiusValue = "24px";
        cardRadiusValue = "32px";
        break;
    }

    // Set CSS custom properties
    const root = document.documentElement;
    root.style.setProperty("--radius", borderRadiusValue);
    root.style.setProperty("--card-radius", cardRadiusValue);

    // Set custom width if specified
    if ((layout as any)?.maxWidth === "custom" && (layout as any)?.customWidth) {
      root.style.setProperty("--form-custom-width", (layout as any).customWidth);
    }

    // Set color variables for CSS
    if (colors?.primary) {
      root.style.setProperty("--form-primary-color", colors.primary);
    }
    if (colors?.text) {
      root.style.setProperty("--form-text-color", colors.text);
    }
    if (colors?.background) {
      root.style.setProperty("--form-background-color", colors.background);
    }
    if (colors?.border) {
      root.style.setProperty("--form-border-color", colors.border);
    }

    return () => {
      // Cleanup
      root.style.setProperty("--radius", "0.7rem");
      root.style.setProperty("--card-radius", "1rem");
      root.style.removeProperty("--form-custom-width");
      root.style.removeProperty("--form-primary-color");
      root.style.removeProperty("--form-text-color");
      root.style.removeProperty("--form-background-color");
      root.style.removeProperty("--form-border-color");
    };
  }, [schema?.settings]);

  return (
    <div
      className={`flex flex-col w-full gap-4 ${theme ? `theme-${theme}` : ""}`}
      dir={dir}
    >
      {isMultiStep ? (
        <MultiStepForm dir={dir} formId={formId} schema={schema} />
      ) : (
        <SingleStepForm dir={dir} formId={formId} schema={schema} />
      )}
    </div>
  );
}

export default PublicForm;
