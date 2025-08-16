'use client';

import { ArrowLeft, Eye, Layout, Monitor, Palette, Type } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import type { LocalSettings } from '@/components/form-builder/form-settings-modal/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import type { FormSchema } from '@/lib/database';
import { formsDb } from '@/lib/database';

import {
  ActualFormPreview,
  ColorCustomizationSection,
  LayoutCustomizationSection,
  PresetsSection,
  TypographyCustomizationSection,
} from './components';

interface FormCustomizePageProps {
  formId: string;
  schema: FormSchema;
}

type CustomizeSection = 'presets' | 'layout' | 'colors' | 'typography';

export function FormCustomizePage({ formId, schema }: FormCustomizePageProps) {
  const router = useRouter();
  const [activeSection, setActiveSection] =
    useState<CustomizeSection>('presets');

  const [previewMode, setPreviewMode] = useState(false);

  const [localSettings, setLocalSettings] = useState<LocalSettings>(() => {
    return {
      ...schema.settings,
      layout: (schema.settings as any).layout || {},
      colors: (schema.settings as any).colors || {},
      typography: (schema.settings as any).typography || {},
      branding: (schema.settings as any).branding || {},
    };
  });

  const updateSettings = async (updates: Partial<LocalSettings>) => {
    const newSettings = { ...localSettings, ...updates };
    setLocalSettings(newSettings);

    // Auto-save to database
    try {
      const newSchema = { ...schema, settings: newSettings };
      await formsDb.updateForm(formId, { schema: newSchema as any });
      console.log('Auto-saved form customization');
    } catch (error) {
      console.error('Error auto-saving form customization:', error);
      toast.error('Failed to save changes. Please try again.');
    }
  };

  const resetSettings = async () => {
    const originalSettings = {
      ...schema.settings,
      layout: (schema.settings as any).layout || {},
      colors: (schema.settings as any).colors || {},
      typography: (schema.settings as any).typography || {},
      branding: (schema.settings as any).branding || {},
    };
    setLocalSettings(originalSettings);

    // Auto-save the reset directly to database
    try {
      const newSchema = { ...schema, settings: originalSettings };
      await formsDb.updateForm(formId, { schema: newSchema as any });
      toast.success('Customization reset to defaults');
    } catch (error) {
      console.error('Error resetting form customization:', error);
      toast.error('Failed to reset customization. Please try again.');
    }
  };

  const handleBack = () => {
    router.push(`/form-builder/${formId}`);
  };

  const sections = [
    {
      id: 'presets' as const,
      label: 'Presets',
      icon: Palette,
      description: 'Quick-start with beautiful pre-designed styles',
    },
    {
      id: 'layout' as const,
      label: 'Layout',
      icon: Layout,
      description: 'Form width, spacing, and layout options',
    },
    {
      id: 'colors' as const,
      label: 'Colors',
      icon: Palette,
      description: 'Background, text, primary, and border colors',
    },
    {
      id: 'typography' as const,
      label: 'Typography',
      icon: Type,
      description: 'Font family, size, and text styling',
    },
  ];

  if (previewMode) {
    return (
      <div className="flex h-screen flex-col bg-background">
        <div className="flex-shrink-0 border-b bg-background p-4">
          <div className="flex items-center justify-between">
            <Button
              className="gap-2"
              onClick={() => setPreviewMode(false)}
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Customization
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">
                Changes auto-saved
              </span>
            </div>
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-8">
            <ActualFormPreview
              className="mx-auto max-w-4xl"
              localSettings={localSettings}
              schema={schema}
            />
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <div className="flex-shrink-0 border-b bg-background p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              className="gap-2"
              onClick={handleBack}
              size="sm"
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="font-semibold text-xl">Customize Form</h1>
              <p className="text-muted-foreground text-sm">
                {localSettings.title}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="gap-2"
              onClick={() => setPreviewMode(true)}
              variant="outline"
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button onClick={resetSettings} variant="outline">
              Reset to Default
            </Button>
            <span className="text-muted-foreground text-sm">
              Changes auto-saved
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Categories */}
        <div className="flex w-64 flex-col border-r bg-muted/30">
          <ScrollArea className="flex-1">
            <div className="p-4">
              <div className="mb-6 flex flex-col gap-2">
                <h2 className="font-medium text-foreground">Customize</h2>
                <p className="text-muted-foreground text-xs">
                  Select a category to customize
                </p>
              </div>

              <div className="flex flex-col gap-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      className={`w-full rounded-lg p-3 text-left transition-colors ${
                        activeSection === section.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent hover:text-accent-foreground'
                      }`}
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4" />
                        <div className="font-medium text-sm">
                          {section.label}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Center - Form Preview */}
        <div className="flex flex-1 items-center justify-center overflow-hidden bg-muted/10 p-8">
          <div className="w-full max-w-2xl">
            <div className="sticky top-8">
              <ActualFormPreview
                className="mx-auto"
                localSettings={localSettings}
                schema={schema}
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar - Settings */}
        <div className="flex w-96 flex-col border-l bg-background">
          <ScrollArea className="flex-1">
            <div className="p-6">
              {activeSection === 'presets' && (
                <PresetsSection
                  localSettings={localSettings}
                  updateSettings={updateSettings}
                />
              )}
              {activeSection === 'layout' && (
                <LayoutCustomizationSection
                  localSettings={localSettings}
                  updateSettings={updateSettings}
                />
              )}
              {activeSection === 'colors' && (
                <ColorCustomizationSection
                  localSettings={localSettings}
                  updateSettings={updateSettings}
                />
              )}
              {activeSection === 'typography' && (
                <TypographyCustomizationSection
                  localSettings={localSettings}
                  updateSettings={updateSettings}
                />
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
