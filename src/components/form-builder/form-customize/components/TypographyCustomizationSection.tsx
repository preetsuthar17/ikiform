"use client";

import { Type } from "lucide-react";
import {
  FONT_SIZE_OPTIONS,
  FONT_WEIGHT_OPTIONS,
} from "@/components/form-builder/form-settings-modal/constants";
import type { LocalSettings } from "@/components/form-builder/form-settings-modal/types";
import { Card, CardContent } from "@/components/ui/card";
import { GoogleFontPicker } from "@/components/ui/google-font-picker";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    return index >= 0 ? index : 1; // Default to "base" (index 2)
  };

  const getFontSizeFromSlider = (value: number) =>
    FONT_SIZE_OPTIONS[
      Math.max(0, Math.min(value, FONT_SIZE_OPTIONS.length - 1))
    ].value;

  const getFontWeightSliderValue = (weight: string) => {
    const index = FONT_WEIGHT_OPTIONS.findIndex(
      (option) => option.value === weight
    );
    return index >= 0 ? index : 1; // Default to "normal" (index 1)
  };

  const getFontWeightFromSlider = (value: number) =>
    FONT_WEIGHT_OPTIONS[
      Math.max(0, Math.min(value, FONT_WEIGHT_OPTIONS.length - 1))
    ].value;

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
    <div className="flex flex-col gap-4">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Type className="size-4 text-primary" />
          <h2 className="font-semibold text-lg">Typography Settings</h2>
        </div>
        <p className="text-muted-foreground text-xs">
          Customize fonts and text styling
        </p>
      </div>

      <ScrollArea className="max-h-[calc(100vh-200px)]">
        <div className="flex flex-col gap-4">
          <Card className="p-4 shadow-none">
            <CardContent className="flex flex-col gap-3 p-0">
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
            </CardContent>
          </Card>

          <Card className="p-4 shadow-none">
            <CardContent className="flex flex-col gap-3 p-0">
              <Label className="font-medium" id="font-size-label">
                Font Size
              </Label>
              <div className="px-2">
                <Slider
                  aria-labelledby="font-size-label"
                  max={FONT_SIZE_OPTIONS.length - 1}
                  min={0}
                  onValueChange={handleFontSizeChange}
                  step={1}
                  value={[getFontSizeSliderValue(fontSize)]}
                />
              </div>
              <p className="text-muted-foreground text-xs">
                Selected: {(() => {
                  const idx = getFontSizeSliderValue(fontSize);
                  const opt = FONT_SIZE_OPTIONS[idx];
                  return opt ? `${opt.label} (${opt.description})` : "";
                })()}
              </p>
            </CardContent>
          </Card>

          <Card className="p-4 shadow-none">
            <CardContent className="flex flex-col gap-3 p-0">
              <Label className="font-medium" id="font-weight-label">
                Font Weight
              </Label>
              <div className="px-2">
                <Slider
                  aria-labelledby="font-weight-label"
                  max={FONT_WEIGHT_OPTIONS.length - 1}
                  min={0}
                  onValueChange={handleFontWeightChange}
                  step={1}
                  value={[getFontWeightSliderValue(fontWeight)]}
                />
              </div>
              <p className="text-muted-foreground text-xs">
                Selected: {(() => {
                  const idx = getFontWeightSliderValue(fontWeight);
                  const opt = FONT_WEIGHT_OPTIONS[idx];
                  return opt ? `${opt.label} (${opt.description})` : "";
                })()}
              </p>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
