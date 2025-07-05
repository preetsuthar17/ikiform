// External imports
import React from "react";

// Component imports
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Type imports
import type { FormField } from "@/lib/database";

interface VisualSettingsProps {
  field: FormField;
  onUpdateSettings: (updates: Partial<FormField["settings"]>) => void;
}

export function VisualSettings({
  field,
  onUpdateSettings,
}: VisualSettingsProps) {
  return (
    <Card className="p-4 bg-background flex flex-col gap-4 rounded-card">
      <h3 className="font-medium mb-3 text-card-foreground">Visual Settings</h3>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="help-text" className="text-card-foreground">
            Help Text
          </Label>
          <Textarea
            id="help-text"
            value={field.settings?.helpText || ""}
            onChange={(e) =>
              onUpdateSettings({ helpText: e.target.value || undefined })
            }
            placeholder="Additional help text shown below the field"
            className="bg-input border-border"
            rows={2}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="field-size" className="text-card-foreground">
              Size
            </Label>
            <Select
              value={field.settings?.size || "md"}
              onValueChange={(value) =>
                onUpdateSettings({
                  size: value as "sm" | "md" | "lg",
                })
              }
            >
              <SelectTrigger className="bg-input border-border">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="field-width" className="text-card-foreground">
              Width
            </Label>
            <Select
              value={field.settings?.width || "full"}
              onValueChange={(value) =>
                onUpdateSettings({
                  width: value as "full" | "half" | "third" | "quarter",
                })
              }
            >
              <SelectTrigger className="bg-input border-border">
                <SelectValue placeholder="Select width" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full Width</SelectItem>
                <SelectItem value="half">Half Width</SelectItem>
                <SelectItem value="third">Third Width</SelectItem>
                <SelectItem value="quarter">Quarter Width</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="field-variant" className="text-card-foreground">
            Variant
          </Label>
          <Select
            value={field.settings?.variant || "default"}
            onValueChange={(value) =>
              onUpdateSettings({
                variant: value as "default" | "filled" | "ghost" | "underline",
              })
            }
          >
            <SelectTrigger className="bg-input border-border">
              <SelectValue placeholder="Select variant" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="filled">Filled</SelectItem>
              <SelectItem value="ghost">Ghost</SelectItem>
              <SelectItem value="underline">Underline</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}
