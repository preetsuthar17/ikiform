"use client";

import React from "react";
import { FormFieldRenderer } from "@/components/form-builder/form-field-renderer";
import type { LocalSettings } from "@/components/form-builder/form-settings-modal/types";
import { Progress } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SocialMediaIcons } from "@/components/ui/social-media-icons";
import type { FormSchema } from "@/lib/database";
import {
  getBorderRadiusValue,
  getMarginValue,
  getMaxWidthValue,
  getPaddingValue,
} from "@/lib/utils/form-styles";
import { getPublicFormTitle } from "@/lib/utils/form-utils";

// Utility function to convert hex color to HSL values
function hexToHsl(hex: string): string {
  // Remove the hash if present
  hex = hex.replace("#", "");

  // Parse the hex values
  const r = Number.parseInt(hex.substring(0, 2), 16) / 255;
  const g = Number.parseInt(hex.substring(2, 4), 16) / 255;
  const b = Number.parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
}

interface ActualFormPreviewProps {
  localSettings: LocalSettings;
  schema: FormSchema;
  className?: string;
}

export function ActualFormPreview({
  localSettings,
  schema,
  className,
}: ActualFormPreviewProps) {
  const layout = localSettings.layout || {};
  const colors = localSettings.colors || {};
  const typography = localSettings.typography || {};

  // Calculate actual styling values
  const formWidth =
    layout.maxWidth === "custom" && layout.customWidth
      ? layout.customWidth
      : getMaxWidthValue(layout.maxWidth);

  const formPadding = getPaddingValue(layout.padding);
  const formMargin = getMarginValue(layout.margin);
  const formBorderRadius = getBorderRadiusValue(layout.borderRadius);

  const containerStyle: React.CSSProperties = {
    maxWidth: formWidth,
    margin: `${formMargin} auto`,
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: colors.background || undefined,
    color: colors.text || undefined,
    padding: formPadding,
    borderRadius: formBorderRadius,
    borderColor: colors.border || undefined,
    fontFamily: typography.fontFamily
      ? `"${typography.fontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
      : undefined,
  };

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    // Force light theme
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");

    const root = document.documentElement;

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
    root.style.setProperty("--radius", borderRadiusValue);
    root.style.setProperty("--card-radius", cardRadiusValue);

    // Set custom width if specified
    if (layout?.maxWidth === "custom" && layout?.customWidth) {
      root.style.setProperty("--form-custom-width", layout.customWidth);
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
    if (colors?.websiteBackground) {
      // Convert hex color to HSL values for CSS custom property
      const hslValues = hexToHsl(colors.websiteBackground);
      root.style.setProperty("--hu-background", hslValues);
      root.style.setProperty("--color-background", `hsl(${hslValues})`);
    }

    // Set typography variables for CSS
    if (typography?.fontFamily) {
      root.style.setProperty(
        "--form-font-family",
        `"${typography.fontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
      );
    }
    if (typography?.fontSize) {
      const { getFontSizeValue } = require("@/lib/utils/form-styles");
      root.style.setProperty(
        "--form-font-size",
        getFontSizeValue(typography.fontSize)
      );
    }
    if (typography?.fontWeight) {
      const { getFontWeightValue } = require("@/lib/utils/form-styles");
      root.style.setProperty(
        "--form-font-weight",
        getFontWeightValue(typography.fontWeight)
      );
    }

    return () => {
      // Cleanup - restore defaults
      root.style.setProperty("--radius", "0.7rem");
      root.style.setProperty("--card-radius", "1rem");
      root.style.removeProperty("--form-custom-width");
      root.style.removeProperty("--form-primary-color");
      root.style.removeProperty("--form-text-color");
      root.style.removeProperty("--form-background-color");
      root.style.removeProperty("--form-border-color");
      root.style.removeProperty("--hu-background");
      root.style.removeProperty("--color-background");
      root.style.removeProperty("--form-font-family");
      root.style.removeProperty("--form-font-size");
      root.style.removeProperty("--form-font-weight");

      // Remove forced light theme classes
      document.documentElement.classList.remove("light");
    };
  }, [
    layout?.borderRadius,
    layout?.maxWidth,
    layout?.customWidth,
    layout?.padding,
    layout?.margin,
    colors?.primary,
    colors?.text,
    colors?.background,
    colors?.border,
    colors?.websiteBackground,
    typography?.fontFamily,
    typography?.fontSize,
    typography?.fontWeight,
  ]);

  const previewSchema = {
    ...schema,
    settings: localSettings,
  };

  const isMultiStep = schema.settings.multiStep || schema.blocks?.length > 1;
  const currentStep = 0;
  const totalSteps = schema.blocks?.length || 1;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="light">
      <Card className={`border-0 p-0 shadow-none ${className || ""}`}>
        <div
          className="flex items-center justify-center transition-all duration-200"
          style={{
            margin: formMargin,
            fontFamily: typography.fontFamily
              ? `"${typography.fontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
              : undefined,
          }}
        >
          <div
            className={`ikiform-customized flex w-full flex-col gap-6 ${
              layout.maxWidth === "custom" && layout.customWidth
                ? "ikiform-custom-width"
                : ""
            }`}
            style={{ maxWidth: formWidth, margin: "0 auto" }}
          >
            <Card
              className="flex w-full grow flex-col gap-5 border-0 bg-transparent p-0"
              style={{
                backgroundColor: colors.background || undefined,
                borderRadius: formBorderRadius,
                padding: formPadding,
                color: colors.text || undefined,
                fontFamily: typography.fontFamily
                  ? `"${typography.fontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
                  : undefined,
              }}
            >
              {/* Progress Bar for Multi-step Forms */}
              {isMultiStep && localSettings.showProgress && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Step {currentStep + 1} of {totalSteps}
                    </span>
                    <span className="text-muted-foreground">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <Progress
                    className="h-2"
                    style={{
                      backgroundColor: colors.border || undefined,
                    }}
                    value={progress}
                  />
                </div>
              )}

              {/* Social Media Icons - Header */}
              {localSettings.branding?.socialMedia?.enabled &&
                localSettings.branding.socialMedia.platforms &&
                (localSettings.branding.socialMedia.position === "header" ||
                  localSettings.branding.socialMedia.position === "both") && (
                  <div className="flex justify-center">
                    <SocialMediaIcons
                      className="justify-center"
                      iconSize={
                        localSettings.branding.socialMedia.iconSize || "md"
                      }
                      platforms={localSettings.branding.socialMedia.platforms}
                    />
                  </div>
                )}

              {/* Form Header */}
              {!localSettings.hideHeader && (
                <div className="flex flex-col gap-3 text-left">
                  <h1 className="font-semibold text-2xl">
                    {getPublicFormTitle(schema)}
                  </h1>
                  {((schema as any).description ||
                    localSettings.description) && (
                    <p className="text-muted-foreground">
                      {(schema as any).description || localSettings.description}
                    </p>
                  )}
                </div>
              )}

              {/* Form Content */}
              <div className="flex flex-col gap-6">
                {/* Current Block Fields */}
                {schema.blocks && schema.blocks.length > 0 && (
                  <div className="flex flex-col gap-4">
                    {schema.blocks[currentStep]?.fields.map((field) => (
                      <div key={field.id}>
                        <FormFieldRenderer
                          error=""
                          field={field}
                          onChange={() => {}} // Preview mode - no changes
                          value=""
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Form Navigation/Submit */}
                <div className="flex flex-col gap-4">
                  {isMultiStep ? (
                    <div className="flex justify-between gap-4">
                      <Button
                        aria-label="Previous step"
                        className="flex-1"
                        disabled
                        style={{
                          borderColor: colors.border || undefined,
                          color: colors.text || undefined,
                        }}
                        variant="outline"
                      >
                        Previous
                      </Button>
                      <Button
                        aria-label="Next step"
                        className="flex-1"
                        disabled
                        style={{
                          backgroundColor: colors.primary || "#2563eb",
                          borderColor: colors.primary || "#2563eb",
                          color: "#ffffff",
                        }}
                      >
                        Next
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <Button
                        aria-label="Submit form"
                        disabled
                        style={{
                          backgroundColor: colors.primary || "#2563eb",
                          borderColor: colors.primary || "#2563eb",
                          color: "#ffffff",
                        }}
                      >
                        {localSettings.submitText || "Submit Form"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Footer Content */}
            <div
              className="flex flex-col gap-4 text-center"
              style={{
                color: colors.text || undefined,
                fontFamily: typography.fontFamily
                  ? `"${typography.fontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
                  : undefined,
              }}
            >
              {/* Social Media Icons - Footer */}
              {localSettings.branding?.socialMedia?.enabled &&
                localSettings.branding.socialMedia.platforms &&
                (localSettings.branding.socialMedia.position === "footer" ||
                  localSettings.branding.socialMedia.position === "both") && (
                  <SocialMediaIcons
                    className="justify-center"
                    iconSize={
                      localSettings.branding.socialMedia.iconSize || "md"
                    }
                    platforms={localSettings.branding.socialMedia.platforms}
                  />
                )}

              {/* Ikiform Branding */}
              {Boolean(
                localSettings.branding &&
                  (localSettings.branding as any).showIkiformBranding !== false
              ) && (
                <p className="text-muted-foreground text-sm">
                  Powered by{" "}
                  <span className="font-medium text-foreground underline">
                    Ikiform
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
