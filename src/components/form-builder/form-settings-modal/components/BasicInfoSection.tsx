// External libraries
import React from "react";

// UI components
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Types
import type { BasicInfoSectionProps } from "../types";
import { Checkbox } from "@/components/ui/checkbox";

export function BasicInfoSection({
  localSettings,
  updateSettings,
}: BasicInfoSectionProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Basic Information</h3>
      <div className="space-y-4">
        <BasicInfoField
          id="form-title"
          label="Form Title"
          value={localSettings.title}
          placeholder="Enter form title"
          onChange={(value) => updateSettings({ title: value })}
        />
        <BasicInfoField
          id="form-description"
          label="Form Description"
          value={localSettings.description || ""}
          placeholder="Enter form description"
          onChange={(value) => updateSettings({ description: value })}
          isTextarea
          rows={3}
        />
        <BasicInfoField
          id="submit-text"
          label="Submit Button Text"
          value={localSettings.submitText || "Submit"}
          placeholder="Submit"
          onChange={(value) => updateSettings({ submitText: value })}
        />
        <BasicInfoField
          id="success-message"
          label="Success Message"
          value={localSettings.successMessage || ""}
          placeholder="Thank you for your submission!"
          onChange={(value) => updateSettings({ successMessage: value })}
          isTextarea
          rows={2}
        />
        <BasicInfoField
          id="redirect-url"
          label="Redirect URL (optional)"
          value={localSettings.redirectUrl || ""}
          placeholder="https://example.com/thank-you"
          onChange={(value) => updateSettings({ redirectUrl: value })}
        />
        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="rtl-toggle"
            checked={!!localSettings.rtl}
            onChange={(e) =>
              updateSettings({ rtl: (e.target as HTMLInputElement).checked })
            }
            className="accent-primary w-4 h-4"
          />
          <Label htmlFor="rtl-toggle" className="cursor-pointer select-none">
            Display form in RTL (Right-to-Left) mode
          </Label>
        </div>
      </div>
    </Card>
  );
}

function BasicInfoField({
  id,
  label,
  value,
  placeholder,
  onChange,
  isTextarea = false,
  rows,
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  isTextarea?: boolean;
  rows?: number;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {isTextarea ? (
        <Textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
        />
      ) : (
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
