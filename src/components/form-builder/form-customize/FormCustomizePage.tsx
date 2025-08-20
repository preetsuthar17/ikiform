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
import { getInternalFormTitle } from '@/lib/utils/form-utils';

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

  const internalTitle = getInternalFormTitle(schema);
  const hasPublicTitle = schema.settings.publicTitle && schema.settings.publicTitle !== schema.settings.title;

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
        {/* Header */}
        <div className="flex-shrink-0 border-b bg-background p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                className="gap-2"
                onClick={() => setPreviewMode(false)}
                size="sm"
                variant="outline"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Customize
              </Button>
              <div>
                <h1 className="font-semibold text-xl">Preview Form</h1>
                <p className="text-muted-foreground text-sm">
                  {internalTitle}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-auto">
          <ActualFormPreview
            className="min-h-full"
            localSettings={localSettings}
            schema={schema}
          />
        </div>
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
              <div className="flex flex-col gap-1">
                <p className="text-muted-foreground text-sm">
                  {internalTitle}
                </p>
                {hasPublicTitle && (
                  <p className="text-xs text-muted-foreground">
                    Public title: "{schema.settings.publicTitle}"
                  </p>
                )}
              </div>
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
        {/* Sidebar */}
        <div className="w-80 flex-shrink-0 border-r bg-background">
          <div className="flex h-full flex-col">
            {/* Section Tabs */}
            <div className="flex-shrink-0 border-b bg-background">
              <div className="flex">
                {(['presets', 'layout', 'colors', 'typography'] as const).map(
                  (section) => (
                    <button
                      key={section}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                        activeSection === section
                          ? 'border-b-2 border-primary bg-primary/5 text-primary'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                      onClick={() => setActiveSection(section)}
                    >
                      {section.charAt(0).toUpperCase() + section.slice(1)}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Section Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Section content would go here */}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <ActualFormPreview
            className="h-full"
            localSettings={localSettings}
            schema={schema}
          />
        </div>
      </div>
    </div>
  );
}
