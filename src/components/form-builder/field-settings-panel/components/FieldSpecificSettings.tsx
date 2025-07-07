// External imports
import React from "react";

// Component imports
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";

// Component imports
import { EmailValidationSettings } from "./EmailValidationSettings";

// Type imports
import type { FormField } from "@/lib/database";

interface FieldSpecificSettingsProps {
  field: FormField;
  onUpdateSettings: (updates: Partial<FormField["settings"]>) => void;
}

export function FieldSpecificSettings({
  field,
  onUpdateSettings,
}: FieldSpecificSettingsProps) {
  const isTextareaType = field.type === "textarea";
  const isSliderType = field.type === "slider";
  const isTagsType = field.type === "tags";
  const isSelectType = field.type === "select";
  const isEmailType = field.type === "email";

  // Don't render if field doesn't have specific settings
  if (
    !isTextareaType &&
    !isSliderType &&
    !isTagsType &&
    !isSelectType &&
    !isEmailType
  ) {
    return null;
  }

  return (
    <>
      {/* Textarea Settings */}
      {isTextareaType && (
        <Card className="p-4 bg-background flex flex-col gap-4 rounded-card">
          <h3 className="font-medium text-card-foreground">Field Settings</h3>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="textarea-rows" className="text-card-foreground">
                Number of Rows
              </Label>
              <Input
                id="textarea-rows"
                type="number"
                value={field.settings?.rows || 4}
                onChange={(e) =>
                  onUpdateSettings({ rows: parseInt(e.target.value) || 4 })
                }
                min="2"
                max="20"
                className="bg-input border-border"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Slider Settings */}
      {isSliderType && (
        <Card className="p-4 bg-background flex flex-col gap-4 rounded-card">
          <h3 className="font-medium text-card-foreground">Slider Settings</h3>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="slider-min" className="text-card-foreground">
                Minimum Value
              </Label>
              <Input
                id="slider-min"
                type="number"
                value={field.settings?.min || 0}
                onChange={(e) =>
                  onUpdateSettings({ min: parseInt(e.target.value) || 0 })
                }
                className="bg-input border-border"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="slider-max" className="text-card-foreground">
                Maximum Value
              </Label>
              <Input
                id="slider-max"
                type="number"
                value={field.settings?.max || 100}
                onChange={(e) =>
                  onUpdateSettings({ max: parseInt(e.target.value) || 100 })
                }
                className="bg-input border-border"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="slider-step" className="text-card-foreground">
                Step Size
              </Label>
              <Input
                id="slider-step"
                type="number"
                value={field.settings?.step || 1}
                onChange={(e) =>
                  onUpdateSettings({ step: parseInt(e.target.value) || 1 })
                }
                min="1"
                className="bg-input border-border"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="slider-default" className="text-card-foreground">
                Default Value
              </Label>
              <Input
                id="slider-default"
                type="number"
                value={field.settings?.defaultValue || 50}
                onChange={(e) =>
                  onUpdateSettings({
                    defaultValue: parseInt(e.target.value) || 50,
                  })
                }
                className="bg-input border-border"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Tags Settings */}
      {isTagsType && (
        <Card className="p-4 bg-background flex flex-col gap-4 rounded-card">
          <h3 className="font-medium text-card-foreground">Tags Settings</h3>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="tags-max" className="text-card-foreground">
                Maximum Tags
              </Label>
              <Input
                id="tags-max"
                type="number"
                value={field.settings?.maxTags || 10}
                onChange={(e) =>
                  onUpdateSettings({
                    maxTags: parseInt(e.target.value) || 10,
                  })
                }
                min="1"
                className="bg-input border-border"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="tags-duplicates"
                checked={field.settings?.allowDuplicates || false}
                onCheckedChange={(checked) =>
                  onUpdateSettings({ allowDuplicates: checked })
                }
              />
              <Label htmlFor="tags-duplicates" className="text-card-foreground">
                Allow Duplicate Tags
              </Label>
            </div>
          </div>
        </Card>
      )}

      {/* Select Settings */}
      {isSelectType && (
        <Card className="p-4 bg-background flex flex-col gap-4 rounded-card">
          <h3 className="font-medium text-card-foreground">Select Settings</h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="select-multiple"
                checked={field.settings?.allowMultiple || false}
                onCheckedChange={(checked) =>
                  onUpdateSettings({ allowMultiple: checked })
                }
              />
              <Label htmlFor="select-multiple" className="text-card-foreground">
                Allow Multiple Selection
              </Label>
            </div>
          </div>
        </Card>
      )}

      {/* Email Validation Settings */}
      {isEmailType && (
        <EmailValidationSettings
          field={field}
          onUpdateSettings={onUpdateSettings}
        />
      )}
    </>
  );
}
