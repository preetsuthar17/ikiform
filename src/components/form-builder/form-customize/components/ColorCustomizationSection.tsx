"use client";

import { Paintbrush } from "lucide-react";
import React from "react";
import {
  PREDEFINED_COLORS,
  TRANSPARENT_PATTERN,
} from "@/components/form-builder/form-settings-modal/constants";
import type { LocalSettings } from "@/components/form-builder/form-settings-modal/types";
import { Card } from "@/components/ui/card";
import { EnhancedColorPicker } from "@/components/ui/enhanced-color-picker";
import { Label } from "@/components/ui/label";
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
            allowTransparent={true}
            label="Background Color"
            onChange={handleBackgroundColorChange}
            value={backgroundColor}
          />
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground text-xs">
              Quick Colors
            </Label>
            <div className="flex flex-wrap gap-2">
              {PREDEFINED_COLORS.map((color) => (
                <button
                  className={`h-8 w-8 rounded-md border-2 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                    backgroundColor === color
                      ? "border-ring ring-2 ring-ring ring-offset-2"
                      : "border-border"
                  }`}
                  key={color}
                  onClick={() => handleBackgroundColorChange(color)}
                  style={{
                    backgroundColor:
                      color === "transparent" ? undefined : color,
                    backgroundImage:
                      color === "transparent"
                        ? `url("${TRANSPARENT_PATTERN}")`
                        : undefined,
                  }}
                  title={color === "transparent" ? "Transparent" : color}
                  type="button"
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
            allowTransparent={false}
            label="Text Color"
            onChange={handleTextColorChange}
            value={textColor}
          />
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground text-xs">
              Quick Colors
            </Label>
            <div className="flex flex-wrap gap-2">
              {PREDEFINED_COLORS.map((color) => (
                <button
                  className={`h-8 w-8 rounded-md border-2 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                    textColor === color
                      ? "border-ring ring-2 ring-ring ring-offset-2"
                      : "border-border"
                  }`}
                  key={color}
                  onClick={() => handleTextColorChange(color)}
                  style={{
                    backgroundColor:
                      color === "transparent" ? undefined : color,
                    backgroundImage:
                      color === "transparent"
                        ? `url("${TRANSPARENT_PATTERN}")`
                        : undefined,
                  }}
                  title={color === "transparent" ? "Transparent" : color}
                  type="button"
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
            allowTransparent={false}
            label="Primary Color (Buttons & Accent)"
            onChange={handlePrimaryColorChange}
            value={primaryColor}
          />
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground text-xs">
              Quick Colors
            </Label>
            <div className="flex flex-wrap gap-2">
              {PREDEFINED_COLORS.map((color) => (
                <button
                  className={`h-8 w-8 rounded-md border-2 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                    primaryColor === color
                      ? "border-ring ring-2 ring-ring ring-offset-2"
                      : "border-border"
                  }`}
                  key={color}
                  onClick={() => handlePrimaryColorChange(color)}
                  style={{
                    backgroundColor:
                      color === "transparent" ? undefined : color,
                    backgroundImage:
                      color === "transparent"
                        ? `url("${TRANSPARENT_PATTERN}")`
                        : undefined,
                  }}
                  title={color === "transparent" ? "Transparent" : color}
                  type="button"
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
            allowTransparent={true}
            label="Border Color"
            onChange={handleBorderColorChange}
            value={borderColor}
          />
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground text-xs">
              Quick Colors
            </Label>
            <div className="flex flex-wrap gap-2">
              {PREDEFINED_COLORS.map((color) => (
                <button
                  className={`h-8 w-8 rounded-md border-2 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                    borderColor === color
                      ? "border-ring ring-2 ring-ring ring-offset-2"
                      : "border-border"
                  }`}
                  key={color}
                  onClick={() => handleBorderColorChange(color)}
                  style={{
                    backgroundColor:
                      color === "transparent" ? undefined : color,
                    backgroundImage:
                      color === "transparent"
                        ? `url("${TRANSPARENT_PATTERN}")`
                        : undefined,
                  }}
                  title={color === "transparent" ? "Transparent" : color}
                  type="button"
                />
              ))}
            </div>
          </div>
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
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground text-xs">
              Quick Colors
            </Label>
            <div className="flex flex-wrap gap-2">
              {PREDEFINED_COLORS.map((color) => (
                <button
                  className={`h-8 w-8 rounded-md border-2 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                    websiteBackgroundColor === color
                      ? "border-ring ring-2 ring-ring ring-offset-2"
                      : "border-border"
                  }`}
                  key={color}
                  onClick={() => handleWebsiteBackgroundColorChange(color)}
                  style={{
                    backgroundColor:
                      color === "transparent" ? undefined : color,
                    backgroundImage:
                      color === "transparent"
                        ? `url("${TRANSPARENT_PATTERN}")`
                        : undefined,
                  }}
                  title={color === "transparent" ? "Transparent" : color}
                  type="button"
                />
              ))}
            </div>
          </div>
          <p className="text-muted-foreground text-xs">
            Sets the background color of the entire website/page
          </p>
        </div>
      </div>
    </div>
  );
}
