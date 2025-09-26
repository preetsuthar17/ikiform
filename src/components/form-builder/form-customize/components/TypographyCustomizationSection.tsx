"use client";

import { Type } from "lucide-react";
import React from "react";
import {
  FONT_SIZE_OPTIONS,
  FONT_WEIGHT_OPTIONS,
} from "@/components/form-builder/form-settings-modal/constants";
import type { LocalSettings } from "@/components/form-builder/form-settings-modal/types";
import { GoogleFontPicker } from "@/components/ui/google-font-picker";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  generateFontPreviewStyles,
  loadGoogleFont,
} from "@/lib/utils/google-fonts";

interface TypographyCustomizationSectionProps {
  localSettings: LocalSettings;
  updateSettings: (updates: Partial<LocalSettings>) => void;
}

export function TypographyCustomizationSection({
  localSettings,
  updateSettings,
}: TypographyCustomizationSectionProps) {
  const fontFamily = localSettings.typography?.fontFamily || "Inter";
  const fontSize = localSettings.typography?.fontSize || "base";
  const fontWeight = localSettings.typography?.fontWeight || "normal";

  // Helper functions to convert between slider values and font options
  const getFontSizeSliderValue = (size: string) => {
    const index = FONT_SIZE_OPTIONS.findIndex(
      (option) => option.value === size
    );
    return index >= 0 ? index : 2; // Default to "base" (index 2)
  };

  const getFontSizeFromSlider = (value: number) => {
    return FONT_SIZE_OPTIONS[
      Math.max(0, Math.min(value, FONT_SIZE_OPTIONS.length - 1))
    ].value;
  };

  const getFontWeightSliderValue = (weight: string) => {
    const index = FONT_WEIGHT_OPTIONS.findIndex(
      (option) => option.value === weight
    );
    return index >= 0 ? index : 1; // Default to "normal" (index 1)
  };

  const getFontWeightFromSlider = (value: number) => {
    return FONT_WEIGHT_OPTIONS[
      Math.max(0, Math.min(value, FONT_WEIGHT_OPTIONS.length - 1))
    ].value;
  };

  const handleFontFamilyChange = (value: string) => {
    console.log("Font family changed to:", value);

    // Load the font before applying it
    if (typeof window !== "undefined") {
      loadGoogleFont(value)
        .then(() => console.log("Font loaded successfully:", value))
        .catch((error) => console.error("Failed to load font:", value, error));
    }

    updateSettings({
      typography: {
        ...localSettings.typography,
        fontFamily: value,
      },
    });
  };

  const handleFontSizeChange = (values: number[]) => {
    const newSize = getFontSizeFromSlider(values[0]);
    updateSettings({
      typography: {
        ...localSettings.typography,
        fontSize: newSize as "xs" | "sm" | "base" | "lg" | "xl",
      },
    });
  };

  const handleFontWeightChange = (values: number[]) => {
    const newWeight = getFontWeightFromSlider(values[0]);
    updateSettings({
      typography: {
        ...localSettings.typography,
        fontWeight: newWeight as
          | "light"
          | "normal"
          | "medium"
          | "semibold"
          | "bold",
      },
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Type className="h-4 w-4 text-primary" />
          <h2 className="font-semibold text-lg">Typography Settings</h2>
        </div>
        <p className="text-muted-foreground text-xs">
          Customize fonts and text styling
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Font Family */}
        <div className="flex flex-col gap-4">
          <GoogleFontPicker
            label="Font Family"
            onChange={handleFontFamilyChange}
            placeholder="Select a Google Font..."
            showPreview={true}
            value={fontFamily}
          />
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <Label className="mb-2 block text-muted-foreground text-xs">
              Font Preview
            </Label>
            <p
              className="text-lg"
              style={generateFontPreviewStyles(fontFamily)}
            >
              The quick brown fox jumps over the lazy dog
            </p>
            <p
              className="mt-2 text-muted-foreground text-sm"
              style={generateFontPreviewStyles(fontFamily)}
            >
              Sample form text with numbers 1234567890
            </p>
          </div>
          <p className="text-muted-foreground text-xs">
            Choose from hundreds of Google Fonts. The font will be loaded
            automatically.
          </p>
        </div>

        <Separator />

        {/* Font Size */}
        <div className="flex flex-col gap-4">
          <Label className="font-medium">Font Size</Label>
          <div className="px-2">
            <Slider
              formatValue={(value) => {
                const option = FONT_SIZE_OPTIONS[value];
                return option ? `${option.label} (${option.description})` : "";
              }}
              label="Font Size"
              max={FONT_SIZE_OPTIONS.length - 1}
              min={0}
              onValueChange={handleFontSizeChange}
              showValue={true}
              step={1}
              value={[getFontSizeSliderValue(fontSize)]}
            />
          </div>
        </div>

        <Separator />

        {/* Font Weight */}
        <div className="flex flex-col gap-4">
          <Label className="font-medium">Font Weight</Label>
          <div className="px-2">
            <Slider
              formatValue={(value) => {
                const option = FONT_WEIGHT_OPTIONS[value];
                return option ? `${option.label} (${option.description})` : "";
              }}
              label="Font Weight"
              max={FONT_WEIGHT_OPTIONS.length - 1}
              min={0}
              onValueChange={handleFontWeightChange}
              showValue={true}
              step={1}
              value={[getFontWeightSliderValue(fontWeight)]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
