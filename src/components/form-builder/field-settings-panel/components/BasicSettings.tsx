import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import type { BasicSettingsProps } from "../types";

import { createFieldUpdater } from "../utils";

export const BasicSettings: React.FC<BasicSettingsProps> = ({
  field,
  onFieldUpdate,
}) => {
  const { updateField } = createFieldUpdater(field, onFieldUpdate);

  return (
    <Card className="gap-2 p-4 shadow-none">
      <CardHeader className="p-0">
        <CardTitle className="text-lg">Basic Settings</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-0">
        <div className="flex flex-col gap-2">
          <Label className="font-medium text-sm" htmlFor="field-label">
            Field Label
          </Label>
          <Input
            aria-describedby="field-label-help"
            autoComplete="off"
            id="field-label"
            name="field-label"
            onChange={(e) => updateField({ label: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.currentTarget.blur();
              }
            }}
            placeholder="Enter field label"
            type="text"
            value={field.label}
          />
          <p className="text-muted-foreground text-xs" id="field-label-help">
            The label that appears above the field
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="font-medium text-sm" htmlFor="field-placeholder">
            Placeholder
          </Label>
          <Input
            aria-describedby="field-placeholder-help"
            autoComplete="off"
            id="field-placeholder"
            name="field-placeholder"
            onChange={(e) => updateField({ placeholder: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.currentTarget.blur();
              }
            }}
            placeholder="Enter placeholder text"
            type="text"
            value={field.placeholder || ""}
          />
          <p
            className="text-muted-foreground text-xs"
            id="field-placeholder-help"
          >
            Hint text that appears inside the field
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="font-medium text-sm" htmlFor="field-description">
            Description
          </Label>
          <Textarea
            aria-describedby="field-description-help"
            className="resize-none"
            id="field-description"
            name="field-description"
            onChange={(e) => updateField({ description: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.currentTarget.blur();
              } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                e.currentTarget.blur();
              }
            }}
            placeholder="Enter field description (shown below the field)"
            rows={2}
            value={field.description || ""}
          />
          <p
            className="text-muted-foreground text-xs"
            id="field-description-help"
          >
            Additional help text shown below the field
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <Label className="font-medium text-sm" htmlFor="field-required">
              Required field
            </Label>
            <p className="text-muted-foreground text-xs">
              Users must fill this field to submit the form
            </p>
          </div>
          <Switch
            aria-describedby="field-required-help"
            checked={field.required}
            id="field-required"
            name="field-required"
            onCheckedChange={(required) => updateField({ required })}
          />
        </div>
      </CardContent>
    </Card>
  );
};
