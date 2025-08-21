'use client';

import { Type } from 'lucide-react';
import React from 'react';
import {
  FONT_SIZE_OPTIONS,
  FONT_WEIGHT_OPTIONS,
} from '@/components/form-builder/form-settings-modal/constants';
import type { LocalSettings } from '@/components/form-builder/form-settings-modal/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GoogleFontPicker } from '@/components/ui/google-font-picker';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  generateFontPreviewStyles,
  loadGoogleFont,
} from '@/lib/utils/google-fonts';

interface TypographyCustomizationSectionProps {
  localSettings: LocalSettings;
  updateSettings: (updates: Partial<LocalSettings>) => void;
}

export function TypographyCustomizationSection({
  localSettings,
  updateSettings,
}: TypographyCustomizationSectionProps) {
  const fontFamily = localSettings.typography?.fontFamily || 'Inter';
  const fontSize = localSettings.typography?.fontSize || 'base';
  const fontWeight = localSettings.typography?.fontWeight || 'normal';

  const handleFontFamilyChange = (value: string) => {
    console.log('Font family changed to:', value);
    
    // Load the font before applying it
    if (typeof window !== 'undefined') {
      loadGoogleFont(value)
        .then(() => console.log('Font loaded successfully:', value))
        .catch((error) => console.error('Failed to load font:', value, error));
    }

    updateSettings({
      typography: {
        ...localSettings.typography,
        fontFamily: value,
      },
    });
  };

  const handleFontSizeChange = (value: string) => {
    updateSettings({
      typography: {
        ...localSettings.typography,
        fontSize: value as 'xs' | 'sm' | 'base' | 'lg' | 'xl',
      },
    });
  };

  const handleFontWeightChange = (value: string) => {
    updateSettings({
      typography: {
        ...localSettings.typography,
        fontWeight: value as
          | 'light'
          | 'normal'
          | 'medium'
          | 'semibold'
          | 'bold',
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
          <div className="flex flex-wrap gap-2">
            {FONT_SIZE_OPTIONS.map((option) => (
              <Button
                className={`font-medium text-sm transition-all ${
                  fontSize === option.value
                    ? 'bg-primary text-primary-foreground'
                    : 'border bg-transparent text-foreground hover:bg-accent'
                }`}
                key={option.value}
                onClick={() => handleFontSizeChange(option.value)}
                size="sm"
                type="button"
              >
                {option.label}
              </Button>
            ))}
          </div>
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <Label className="mb-2 block text-muted-foreground text-xs">
              Size Preview
            </Label>
            <p
              className={`text-${fontSize}`}
              style={generateFontPreviewStyles(fontFamily)}
            >
              This is how your form text will appear at this size
            </p>
          </div>
          <p className="text-muted-foreground text-xs">
            Controls the base font size for all form text elements
          </p>
        </div>

        <Separator />

        {/* Font Weight */}
        <div className="flex flex-col gap-4">
          <Label className="font-medium">Font Weight</Label>
          <div className="flex flex-wrap gap-2">
            {FONT_WEIGHT_OPTIONS.map((option) => (
              <Button
                className={`text-sm transition-all ${
                  fontWeight === option.value
                    ? 'bg-primary text-primary-foreground'
                    : 'border bg-transparent text-foreground hover:bg-accent'
                }`}
                key={option.value}
                onClick={() => handleFontWeightChange(option.value)}
                size="sm"
                style={{ fontWeight: option.description }}
                type="button"
              >
                {option.label}
              </Button>
            ))}
          </div>
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <Label className="mb-2 block text-muted-foreground text-xs">
              Weight Preview
            </Label>
            <p
              style={{
                ...generateFontPreviewStyles(fontFamily),
                fontWeight:
                  FONT_WEIGHT_OPTIONS.find((opt) => opt.value === fontWeight)
                    ?.description || '400',
              }}
            >
              This text shows the selected font weight
            </p>
          </div>
          <p className="text-muted-foreground text-xs">
            Controls how bold or light the form text appears
          </p>
        </div>
      </div>
    </div>
  );
}
