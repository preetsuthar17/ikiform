"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import type { LocalSettings } from "@/components/form-builder/form-settings-modal/types";
import type { FormSchema } from "@/lib/database";
import { 
  getMaxWidthValue, 
  getPaddingValue, 
  getMarginValue, 
  getBorderRadiusValue 
} from "@/lib/utils/form-styles";
import { FormFieldRenderer } from "@/components/form-builder/form-field-renderer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { SocialMediaIcons } from "@/components/ui/social-media-icons";
import Link from "next/link";
import { Badge } from "@/components/ui";

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
  const formWidth = layout.maxWidth === "custom" && layout.customWidth 
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

  // Set CSS custom properties for the preview
  React.useEffect(() => {
    if (typeof window === "undefined") return;

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

    return () => {
      // Cleanup - restore defaults
      root.style.setProperty("--radius", "0.7rem");
      root.style.setProperty("--card-radius", "1rem");
      root.style.removeProperty("--form-custom-width");
      root.style.removeProperty("--form-primary-color");
      root.style.removeProperty("--form-text-color");
      root.style.removeProperty("--form-background-color");
      root.style.removeProperty("--form-border-color");
    };
  }, [layout, colors]);

  // Create a modified schema with current settings
  const previewSchema = {
    ...schema,
    settings: localSettings
  };

  const isMultiStep = schema.settings.multiStep || schema.blocks?.length > 1;
  const currentStep = 0;
  const totalSteps = schema.blocks?.length || 1;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <Card className={`p-4 ${className}`}>
      <div 
        className={`flex items-center justify-center transition-all duration-200`}
        style={{
          margin: formMargin,
          fontFamily: typography.fontFamily 
            ? `"${typography.fontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
            : undefined,
        }}
      >
        <div 
          className={`flex w-full flex-col gap-8 ikiform-customized ${
            layout.maxWidth === "custom" && layout.customWidth ? 'ikiform-custom-width' : ''
          }`}
          style={{
            maxWidth: formWidth,
            margin: '0 auto',
          }}
        >
          <Card
            className="flex w-full grow flex-col gap-6 rounded-card border-none bg-transparent shadow-none hover:bg-transparent"
            style={{
              backgroundColor: colors.background || undefined,
              borderRadius: formBorderRadius,
              padding: formPadding,
              color: colors.text || undefined,
            }}
            variant="ghost"
          >
            {/* Progress Bar for Multi-step Forms */}
            {isMultiStep && localSettings.showProgress && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Step {currentStep + 1} of {totalSteps}
                  </span>
                  <span className="text-muted-foreground">{Math.round(progress)}%</span>
                </div>
                <Progress 
                  value={progress} 
                  className="h-2"
                  style={{
                    backgroundColor: colors.border || undefined,
                  }}
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
                    iconSize={localSettings.branding.socialMedia.iconSize || "md"}
                    platforms={localSettings.branding.socialMedia.platforms}
                  />
                </div>
              )}

            {/* Form Header */}
            <div className="flex flex-col gap-4 text-left">
              <div className="flex flex-col gap-2">
                <h1 className="font-bold text-2xl">
                  {(schema as any).title || localSettings.title}
                </h1>
                {((schema as any).description || localSettings.description) && (
                  <p className="text-muted-foreground">
                    {(schema as any).description || localSettings.description}
                  </p>
                )}
              </div>
            </div>

            <Separator/>

            {/* Form Content */}
            <div className="flex flex-col gap-6">
              {/* Current Block Fields */}
              {schema.blocks && schema.blocks.length > 0 && (
                <div className="flex flex-col gap-4">
                  {schema.blocks[currentStep]?.fields.map((field) => (
                    <div key={field.id}>
                      <FormFieldRenderer
                        field={field}
                        value=""
                        onChange={() => {}} // Preview mode - no changes
                        error=""

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
                      variant="outline" 
                      disabled
                      className="flex-1"
                      style={{
                        borderColor: colors.border || undefined,
                        color: colors.text || undefined,
                      }}
                    >
                      Previous
                    </Button>
                    <Button 
                      disabled
                      className="flex-1"
                      style={{
                        backgroundColor: colors.primary || '#2563eb',
                        borderColor: colors.primary || '#2563eb',
                        color: '#ffffff',
                      }}
                    >
                      Next
                    </Button>
                  </div>
                ) : (
                  <Button 
                    disabled
                    className="w-fit ml-auto"
                    style={{
                      backgroundColor: colors.primary || '#2563eb',
                      borderColor: colors.primary || '#2563eb',
                      color: '#ffffff',
                    }}
                  >
                    {localSettings.submitText || "Submit Form"}
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Footer Content */}
          <div className="flex flex-col gap-4 text-center" style={{ color: colors.text || undefined }}>
            {/* Social Media Icons - Footer */}
            {localSettings.branding?.socialMedia?.enabled &&
              localSettings.branding.socialMedia.platforms &&
              (localSettings.branding.socialMedia.position === "footer" ||
                localSettings.branding.socialMedia.position === "both") && (
                <SocialMediaIcons
                  className="justify-center"
                  iconSize={localSettings.branding.socialMedia.iconSize || "md"}
                  platforms={localSettings.branding.socialMedia.platforms}
                />
              )}
            
            {/* Ikiform Branding */}
            {Boolean(
              localSettings.branding &&
                (localSettings.branding as any).showIkiformBranding !== false,
            ) && (
              <p className="text-muted-foreground text-sm">
                Powered by{" "}
                <span className="font-medium text-foreground underline">
                  <Link href="https://www.ikiform.com">Ikiform</Link>
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
