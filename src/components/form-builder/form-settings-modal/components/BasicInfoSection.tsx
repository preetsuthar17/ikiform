import { Info } from "lucide-react";
import React from "react";

import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { BasicInfoSectionProps } from "../types";

export function BasicInfoSection({
  localSettings,
  updateSettings,
}: BasicInfoSectionProps) {
  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center gap-3">
        <Info className="h-5 w-5 text-primary" />
        <h3 className="font-medium text-lg">Basic Information</h3>
      </div>
      <div className="flex flex-col gap-4 border-muted border-l-2 pl-6">
        <BasicInfoField
          description="This title is only visible to you in the dashboard and form builder"
          id="form-title"
          label="Internal Title"
          onChange={(value) => updateSettings({ title: value })}
          placeholder="Enter internal title for your reference..."
          value={localSettings.title}
        />
        <BasicInfoField
          description="This title will be displayed to users on the actual form. Leave empty to use the internal title."
          id="form-public-title"
          label="Public Title"
          onChange={(value) => updateSettings({ publicTitle: value })}
          placeholder="Enter title to display to users..."
          value={localSettings.publicTitle || ""}
        />
        <div className="flex items-center gap-3">
          <input
            checked={!!localSettings.hideHeader}
            className="h-4 w-4 accent-primary"
            id="hide-header-toggle"
            onChange={(e) =>
              updateSettings({
                hideHeader: (e.target as HTMLInputElement).checked,
              })
            }
            type="checkbox"
          />
          <Label
            className="cursor-pointer select-none"
            htmlFor="hide-header-toggle"
          >
            Hide header (hides public title and description in embeds)
          </Label>
        </div>
        <BasicInfoField
          id="form-description"
          isTextarea
          label="Form Description"
          onChange={(value) => updateSettings({ description: value })}
          placeholder="Enter form description"
          rows={3}
          value={localSettings.description || ""}
        />
        <BasicInfoField
          id="submit-text"
          label="Submit Button Text"
          onChange={(value) => updateSettings({ submitText: value })}
          placeholder="Submit"
          value={localSettings.submitText || "Submit"}
        />
        <BasicInfoField
          id="success-message"
          isTextarea
          label="Success Message"
          onChange={(value) => updateSettings({ successMessage: value })}
          placeholder="Thank you for your submission!"
          rows={2}
          value={localSettings.successMessage || ""}
        />
        <BasicInfoField
          description="URL to redirect users after successful submission"
          id="redirect-url"
          label="Redirect URL (Optional)"
          onChange={(value) => updateSettings({ redirectUrl: value })}
          placeholder="https://example.com/thank-you"
          value={localSettings.redirectUrl || ""}
        />
        <div className="flex items-center gap-3 pt-2">
          <input
            checked={!!localSettings.rtl}
            className="h-4 w-4 accent-primary"
            id="rtl-toggle"
            onChange={(e) =>
              updateSettings({ rtl: (e.target as HTMLInputElement).checked })
            }
            type="checkbox"
          />
          <Label className="cursor-pointer select-none" htmlFor="rtl-toggle">
            Display form in RTL (Right-to-Left) mode
          </Label>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <input
            checked={!!localSettings.behavior?.autoFocusFirstField}
            className="h-4 w-4 accent-primary"
            id="auto-focus-toggle"
            onChange={(e) =>
              updateSettings({
                behavior: {
                  ...localSettings.behavior,
                  autoFocusFirstField: (e.target as HTMLInputElement).checked,
                },
              })
            }
            type="checkbox"
          />
          <Label
            className="cursor-pointer select-none"
            htmlFor="auto-focus-toggle"
          >
            Automatically focus on the first field when form loads
          </Label>
        </div>
      </div>
    </Card>
  );
}

interface BasicInfoFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  isTextarea?: boolean;
  rows?: number;
  description?: string;
}

function BasicInfoField({
  id,
  label,
  value,
  onChange,
  placeholder,
  isTextarea = false,
  rows = 3,
  description,
}: BasicInfoFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {isTextarea ? (
        <Textarea
          id={id}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          value={value}
        />
      ) : (
        <Input
          id={id}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          value={value}
        />
      )}
      {description && (
        <p className="text-muted-foreground text-xs">{description}</p>
      )}
    </div>
  );
}
