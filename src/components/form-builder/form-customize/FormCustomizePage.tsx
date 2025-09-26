"use client";

import { ArrowLeft, Eye, Layout, Palette, Type } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import type { LocalSettings } from "@/components/form-builder/form-settings-modal/types";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import type { FormSchema } from "@/lib/database";
import { formsDb } from "@/lib/database";
import { getInternalFormTitle } from "@/lib/utils/form-utils";

import {
  ActualFormPreview,
  ColorCustomizationSection,
  LayoutCustomizationSection,
  PresetsSection,
  TypographyCustomizationSection,
} from "./components";

interface FormCustomizePageProps {
  formId: string;
  schema: FormSchema;
}

type CustomizeSection = "presets" | "layout" | "colors" | "typography";

export function FormCustomizePage({ formId, schema }: FormCustomizePageProps) {
  const router = useRouter();
  const [activeSection, setActiveSection] =
    useState<CustomizeSection>("presets");

  const [previewMode, setPreviewMode] = useState(false);

  const [localSettings, setLocalSettings] = useState<LocalSettings>(() => ({
    ...schema.settings,
    layout: (schema.settings as any).layout || {},
    colors: (schema.settings as any).colors || {},
    typography: (schema.settings as any).typography || {},
    branding: (schema.settings as any).branding || {},
  }));

  const updateSettings = async (updates: Partial<LocalSettings>) => {
    const newSettings = { ...localSettings, ...updates };
    setLocalSettings(newSettings);

    // Auto-save to database
    try {
      const newSchema = { ...schema, settings: newSettings };
      await formsDb.updateForm(formId, { schema: newSchema as any });
      console.log("Auto-saved form customization");
    } catch (error) {
      console.error("Error auto-saving form customization:", error);
      toast.error("Failed to save changes. Please try again.");
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
      toast.success("Customization reset to defaults");
    } catch (error) {
      console.error("Error resetting form customization:", error);
      toast.error("Failed to reset customization. Please try again.");
    }
  };

  const handleBack = () => {
    router.push(`/form-builder/${formId}`);
  };

  const internalTitle = getInternalFormTitle(schema);
  const hasPublicTitle =
    schema.settings?.publicTitle &&
    schema.settings.publicTitle !== schema.settings?.title;

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
                <p className="text-muted-foreground text-sm">{internalTitle}</p>
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
          <div className="flex flex-col items-start justify-center gap-4">
            <div>
              <h1 className="font-semibold text-xl">Customize Form</h1>
              <div className="flex flex-col gap-1">
                <p className="text-muted-foreground text-sm">{internalTitle}</p>
                {hasPublicTitle && (
                  <p className="text-muted-foreground text-xs">
                    Public title: "{schema.settings?.publicTitle}"
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">
              Changes auto-saved
            </span>
            <Button
              className="gap-2"
              onClick={handleBack}
              size="sm"
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button onClick={resetSettings} variant="outline">
              Reset to Default
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Customization Controls */}
        <div className="w-96 flex-shrink-0 border-r bg-background">
          <div className="flex h-full flex-col">
            {/* Tabs Navigation */}
            <div className="flex-shrink-0 p-4">
              <Tabs
                items={[
                  {
                    id: "presets",
                    label: "Presets",
                    icon: <Palette className="h-4 w-4" />,
                  },
                  {
                    id: "layout",
                    label: "Layout",
                    icon: <Layout className="h-4 w-4" />,
                  },
                  {
                    id: "colors",
                    label: "Colors",
                    icon: <Palette className="h-4 w-4" />,
                  },
                  {
                    id: "typography",
                    label: "Typography",
                    icon: <Type className="h-4 w-4" />,
                  },
                ]}
                onValueChange={(value) =>
                  setActiveSection(value as CustomizeSection)
                }
                size="sm"
                value={activeSection}
                variant="underline"
              />
            </div>

            {/* Section Content */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-6">
                  <TabsContent activeValue={activeSection} value="presets">
                    <PresetsSection
                      localSettings={localSettings}
                      updateSettings={updateSettings}
                    />
                  </TabsContent>

                  <TabsContent activeValue={activeSection} value="layout">
                    <LayoutCustomizationSection
                      localSettings={localSettings}
                      updateSettings={updateSettings}
                    />
                  </TabsContent>

                  <TabsContent activeValue={activeSection} value="colors">
                    <ColorCustomizationSection
                      localSettings={localSettings}
                      updateSettings={updateSettings}
                    />
                  </TabsContent>

                  <TabsContent activeValue={activeSection} value="typography">
                    <TypographyCustomizationSection
                      localSettings={localSettings}
                      updateSettings={updateSettings}
                    />
                  </TabsContent>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>

        {/* Right Panel - Form Preview */}
        <div className="flex-1 overflow-hidden">
          <div className="flex h-full items-center justify-center p-8">
            <div className="w-fit">
              <ActualFormPreview
                className="h-full"
                localSettings={localSettings}
                schema={schema}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
