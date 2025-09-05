import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { FieldSettingsProps } from "./types";

export function StatementFieldSettings({
  field,
  onUpdateSettings,
  onFieldUpdate,
}: FieldSettingsProps) {
  const updateStatementHeading = (heading: string) => {
    onUpdateSettings({ statementHeading: heading });
  };

  const updateStatementDescription = (description: string) => {
    onUpdateSettings({ statementDescription: description });
  };

  const updateStatementAlign = (align: "left" | "center" | "right") => {
    onUpdateSettings({ statementAlign: align });
  };

  const updateStatementSize = (size: "sm" | "md" | "lg") => {
    onUpdateSettings({ statementSize: size });
  };

  return (
    <Card className="flex flex-col gap-4 rounded-card bg-background p-4">
      <h3 className="font-medium text-card-foreground">
        Statement Field Settings
      </h3>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label className="text-card-foreground" htmlFor="statement-heading">
            Heading
          </Label>
          <Textarea
            className="border-border bg-input"
            id="statement-heading"
            onChange={(e) => updateStatementHeading(e.target.value)}
            placeholder="Enter statement heading"
            rows={2}
            value={field.settings?.statementHeading || ""}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label
            className="text-card-foreground"
            htmlFor="statement-description"
          >
            Description
          </Label>
          <Textarea
            className="border-border bg-input"
            id="statement-description"
            onChange={(e) => updateStatementDescription(e.target.value)}
            placeholder="Enter statement description"
            rows={3}
            value={field.settings?.statementDescription || ""}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-card-foreground" htmlFor="statement-align">
            Alignment
          </Label>
          <Select
            onValueChange={updateStatementAlign}
            value={field.settings?.statementAlign || "left"}
          >
            <SelectTrigger className="border-border bg-input">
              <SelectValue placeholder="Select alignment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-card-foreground" htmlFor="statement-size">
            Size
          </Label>
          <Select
            onValueChange={updateStatementSize}
            value={field.settings?.statementSize || "md"}
          >
            <SelectTrigger className="border-border bg-input">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sm">Small</SelectItem>
              <SelectItem value="md">Medium</SelectItem>
              <SelectItem value="lg">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}
