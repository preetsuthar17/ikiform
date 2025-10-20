"use client";

import { Monitor, Ruler } from "lucide-react";
import {
  DEFAULT_FORM_DESIGN,
  FORM_BORDER_RADIUS_OPTIONS,
  FORM_PADDING_OPTIONS,
  FORM_WIDTH_OPTIONS,
} from "@/components/form-builder/form-settings-modal/constants";
import type { LocalSettings } from "@/components/form-builder/form-settings-modal/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
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

  // Helper functions to convert between slider values and layout options
  const getWidthSliderValue = (width: string) => {
    const index = FORM_WIDTH_OPTIONS.findIndex(
      (option) => option.value === width
    );
    return index >= 0 ? index : 1; // Default to "md" (index 1)
  };

  const getWidthFromSlider = (value: number) =>
    FORM_WIDTH_OPTIONS[
      Math.max(0, Math.min(value, FORM_WIDTH_OPTIONS.length - 1))
    ].value;

  const getPaddingSliderValue = (padding: string) => {
    const index = FORM_PADDING_OPTIONS.findIndex(
      (option) => option.value === padding
    );
    return index >= 0 ? index : 2; // Default to "md" (index 2)
  };

  const getPaddingFromSlider = (value: number) =>
    FORM_PADDING_OPTIONS[
      Math.max(0, Math.min(value, FORM_PADDING_OPTIONS.length - 1))
    ].value;

  const getMarginSliderValue = (margin: string) => {
    const index = FORM_MARGIN_OPTIONS.findIndex(
      (option) => option.value === margin
    );
    return index >= 0 ? index : 0; // Default to "none" (index 0)
  };

  const getMarginFromSlider = (value: number) =>
    FORM_MARGIN_OPTIONS[
      Math.max(0, Math.min(value, FORM_MARGIN_OPTIONS.length - 1))
    ].value;

  const getBorderRadiusSliderValue = (radius: string) => {
    const index = FORM_BORDER_RADIUS_OPTIONS.findIndex(
      (option) => option.value === radius
    );
    return index >= 0 ? index : 2; // Default to "md" (index 2)
  };

  const getBorderRadiusFromSlider = (value: number) =>
    FORM_BORDER_RADIUS_OPTIONS[
      Math.max(0, Math.min(value, FORM_BORDER_RADIUS_OPTIONS.length - 1))
    ].value;

  const handleBorderRadiusChange = (values: number[]) => {
    const newRadius = getBorderRadiusFromSlider(values[0]);
    updateSettings({
      layout: {
        ...localSettings.layout,
        borderRadius: newRadius as "none" | "sm" | "md" | "lg" | "xl",
      },
    });
  };

  const handleWidthChange = (values: number[]) => {
    const newWidth = getWidthFromSlider(values[0]);
    updateSettings({
      layout: {
        ...localSettings.layout,
        maxWidth: newWidth as "sm" | "md" | "lg" | "xl" | "full" | "custom",
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

  const handlePaddingChange = (values: number[]) => {
    const newPadding = getPaddingFromSlider(values[0]);
    updateSettings({
      layout: {
        ...localSettings.layout,
        padding: newPadding as "none" | "sm" | "md" | "lg",
      },
    });
  };

  const handleMarginChange = (values: number[]) => {
    const newMargin = getMarginFromSlider(values[0]);
    updateSettings({
      layout: {
        ...localSettings.layout,
        margin: newMargin as "none" | "sm" | "md" | "lg",
      },
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Monitor className="size-4 text-primary" />
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
            <Ruler className="size-4" />
            Form Width
          </Label>
          <div className="px-2">
            <Slider
              formatValue={(value) => {
                const option = FORM_WIDTH_OPTIONS[value];
                return option ? `${option.label} (${option.description})` : "";
              }}
              label="Form Width"
              max={FORM_WIDTH_OPTIONS.length - 1}
              min={0}
              onValueChange={handleWidthChange}
              showValue={true}
              step={1}
              value={[getWidthSliderValue(currentWidth)]}
            />
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
          <p className="text-muted-foreground text-xs">
            Controls the maximum width of the form container
          </p>
        </div>

        <Separator />

        {/* Form Padding */}
        <div className="flex flex-col gap-4">
          <Label className="font-medium">Internal Padding</Label>
          <div className="px-2">
            <Slider
              formatValue={(value) => {
                const option = FORM_PADDING_OPTIONS[value];
                return option ? `${option.label} (${option.description})` : "";
              }}
              label="Internal Padding"
              max={FORM_PADDING_OPTIONS.length - 1}
              min={0}
              onValueChange={handlePaddingChange}
              showValue={true}
              step={1}
              value={[getPaddingSliderValue(currentPadding)]}
            />
          </div>
          <p className="text-muted-foreground text-xs">
            Controls the space inside the form container
          </p>
        </div>

        <Separator />

        {/* Form Margin */}
        <div className="flex flex-col gap-4">
          <Label className="font-medium">External Margin</Label>
          <div className="px-2">
            <Slider
              formatValue={(value) => {
                const option = FORM_MARGIN_OPTIONS[value];
                return option ? `${option.label} (${option.description})` : "";
              }}
              label="External Margin"
              max={FORM_MARGIN_OPTIONS.length - 1}
              min={0}
              onValueChange={handleMarginChange}
              showValue={true}
              step={1}
              value={[getMarginSliderValue(currentMargin)]}
            />
          </div>
          <p className="text-muted-foreground text-xs">
            Controls the space around the form container
          </p>
        </div>

        <Separator />

        {/* Border Radius */}
        <div className="flex flex-col gap-4">
          <Label className="font-medium">Corner Radius</Label>
          <div className="px-2">
            <Slider
              formatValue={(value) => {
                const option = FORM_BORDER_RADIUS_OPTIONS[value];
                return option ? `${option.label} (${option.description})` : "";
              }}
              label="Corner Radius"
              max={FORM_BORDER_RADIUS_OPTIONS.length - 1}
              min={0}
              onValueChange={handleBorderRadiusChange}
              showValue={true}
              step={1}
              value={[getBorderRadiusSliderValue(currentBorderRadius)]}
            />
          </div>
          <p className="text-muted-foreground text-xs">
            Controls how rounded the form corners appear
          </p>
        </div>
      </div>
    </div>
  );
}
