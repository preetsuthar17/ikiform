"use client";

import { Check, Eye, Palette } from "lucide-react";
import React from "react";
import type { LocalSettings } from "@/components/form-builder/form-settings-modal/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import {
  FORM_PRESETS,
  type FormPreset,
  getPresetsByCategory,
  PRESET_CATEGORIES,
} from "@/lib/utils/form-presets";

interface PresetsSectionProps {
  localSettings: LocalSettings;
  updateSettings: (updates: Partial<LocalSettings>) => void;
}

export function PresetsSection({
  localSettings,
  updateSettings,
}: PresetsSectionProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<
    FormPreset["category"] | "all"
  >("all");
  const [appliedPreset, setAppliedPreset] = React.useState<string | null>(null);

  const filteredPresets =
    selectedCategory === "all"
      ? FORM_PRESETS
      : getPresetsByCategory(selectedCategory);

  const applyPreset = (preset: FormPreset) => {
    // Deep merge the preset settings with current settings
    const newSettings = {
      ...localSettings,
      ...preset.settings,
      layout: {
        ...localSettings.layout,
        ...preset.settings.layout,
      },
      colors: {
        ...localSettings.colors,
        ...preset.settings.colors,
      },
      typography: {
        ...localSettings.typography,
        ...preset.settings.typography,
      },
    };

    updateSettings(newSettings);
    setAppliedPreset(preset.id);
    toast.success(`Applied "${preset.name}" preset`);

    // Reset applied preset indicator after animation
    setTimeout(() => setAppliedPreset(null), 2000);
  };

  const PresetCard = ({ preset }: { preset: FormPreset }) => {
    const isApplied = appliedPreset === preset.id;

    return (
      <Card
        className={`hover: cursor-pointer p-4 transition-all duration-200 ${
          isApplied ? "scale-[1.02] ring-2 ring-primary" : ""
        }`}
        onClick={() => applyPreset(preset)}
      >
        {/* Preset Preview */}
        <div className="relative mb-3 h-44 overflow-hidden rounded-md border">
          <div
            className="flex h-full w-full items-center justify-center text-xs"
            style={{
              backgroundColor: preset.settings.colors?.background || "#ffffff",
              color: preset.settings.colors?.text || "#000000",
              fontFamily: preset.settings.typography?.fontFamily
                ? `"${preset.settings.typography.fontFamily}", system-ui, sans-serif`
                : undefined,
            }}
          >
            <div className="flex flex-col gap-1 text-center">
              <div
                className="font-medium text-[10px]"
                style={{
                  color: preset.settings.colors?.primary || "#3b82f6",
                }}
              >
                Form Title
              </div>
              <div
                className="mx-auto h-1 w-16 rounded"
                style={{
                  backgroundColor: preset.settings.colors?.border || "#e5e7eb",
                }}
              />
              <div
                className="mx-auto h-1 w-12 rounded"
                style={{
                  backgroundColor: preset.settings.colors?.border || "#e5e7eb",
                }}
              />
              <div
                className="mx-auto mt-1 flex h-3 w-8 items-center justify-center rounded text-[8px]"
                style={{
                  backgroundColor: preset.settings.colors?.primary || "#3b82f6",
                  color: "#ffffff",
                }}
              >
                Submit
              </div>
            </div>
          </div>

          {/* Applied Indicator */}
          {isApplied && (
            <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
              <div className="rounded-full bg-primary p-1 text-primary-foreground">
                <Check className="h-3 w-3" />
              </div>
            </div>
          )}
        </div>

        {/* Preset Info */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">{preset.name}</h4>
            <Badge className="text-xs" variant="outline">
              {preset.category}
            </Badge>
          </div>
          <p className="text-muted-foreground text-xs">{preset.description}</p>

          {/* Color Palette Preview */}
          <div className="flex gap-1 pt-1">
            {preset.settings.colors &&
              Object.values(preset.settings.colors).map(
                (color, index) =>
                  color && (
                    <div
                      className="h-3 w-3 rounded-full border border-border"
                      key={index}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  )
              )}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="flex h-full flex-col gap-6">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Palette className="h-4 w-4 text-primary" />
          <h2 className="font-semibold text-lg">Design Presets</h2>
        </div>
        <p className="text-muted-foreground text-xs">
          Quick-start with beautiful pre-designed form styles
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-col gap-3">
        <Label className="font-medium">Category</Label>
        <div className="flex flex-wrap gap-2">
          <Button
            className="text-xs"
            onClick={() => setSelectedCategory("all")}
            size="sm"
            variant={selectedCategory === "all" ? "default" : "outline"}
          >
            All Presets
          </Button>
          {PRESET_CATEGORIES.map((category) => (
            <Button
              className="text-xs"
              key={category.id}
              onClick={() =>
                setSelectedCategory(category.id as FormPreset["category"])
              }
              size="sm"
              variant={selectedCategory === category.id ? "default" : "outline"}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Presets Grid */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Label className="font-medium">
            {selectedCategory === "all"
              ? "All Presets"
              : PRESET_CATEGORIES.find((c) => c.id === selectedCategory)
                  ?.label || "Presets"}
          </Label>
          <span className="text-muted-foreground text-xs">
            {filteredPresets.length} preset
            {filteredPresets.length !== 1 ? "s" : ""}
          </span>
        </div>

        <ScrollArea className="h-[550px]">
          <div className="grid grid-cols-1 gap-4 pr-4">
            {filteredPresets.map((preset) => (
              <PresetCard key={preset.id} preset={preset} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
