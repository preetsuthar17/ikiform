"use client";

import React from "react";
import { Palette, Eye, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import type { LocalSettings } from "@/components/form-builder/form-settings-modal/types";
import { 
  FORM_PRESETS, 
  getPresetsByCategory, 
  PRESET_CATEGORIES,
  type FormPreset 
} from "@/lib/utils/form-presets";

interface PresetsSectionProps {
  localSettings: LocalSettings;
  updateSettings: (updates: Partial<LocalSettings>) => void;
}

export function PresetsSection({
  localSettings,
  updateSettings,
}: PresetsSectionProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<FormPreset["category"] | "all">("all");
  const [appliedPreset, setAppliedPreset] = React.useState<string | null>(null);

  const filteredPresets = selectedCategory === "all" 
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
        className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md/2 ${
          isApplied ? 'ring-2 ring-primary shadow-lg scale-[1.02]' : ''
        }`}
        onClick={() => applyPreset(preset)}
      >
        {/* Preset Preview */}
        <div className="mb-3 h-44 rounded-md border overflow-hidden relative">
          <div 
            className="h-full w-full flex items-center justify-center text-xs"
            style={{
              backgroundColor: preset.settings.colors?.background || '#ffffff',
              color: preset.settings.colors?.text || '#000000',
              fontFamily: preset.settings.typography?.fontFamily 
                ? `"${preset.settings.typography.fontFamily}", system-ui, sans-serif`
                : undefined,
            }}
          >
            <div className="text-center flex flex-col gap-1">
              <div 
                className="text-[10px] font-medium"
                style={{ 
                  color: preset.settings.colors?.primary || '#3b82f6' 
                }}
              >
                Form Title
              </div>
              <div 
                className="w-16 h-1 mx-auto rounded"
                style={{ 
                  backgroundColor: preset.settings.colors?.border || '#e5e7eb' 
                }}
              />
              <div 
                className="w-12 h-1 mx-auto rounded"
                style={{ 
                  backgroundColor: preset.settings.colors?.border || '#e5e7eb' 
                }}
              />
              <div 
                className="w-8 h-3 mx-auto rounded text-[8px] flex items-center justify-center mt-1"
                style={{ 
                  backgroundColor: preset.settings.colors?.primary || '#3b82f6',
                  color: '#ffffff'
                }}
              >
                Submit
              </div>
            </div>
          </div>
          
          {/* Applied Indicator */}
          {isApplied && (
            <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
              <div className="bg-primary text-primary-foreground rounded-full p-1">
                <Check className="h-3 w-3" />
              </div>
            </div>
          )}
        </div>

        {/* Preset Info */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">{preset.name}</h4>
            <Badge variant="outline" className="text-xs">
              {preset.category}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{preset.description}</p>
          
          {/* Color Palette Preview */}
          <div className="flex gap-1 pt-1">
            {preset.settings.colors && Object.values(preset.settings.colors).map((color, index) => (
              color && (
                <div
                  key={index}
                  className="w-3 h-3 rounded-full border border-border"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              )
            ))}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div>
        <div className="flex items-center gap-2 mb-2">
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
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("all")}
            className="text-xs"
          >
            All Presets
          </Button>
          {PRESET_CATEGORIES.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id as FormPreset["category"])}
              className="text-xs"
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
            {selectedCategory === "all" ? "All Presets" : 
             PRESET_CATEGORIES.find(c => c.id === selectedCategory)?.label || "Presets"}
          </Label>
          <span className="text-xs text-muted-foreground">
            {filteredPresets.length} preset{filteredPresets.length !== 1 ? 's' : ''}
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
