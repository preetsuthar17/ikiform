"use client";

import { Monitor, Ruler } from "lucide-react";
import React from "react";
import {
  DEFAULT_FORM_DESIGN,
  FORM_BORDER_RADIUS_OPTIONS,
  FORM_PADDING_OPTIONS,
  FORM_WIDTH_OPTIONS,
} from "@/components/form-builder/form-settings-modal/constants";
import type { LocalSettings } from "@/components/form-builder/form-settings-modal/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input-base";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioItem } from "@/components/ui/radio";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const FORM_MARGIN_OPTIONS = [
  { value: "none", label: "None", preview: "", description: "No margin" },
  { value: "sm", label: "Small", preview: "", description: "8px" },
  { value: "md", label: "Medium", preview: "", description: "16px" },
  { value: "lg", label: "Large", preview: "", description: "32px" },
];

interface LayoutCustomizationSectionProps {
  localSettings: LocalSettings;
  updateSettings: (updates: Partial<LocalSettings>) => void;
}

export function LayoutCustomizationSection({
  localSettings,
  updateSettings,
}: LayoutCustomizationSectionProps) {
  const currentWidth =
    localSettings.layout?.maxWidth || DEFAULT_FORM_DESIGN.maxWidth;
  const currentPadding =
    localSettings.layout?.padding || DEFAULT_FORM_DESIGN.padding;
  const currentMargin = localSettings.layout?.margin || "none";
  const currentBorderRadius =
    localSettings.layout?.borderRadius || DEFAULT_FORM_DESIGN.borderRadius;

  const customWidth = localSettings.layout?.customWidth || "600px";

  const handleBorderRadiusChange = (value: string) => {
    updateSettings({
      layout: {
        ...localSettings.layout,
        borderRadius: value as "none" | "sm" | "md" | "lg" | "xl",
      },
    });
  };

  const handleWidthChange = (value: string) => {
    updateSettings({
      layout: {
        ...localSettings.layout,
        maxWidth: value as "sm" | "md" | "lg" | "xl" | "full" | "custom",
      },
    });
  };

  const handleCustomWidthChange = (value: string) => {
    updateSettings({
      layout: {
        ...localSettings.layout,
        customWidth: value,
      },
    });
  };

  const handlePaddingChange = (value: string) => {
    updateSettings({
      layout: {
        ...localSettings.layout,
        padding: value as "none" | "sm" | "md" | "lg",
      },
    });
  };

  const handleMarginChange = (value: string) => {
    updateSettings({
      layout: {
        ...localSettings.layout,
        margin: value as "none" | "sm" | "md" | "lg",
      },
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Monitor className="h-4 w-4 text-primary" />
          <h2 className="font-semibold text-lg">Layout Settings</h2>
        </div>
        <p className="text-muted-foreground text-xs">
          Configure spacing and structure
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Progress Bar Toggle */}
        <div className="flex items-center gap-3">
          <Switch
            checked={!!localSettings.showProgress}
            id="show-progress-toggle"
            onCheckedChange={(checked) =>
              updateSettings({ showProgress: checked })
            }
            size="sm"
          />
          <Label
            className="cursor-pointer select-none"
            htmlFor="show-progress-toggle"
          >
            Show Progress Bar
          </Label>
        </div>

        <Separator />

        {/* Form Width */}
        <div className="flex flex-col gap-4">
          <Label className="flex items-center gap-2 font-medium">
            <Ruler className="h-4 w-4" />
            Form Width
          </Label>
          <div className="flex flex-wrap gap-2">
            {FORM_WIDTH_OPTIONS.map((option) => (
              <Button
                className={`font-medium text-sm transition-all ${
                  currentWidth === option.value
                    ? "bg-primary text-primary-foreground"
                    : "border bg-transparent text-foreground hover:bg-accent"
                }`}
                key={option.value}
                onClick={() => handleWidthChange(option.value)}
                size="sm"
                type="button"
              >
                {option.label}
              </Button>
            ))}
          </div>
          {currentWidth === "custom" && (
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground text-sm">
                Custom Width (e.g., 600px, 80%, 50rem)
              </Label>
              <Input
                className="max-w-xs"
                onChange={(e) => handleCustomWidthChange(e.target.value)}
                placeholder="Enter custom width"
                value={customWidth}
              />
            </div>
          )}
        </div>

        <Separator />

        {/* Form Padding */}
        <div className="flex flex-col gap-4">
          <Label className="font-medium">Internal Padding</Label>
          <div className="flex flex-wrap gap-2">
            {FORM_PADDING_OPTIONS.map((option) => (
              <Button
                className={`font-medium text-sm transition-all ${
                  currentPadding === option.value
                    ? "bg-primary text-primary-foreground"
                    : "border bg-transparent text-foreground hover:bg-accent"
                }`}
                key={option.value}
                onClick={() => handlePaddingChange(option.value)}
                size="sm"
                type="button"
              >
                {option.label}
              </Button>
            ))}
          </div>
          <p className="text-muted-foreground text-xs">
            Controls the space inside the form container
          </p>
        </div>

        <Separator />

        {/* Form Margin */}
        <div className="flex flex-col gap-4">
          <Label className="font-medium">External Margin</Label>
          <div className="flex flex-wrap gap-2">
            {FORM_MARGIN_OPTIONS.map((option) => (
              <Button
                className={`font-medium text-sm transition-all ${
                  currentMargin === option.value
                    ? "bg-primary text-primary-foreground"
                    : "border bg-transparent text-foreground hover:bg-accent"
                }`}
                key={option.value}
                onClick={() => handleMarginChange(option.value)}
                size="sm"
                type="button"
              >
                {option.label}
              </Button>
            ))}
          </div>
          <p className="text-muted-foreground text-xs">
            Controls the space around the form container
          </p>
        </div>

        <Separator />

        {/* Border Radius */}
        <div className="flex flex-col gap-4">
          <Label className="font-medium">Corner Radius</Label>
          <div className="flex flex-wrap gap-2">
            {FORM_BORDER_RADIUS_OPTIONS.map((option) => (
              <Button
                className={`font-medium text-sm transition-all ${
                  currentBorderRadius === option.value
                    ? "bg-primary text-primary-foreground"
                    : "border bg-transparent text-foreground hover:bg-accent"
                }`}
                key={option.value}
                onClick={() => handleBorderRadiusChange(option.value)}
                size="sm"
                type="button"
              >
                {option.label}
              </Button>
            ))}
          </div>
          <p className="text-muted-foreground text-xs">
            Controls how rounded the form corners appear
          </p>
        </div>
      </div>
    </div>
  );
}
