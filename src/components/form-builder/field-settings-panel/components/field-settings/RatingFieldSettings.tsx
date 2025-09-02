import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import type { FieldSettingsProps } from "./types";

export function RatingFieldSettings({
  field,
  onUpdateSettings,
}: FieldSettingsProps) {
  return (
    <Card className="flex flex-col gap-3 rounded-card bg-background p-4">
      <h3 className="mb-2 font-medium text-card-foreground">Rating Settings</h3>
      <div className="grid grid-cols-2 items-center gap-2">
        <Label className="text-card-foreground" htmlFor="rating-star-count">
          Number of Stars
        </Label>
        <Input
          className="w-20"
          id="rating-star-count"
          max={10}
          min={1}
          onChange={(e) =>
            onUpdateSettings({
              starCount: Math.max(
                1,
                Math.min(10, Number.parseInt(e.target.value) || 5)
              ),
            })
          }
          type="number"
          value={field.settings?.starCount || 5}
        />
        <Label className="text-card-foreground" htmlFor="rating-star-size">
          Star Size
        </Label>
        <div className="flex items-center gap-2">
          <Slider
            className="w-28"
            max={64}
            min={16}
            onValueChange={([val]) => onUpdateSettings({ starSize: val })}
            step={1}
            value={[field.settings?.starSize || 28]}
          />
          <span className="w-8 text-right text-muted-foreground text-xs">
            {field.settings?.starSize || 28}px
          </span>
        </div>
        <Label className="text-card-foreground" htmlFor="rating-icon">
          Icon Type
        </Label>
        <Select
          onValueChange={(val) => onUpdateSettings({ icon: val })}
          value={field.settings?.icon || "star"}
        >
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="star">Star</SelectItem>
            <SelectItem value="heart">Heart</SelectItem>
          </SelectContent>
        </Select>
        <Label className="text-card-foreground" htmlFor="rating-color">
          Icon Color
        </Label>
        <Input
          className="h-8 w-12 border-none bg-transparent p-0"
          id="rating-color"
          onChange={(e) => onUpdateSettings({ color: e.target.value })}
          type="color"
          value={field.settings?.color || "#fbbf24"}
        />
      </div>
    </Card>
  );
}
