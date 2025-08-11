"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, Palette, Type, Layout, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { formsDb } from "@/lib/database";
import type { FormSchema } from "@/lib/database";
import type { LocalSettings } from "@/components/form-builder/form-settings-modal/types";

import { 
  ColorCustomizationSection,
  TypographyCustomizationSection,
  LayoutCustomizationSection,
  ActualFormPreview,
  PresetsSection
} from "./components";

interface FormCustomizePageProps {
  formId: string;
  schema: FormSchema;
}

type CustomizeSection = "presets" | "layout" | "colors" | "typography";

export function FormCustomizePage({ formId, schema }: FormCustomizePageProps) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<CustomizeSection>("presets");

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

  const handlePreview = () => {
    const previewUrl = schema.settings.multiStep 
      ? `/f/${(schema as any).slug}`
      : `/f/${(schema as any).slug}`;
    window.open(previewUrl, '_blank');
  };

  const sections = [
    {
      id: "presets" as const,
      label: "Presets",
      icon: Palette,
      description: "Quick-start with beautiful pre-designed styles"
    },
    {
      id: "layout" as const,
      label: "Layout",
      icon: Layout,
      description: "Form width, spacing, and layout options"
    },
    {
      id: "colors" as const,
      label: "Colors",
      icon: Palette,
      description: "Background, text, primary, and border colors"
    },
    {
      id: "typography" as const,
      label: "Typography",
      icon: Type,
      description: "Font family, size, and text styling"
    }
  ];

  if (previewMode) {
    return (
      <div className="h-screen bg-background flex flex-col">
        <div className="border-b bg-background p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <Button onClick={() => setPreviewMode(false)} variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Customization
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Changes auto-saved
              </span>
            </div>
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-8">
            <ActualFormPreview 
              localSettings={localSettings}
              schema={schema}
              className="mx-auto max-w-4xl"
            />
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b bg-background p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={handleBack} variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="font-semibold text-xl">Customize Form</h1>
              <p className="text-muted-foreground text-sm">{localSettings.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setPreviewMode(true)} variant="outline" className="gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button onClick={handlePreview} variant="outline" className="gap-2">
              <Monitor className="h-4 w-4" />
              Live Preview
            </Button>
            <Button onClick={resetSettings} variant="outline">
              Reset to Default
            </Button>
            <span className="text-sm text-muted-foreground">
              Changes auto-saved
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Categories */}
        <div className="w-64 border-r bg-muted/30 flex flex-col">
          <ScrollArea className="flex-1">
            <div className="p-4">
              <div className="flex flex-col gap-2 mb-6">
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
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full rounded-lg p-3 text-left transition-colors ${
                        activeSection === section.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4" />
                        <div className="font-medium text-sm">{section.label}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Center - Form Preview */}
        <div className="flex-1 flex items-center justify-center p-8 bg-muted/10 overflow-hidden">
          <div className="w-full max-w-2xl">
            <div className="sticky top-8">
              <ActualFormPreview 
                localSettings={localSettings}
                schema={schema}
                className="mx-auto"
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar - Settings */}
        <div className="w-96 border-l bg-background flex flex-col">
          <ScrollArea className="flex-1">
            <div className="p-6">
              {activeSection === "presets" && (
                <PresetsSection
                  localSettings={localSettings}
                  updateSettings={updateSettings}
                />
              )}
              {activeSection === "layout" && (
                <LayoutCustomizationSection
                  localSettings={localSettings}
                  updateSettings={updateSettings}
                />
              )}
              {activeSection === "colors" && (
                <ColorCustomizationSection
                  localSettings={localSettings}
                  updateSettings={updateSettings}
                />
              )}
              {activeSection === "typography" && (
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
