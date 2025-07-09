import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioItem } from "@/components/ui/radio";
import { Separator } from "@/components/ui/separator";
import type { LocalSettings } from "../types";
import { Palette, Maximize2, Move, Square } from "lucide-react";
import {
  FORM_WIDTH_OPTIONS,
  FORM_PADDING_OPTIONS,
  FORM_DESIGN_MODES,
  DEFAULT_FORM_DESIGN,
} from "../constants";
import { Button } from "@/components/ui/button";

const FORM_MARGIN_OPTIONS = [
  { value: "none", label: "None", preview: "", description: "No margin" },
  { value: "sm", label: "Small", preview: "", description: "8px" },
  { value: "md", label: "Medium", preview: "", description: "16px" },
  { value: "lg", label: "Large", preview: "", description: "32px" },
];

interface DesignSectionProps {
  localSettings: LocalSettings;
  updateSettings: (updates: Partial<LocalSettings>) => void;
}

export function DesignSection({
  localSettings,
  updateSettings,
}: DesignSectionProps) {
  const currentWidth =
    localSettings.layout?.maxWidth || DEFAULT_FORM_DESIGN.maxWidth;
  const currentPadding =
    localSettings.layout?.padding || DEFAULT_FORM_DESIGN.padding;
  const currentMargin = localSettings.layout?.margin || "none";
  const currentDesignMode =
    localSettings.designMode || DEFAULT_FORM_DESIGN.designMode;

  const handleWidthChange = (value: string) => {
    updateSettings({
      layout: {
        ...localSettings.layout,
        maxWidth: value as "sm" | "md" | "lg" | "xl" | "full",
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

  const handleDesignModeChange = (value: string) => {
    updateSettings({
      designMode: value as "default" | "minimal",
    });
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <Palette className="w-5 h-5 text-primary" />
        Design
      </h3>
      <div className="flex flex-col gap-4 border-l-2 border-muted pl-6">
        {/* Width */}
        <div className="flex flex-col gap-2">
          <Label>Form Width</Label>
          <div className="flex flex-wrap gap-2">
            {FORM_WIDTH_OPTIONS.map((option) => (
              <Button
                key={option.value}
                onClick={() => handleWidthChange(option.value)}
                className={`
                  text-sm font-medium
                  ${
                    currentWidth === option.value
                      ? ""
                      : "bg-transparent hover:bg-accent text-foreground border"
                  }
                  transition
                `}
                type="button"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
        {/* Padding */}
        <div className="flex flex-col gap-2">
          <Label>Form Padding</Label>
          <div className="flex flex-wrap gap-2">
            {FORM_PADDING_OPTIONS.map((option) => (
              <Button
                key={option.value}
                onClick={() => handlePaddingChange(option.value)}
                className={`
                  text-sm font-medium
                  ${
                    currentPadding === option.value
                      ? ""
                      : "bg-transparent hover:bg-accent text-foreground border"
                  }
                  transition
                `}
                type="button"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
        {/* Margin */}
        <div className="flex flex-col gap-2">
          <Label>Form Margin</Label>
          <div className="flex flex-wrap gap-2">
            {FORM_MARGIN_OPTIONS.map((option) => (
              <Button
                key={option.value}
                onClick={() => handleMarginChange(option.value)}
                className={`
                  text-sm font-medium
                  ${
                    currentMargin === option.value
                      ? ""
                      : "bg-transparent hover:bg-accent text-foreground border"
                  }
                  transition
                `}
                type="button"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
        {/* Design Mode */}
        <div className="flex flex-col gap-2">
          <Label>Design Mode</Label>
          <RadioGroup
            value={currentDesignMode}
            onValueChange={handleDesignModeChange}
            orientation="horizontal"
            className="flex gap-4"
          >
            {FORM_DESIGN_MODES.map((mode) => (
              <RadioItem
                key={mode.value}
                value={mode.value}
                label={mode.label}
                className="text-sm font-medium"
              />
            ))}
          </RadioGroup>
        </div>
      </div>
    </Card>
  );
}
