import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="gap-2 p-4 shadow-none">
      <CardHeader className="p-0">
        <CardTitle className="text-lg">Rating Settings</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-0">
        <div className="flex flex-col gap-2">
          <Label className="font-medium text-sm" htmlFor="rating-star-count">
            Number of Stars
          </Label>
          <Input
            aria-describedby="rating-star-count-help"
            autoComplete="off"
            className="w-20"
            id="rating-star-count"
            max={10}
            min={1}
            name="rating-star-count"
            onChange={(e) =>
              onUpdateSettings({
                starCount: Math.max(
                  1,
                  Math.min(10, Number.parseInt(e.target.value) || 5)
                ),
              })
            }
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.currentTarget.blur();
              }
            }}
            type="number"
            value={field.settings?.starCount || 5}
          />
          <p
            className="text-muted-foreground text-xs"
            id="rating-star-count-help"
          >
            Number of rating stars (1-10)
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="font-medium text-sm" htmlFor="rating-star-size">
            Star Size
          </Label>
          <div className="flex items-center gap-2">
            <Slider
              aria-describedby="rating-star-size-help"
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
          <p
            className="text-muted-foreground text-xs"
            id="rating-star-size-help"
          >
            Size of the rating stars (16-64px)
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="font-medium text-sm" htmlFor="rating-icon">
            Icon Type
          </Label>
          <Select
            onValueChange={(val) => onUpdateSettings({ icon: val })}
            value={field.settings?.icon || "star"}
          >
            <SelectTrigger className="w-24" id="rating-icon">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="star">Star</SelectItem>
              <SelectItem value="heart">Heart</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-muted-foreground text-xs" id="rating-icon-help">
            Choose the icon type for ratings
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="font-medium text-sm" htmlFor="rating-color">
            Icon Color
          </Label>
          <Input
            aria-describedby="rating-color-help"
            className="h-8 w-12 border-none bg-transparent p-0"
            id="rating-color"
            name="rating-color"
            onChange={(e) => onUpdateSettings({ color: e.target.value })}
            type="color"
            value={field.settings?.color || "#fbbf24"}
          />
          <p className="text-muted-foreground text-xs" id="rating-color-help">
            Color of the rating icons
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
