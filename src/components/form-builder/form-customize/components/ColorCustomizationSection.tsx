"use client";

import { Paintbrush } from "lucide-react";
// Removed PREDEFINED_COLORS and TRANSPARENT_PATTERN imports as color palettes are removed
import type { LocalSettings } from "@/components/form-builder/form-settings-modal/types";
import { EnhancedColorPicker } from "@/components/ui/enhanced-color-picker";
import { Separator } from "@/components/ui/separator";

interface ColorCustomizationSectionProps {
  localSettings: LocalSettings;
  updateSettings: (updates: Partial<LocalSettings>) => void;
}

export function ColorCustomizationSection({
  localSettings,
  updateSettings,
}: ColorCustomizationSectionProps) {
  const backgroundColor = localSettings.colors?.background || "#ffffff";
  const textColor = localSettings.colors?.text || "#000000";
  const primaryColor = localSettings.colors?.primary || "#2563eb";
  const borderColor = localSettings.colors?.border || "#e2e8f0";
  const websiteBackgroundColor =
    localSettings.colors?.websiteBackground || "#ffffff";

  const handleBackgroundColorChange = (color: string) => {
    updateSettings({
      colors: {
        ...localSettings.colors,
        background: color,
      },
    });
  };

  const handleTextColorChange = (color: string) => {
    updateSettings({
      colors: {
        ...localSettings.colors,
        text: color,
      },
    });
  };

  const handlePrimaryColorChange = (color: string) => {
    updateSettings({
      colors: {
        ...localSettings.colors,
        primary: color,
      },
    });
  };

  const handleBorderColorChange = (color: string) => {
    updateSettings({
      colors: {
        ...localSettings.colors,
        border: color,
      },
    });
  };

  const handleWebsiteBackgroundColorChange = (color: string) => {
    updateSettings({
      colors: {
        ...localSettings.colors,
        websiteBackground: color,
      },
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Paintbrush className="size-4 text-primary" />
          <h2 className="font-semibold text-lg">Color Settings</h2>
        </div>
        <p className="text-muted-foreground text-xs">
          Customize colors and theme
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Background Color */}
        <div className="flex flex-col gap-4">
          <EnhancedColorPicker
            allowTransparent={true}
            label="Background Color"
            onChange={handleBackgroundColorChange}
            value={backgroundColor}
          />
          <p className="text-muted-foreground text-xs">
            Sets the background color of the form container
          </p>
        </div>

        <Separator />

        {/* Text Color */}
        <div className="flex flex-col gap-4">
          <EnhancedColorPicker
            allowTransparent={false}
            label="Text Color"
            onChange={handleTextColorChange}
            value={textColor}
          />
          <p className="text-muted-foreground text-xs">
            Sets the color of all text elements in the form
          </p>
        </div>

        <Separator />

        {/* Primary Color */}
        <div className="flex flex-col gap-4">
          <EnhancedColorPicker
            allowTransparent={false}
            label="Primary Color (Buttons & Accent)"
            onChange={handlePrimaryColorChange}
            value={primaryColor}
          />
          <p className="text-muted-foreground text-xs">
            Sets the color for buttons, focus states, and accent elements
          </p>
        </div>

        <Separator />

        {/* Border Color */}
        <div className="flex flex-col gap-4">
          <EnhancedColorPicker
            allowTransparent={true}
            label="Border Color"
            onChange={handleBorderColorChange}
            value={borderColor}
          />
          <p className="text-muted-foreground text-xs">
            Sets the color for input field borders and dividers
          </p>
        </div>

        <Separator />

        {/* Website Background Color */}
        <div className="flex flex-col gap-4">
          <EnhancedColorPicker
            allowTransparent={false}
            label="Website Background Color"
            onChange={handleWebsiteBackgroundColorChange}
            value={websiteBackgroundColor}
          />
          <p className="text-muted-foreground text-xs">
            Sets the background color of the entire website/page
          </p>
        </div>
      </div>
    </div>
  );
}
