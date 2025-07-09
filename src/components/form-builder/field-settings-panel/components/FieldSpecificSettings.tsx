// External imports
import React from "react";
import { useState } from "react";

// Component imports
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

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
  const isDateType = field.type === "date";
  const isSocialType = field.type === "social";
  const isFileType = field.type === "file";

  // Don't render if field doesn't have specific settings
  if (
    !isTextareaType &&
    !isSliderType &&
    !isTagsType &&
    !isSelectType &&
    !isEmailType &&
    !isDateType &&
    !isSocialType &&
    !isFileType
  ) {
    return null;
  }

  // Helper for file type options
  const COMMON_FILE_TYPES = [
    { value: "image/", label: "Images" },
    { value: ".pdf", label: "PDF" },
    { value: "video/", label: "Videos" },
    { value: "audio/", label: "Audio" },
    { value: ".doc,.docx", label: "Word Docs" },
    { value: ".xls,.xlsx", label: "Excel Sheets" },
    { value: ".ppt,.pptx", label: "PowerPoint" },
    { value: ".zip,.rar", label: "Archives (zip/rar)" },
  ];
  const [customType, setCustomType] = useState("");
  const allowedTypes = field.settings?.allowedTypes || [];

  return (
    <>
      {/* Email Validation Settings */}
      {isEmailType && (
        <EmailValidationSettings
          field={field}
          onUpdateSettings={onUpdateSettings}
        />
      )}

      {/* Date Field Settings */}
      {isDateType && (
        <Card className="p-4 bg-background flex flex-col gap-4 rounded-card">
          <h3 className="font-medium text-card-foreground">Date Input Mode</h3>
          <div className="flex items-center gap-2">
            <Switch
              size={"sm"}
              id="date-input-mode"
              checked={field.settings?.dateInputMode === "human-friendly"}
              onCheckedChange={(checked) =>
                onUpdateSettings({
                  dateInputMode: checked ? "human-friendly" : "classic",
                })
              }
            />
            <Label htmlFor="date-input-mode" className="text-card-foreground">
              Use human-friendly input (e.g. "next Friday at 2pm")
            </Label>
          </div>
        </Card>
      )}

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

      {/* Social Field Settings */}
      {isSocialType && (
        <Card className="p-4 bg-background flex flex-col gap-4 rounded-card">
          <h3 className="font-medium text-card-foreground">Social Platforms</h3>
          <div className="flex flex-wrap gap-3 mb-2">
            {[
              { key: "github", label: "GitHub" },
              { key: "twitter", label: "Twitter" },
              { key: "linkedin", label: "LinkedIn" },
              { key: "facebook", label: "Facebook" },
              { key: "instagram", label: "Instagram" },
              { key: "youtube", label: "YouTube" },
              { key: "website", label: "Website" },
            ].map((platform) => (
              <label
                key={platform.key}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={
                    field.settings?.socialPlatforms?.includes(platform.key) ||
                    false
                  }
                  onChange={(e) => {
                    const prev = field.settings?.socialPlatforms || [];
                    onUpdateSettings({
                      socialPlatforms: e.target.checked
                        ? [...prev, platform.key]
                        : prev.filter((p) => p !== platform.key),
                    });
                  }}
                />
                {platform.label}
              </label>
            ))}
          </div>
          <h4 className="font-medium text-card-foreground mt-4">
            Custom Links
          </h4>
          <div className="flex flex-col gap-2">
            {(field.settings?.customLinks || []).map((link, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <Input
                  type="text"
                  placeholder="Label"
                  value={link.label}
                  onChange={(e) => {
                    const updated = [...(field.settings?.customLinks || [])];
                    updated[idx] = { ...updated[idx], label: e.target.value };
                    onUpdateSettings({ customLinks: updated });
                  }}
                />
                <Input
                  type="text"
                  placeholder="Placeholder (optional)"
                  value={link.placeholder || ""}
                  onChange={(e) => {
                    const updated = [...(field.settings?.customLinks || [])];
                    updated[idx] = {
                      ...updated[idx],
                      placeholder: e.target.value,
                    };
                    onUpdateSettings({ customLinks: updated });
                  }}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="shrink-0"
                  onClick={() => {
                    const updated = [...(field.settings?.customLinks || [])];
                    updated.splice(idx, 1);
                    onUpdateSettings({ customLinks: updated });
                  }}
                >
                  ×
                </Button>
              </div>
            ))}
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="w-fit mt-2"
              onClick={() => {
                const updated = [
                  ...(field.settings?.customLinks || []),
                  { label: "", placeholder: "" },
                ];
                onUpdateSettings({ customLinks: updated });
              }}
            >
              + Add Custom Link
            </Button>
          </div>
        </Card>
      )}
    </>
  );
}
