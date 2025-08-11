"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input-base";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Palette, Pipette } from "lucide-react";
import { TRANSPARENT_PATTERN } from "@/components/form-builder/form-settings-modal/constants";

interface EnhancedColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  allowTransparent?: boolean;
}

export function EnhancedColorPicker({
  value,
  onChange,
  label,
  allowTransparent = true,
}: EnhancedColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [opacity, setOpacity] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const colorInputRef = useRef<HTMLInputElement>(null);

  // Convert color to hex if needed
  const hexColor = value === "transparent" ? "#ffffff" : value;
  
  // Handle color changes from native picker
  const handleColorChange = (newColor: string) => {
    if (opacity < 100) {
      // Apply opacity
      const alpha = Math.round((opacity / 100) * 255).toString(16).padStart(2, '0');
      onChange(newColor + alpha);
    } else if (brightness !== 100) {
      // Apply brightness
      const brightnessAdjusted = adjustBrightness(newColor, brightness / 100);
      onChange(brightnessAdjusted);
    } else {
      onChange(newColor);
    }
  };

  // Handle opacity changes
  const handleOpacityChange = ([newOpacity]: number[]) => {
    setOpacity(newOpacity);
    if (newOpacity === 0) {
      onChange("transparent");
    } else if (newOpacity === 100) {
      onChange(hexColor);
    } else {
      const alpha = Math.round((newOpacity / 100) * 255).toString(16).padStart(2, '0');
      onChange(hexColor + alpha);
    }
  };

  // Handle brightness changes
  const handleBrightnessChange = ([newBrightness]: number[]) => {
    setBrightness(newBrightness);
    const adjustedColor = adjustBrightness(hexColor, newBrightness / 100);
    onChange(adjustedColor);
  };

  // Adjust brightness of a hex color
  const adjustBrightness = (hex: string, factor: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    const newR = Math.round(Math.min(255, Math.max(0, r * factor)));
    const newG = Math.round(Math.min(255, Math.max(0, g * factor)));
    const newB = Math.round(Math.min(255, Math.max(0, b * factor)));

    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  };

  // Handle eyedropper
  const handleEyeDropper = async () => {
    if ('EyeDropper' in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        onChange(result.sRGBHex);
      } catch (e) {
        // User cancelled
      }
    }
  };

  const displayValue = value === "transparent" ? "Transparent" : value;

  return (
    <div className="flex flex-col gap-2">
      {label && <Label className="text-sm font-medium">{label}</Label>}
      
      <div className="flex gap-2">
        {/* Color Preview Button */}
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-12 h-10 p-0 border-2"
              style={{
                backgroundColor: value === "transparent" ? undefined : value,
                backgroundImage: value === "transparent" ? `url("${TRANSPARENT_PATTERN}")` : undefined,
              }}
            >
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>Color</Label>
                <div className="flex gap-2">
                  <input
                    ref={colorInputRef}
                    type="color"
                    value={hexColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-12 h-10 rounded border border-border cursor-pointer"
                  />
                  <Input
                    value={hexColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    placeholder="#000000"
                    className="flex-1"
                  />
                  {('EyeDropper' in window) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEyeDropper}
                      className="px-3"
                    >
                      <Pipette className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {allowTransparent && (
                <div className="flex flex-col gap-2">
                  <Label>Opacity: {opacity}%</Label>
                  <Slider
                    value={[opacity]}
                    onValueChange={handleOpacityChange}
                    max={100}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Label>Brightness: {brightness}%</Label>
                <Slider
                  value={[brightness]}
                  onValueChange={handleBrightnessChange}
                  max={200}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>

              {allowTransparent && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onChange("transparent")}
                    className="flex-1"
                  >
                    Transparent
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setOpacity(100);
                      setBrightness(100);
                      onChange("#ffffff");
                    }}
                    className="flex-1"
                  >
                    Reset
                  </Button>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Color Value Input */}
        <Input
          value={displayValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Color value"
          className="flex-1"
        />
      </div>
    </div>
  );
}
