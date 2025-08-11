"use client";

import React from "react";
import { Paintbrush } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { EnhancedColorPicker } from "@/components/ui/enhanced-color-picker";
import type { LocalSettings } from "@/components/form-builder/form-settings-modal/types";
import { PREDEFINED_COLORS, TRANSPARENT_PATTERN } from "@/components/form-builder/form-settings-modal/constants";

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

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Paintbrush className="h-4 w-4 text-primary" />
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
              value={backgroundColor}
              onChange={handleBackgroundColorChange}
              label="Background Color"
              allowTransparent={true}
            />
            <div className="flex flex-col gap-2">
              <Label className="text-xs text-muted-foreground">Quick Colors</Label>
              <div className="flex flex-wrap gap-2">
                {PREDEFINED_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`h-8 w-8 rounded-md border-2 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                      backgroundColor === color
                        ? "border-ring ring-2 ring-ring ring-offset-2"
                        : "border-border"
                    }`}
                    style={{
                      backgroundColor: color === "transparent" ? undefined : color,
                      backgroundImage: color === "transparent" ? `url("${TRANSPARENT_PATTERN}")` : undefined,
                    }}
                    onClick={() => handleBackgroundColorChange(color)}
                    title={color === "transparent" ? "Transparent" : color}
                  />
                ))}
              </div>
            </div>
            <p className="text-muted-foreground text-xs">
              Sets the background color of the form container
            </p>
          </div>

          <Separator />

          {/* Text Color */}
          <div className="flex flex-col gap-4">
            <EnhancedColorPicker
              value={textColor}
              onChange={handleTextColorChange}
              label="Text Color"
              allowTransparent={false}
            />
            <div className="flex flex-col gap-2">
              <Label className="text-xs text-muted-foreground">Quick Colors</Label>
              <div className="flex flex-wrap gap-2">
                {PREDEFINED_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`h-8 w-8 rounded-md border-2 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                      textColor === color
                        ? "border-ring ring-2 ring-ring ring-offset-2"
                        : "border-border"
                    }`}
                    style={{
                      backgroundColor: color === "transparent" ? undefined : color,
                      backgroundImage: color === "transparent" ? `url("${TRANSPARENT_PATTERN}")` : undefined,
                    }}
                    onClick={() => handleTextColorChange(color)}
                    title={color === "transparent" ? "Transparent" : color}
                  />
                ))}
              </div>
            </div>
            <p className="text-muted-foreground text-xs">
              Sets the color of all text elements in the form
            </p>
          </div>

          <Separator />

          {/* Primary Color */}
          <div className="flex flex-col gap-4">
            <EnhancedColorPicker
              value={primaryColor}
              onChange={handlePrimaryColorChange}
              label="Primary Color (Buttons & Accent)"
              allowTransparent={false}
            />
            <div className="flex flex-col gap-2">
              <Label className="text-xs text-muted-foreground">Quick Colors</Label>
              <div className="flex flex-wrap gap-2">
                {PREDEFINED_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`h-8 w-8 rounded-md border-2 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                      primaryColor === color
                        ? "border-ring ring-2 ring-ring ring-offset-2"
                        : "border-border"
                    }`}
                    style={{
                      backgroundColor: color === "transparent" ? undefined : color,
                      backgroundImage: color === "transparent" ? `url("${TRANSPARENT_PATTERN}")` : undefined,
                    }}
                    onClick={() => handlePrimaryColorChange(color)}
                    title={color === "transparent" ? "Transparent" : color}
                  />
                ))}
              </div>
            </div>
            <p className="text-muted-foreground text-xs">
              Sets the color for buttons, focus states, and accent elements
            </p>
          </div>

          <Separator />

          {/* Border Color */}
          <div className="flex flex-col gap-4">
            <EnhancedColorPicker
              value={borderColor}
              onChange={handleBorderColorChange}
              label="Border Color"
              allowTransparent={true}
            />
            <div className="flex flex-col gap-2">
              <Label className="text-xs text-muted-foreground">Quick Colors</Label>
              <div className="flex flex-wrap gap-2">
                {PREDEFINED_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`h-8 w-8 rounded-md border-2 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                      borderColor === color
                        ? "border-ring ring-2 ring-ring ring-offset-2"
                        : "border-border"
                    }`}
                    style={{
                      backgroundColor: color === "transparent" ? undefined : color,
                      backgroundImage: color === "transparent" ? `url("${TRANSPARENT_PATTERN}")` : undefined,
                    }}
                    onClick={() => handleBorderColorChange(color)}
                    title={color === "transparent" ? "Transparent" : color}
                  />
                ))}
              </div>
            </div>
            <p className="text-muted-foreground text-xs">
              Sets the color for input field borders and dividers
            </p>
          </div>
      </div>
    </div>
  );
}
