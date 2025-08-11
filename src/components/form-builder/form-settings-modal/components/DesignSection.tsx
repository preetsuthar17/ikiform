import { Maximize2, Move, Palette, Square } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioItem } from "@/components/ui/radio";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  DEFAULT_FORM_DESIGN,
  FORM_BORDER_RADIUS_OPTIONS,
  FORM_DESIGN_MODES,
  FORM_PADDING_OPTIONS,
  FORM_WIDTH_OPTIONS,
} from "../constants";
import type { LocalSettings } from "../types";

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
  const currentBorderRadius =
    localSettings.layout?.borderRadius || DEFAULT_FORM_DESIGN.borderRadius;
  const currentDesignMode =
    localSettings.designMode || DEFAULT_FORM_DESIGN.designMode;
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
      <h3 className="mb-6 flex items-center gap-2 font-semibold text-lg">
        <Palette className="h-5 w-5 text-primary" />
        Design
      </h3>
      <div className="flex flex-col gap-4 border-muted border-l-2 pl-6">
        {}
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
        {}
        <div className="flex flex-col gap-2">
          <Label>Form Width</Label>
          <div className="flex flex-wrap gap-2">
            {FORM_WIDTH_OPTIONS.map((option) => (
              <Button
                className={`font-medium text-sm ${
                  currentWidth === option.value
                    ? ""
                    : "border bg-transparent text-foreground hover:bg-accent"
                }transition`}
                key={option.value}
                onClick={() => handleWidthChange(option.value)}
                type="button"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
        {}
        <div className="flex flex-col gap-2">
          <Label>Form Padding</Label>
          <div className="flex flex-wrap gap-2">
            {FORM_PADDING_OPTIONS.map((option) => (
              <Button
                className={`font-medium text-sm ${
                  currentPadding === option.value
                    ? ""
                    : "border bg-transparent text-foreground hover:bg-accent"
                }transition`}
                key={option.value}
                onClick={() => handlePaddingChange(option.value)}
                type="button"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
        {}
        <div className="flex flex-col gap-2">
          <Label>Form Margin</Label>
          <div className="flex flex-wrap gap-2">
            {FORM_MARGIN_OPTIONS.map((option) => (
              <Button
                className={`font-medium text-sm ${
                  currentMargin === option.value
                    ? ""
                    : "border bg-transparent text-foreground hover:bg-accent"
                }transition`}
                key={option.value}
                onClick={() => handleMarginChange(option.value)}
                type="button"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
        {}
        <div className="flex flex-col gap-2">
          <Label>Border Radius</Label>
          <div className="flex flex-wrap gap-2">
            {FORM_BORDER_RADIUS_OPTIONS.map((option) => (
              <Button
                className={`font-medium text-sm ${
                  currentBorderRadius === option.value
                    ? ""
                    : "border bg-transparent text-foreground hover:bg-accent"
                }transition`}
                key={option.value}
                onClick={() => handleBorderRadiusChange(option.value)}
                type="button"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
        {}
        <div className="flex flex-col gap-2">
          <Label>Design Mode</Label>
          <RadioGroup
            className="flex gap-4"
            onValueChange={handleDesignModeChange}
            orientation="horizontal"
            value={currentDesignMode}
          >
            {FORM_DESIGN_MODES.map((mode) => (
              <RadioItem
                className="font-medium text-sm"
                key={mode.value}
                label={mode.label}
                value={mode.value}
              />
            ))}
          </RadioGroup>
        </div>
      </div>
    </Card>
  );
}
