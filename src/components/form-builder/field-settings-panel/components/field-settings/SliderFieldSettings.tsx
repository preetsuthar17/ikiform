import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FieldSettingsProps } from "./types";

export function SliderFieldSettings({
  field,
  onUpdateSettings,
}: FieldSettingsProps) {
  return (
    <Card className="gap-2 p-4 shadow-none">
      <CardHeader className="p-0">
        <CardTitle className="text-lg">Slider Settings</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-0">
        <div className="flex flex-col gap-2">
          <Label className="font-medium text-sm" htmlFor="slider-min">
            Minimum Value
          </Label>
          <Input
            aria-describedby="slider-min-help"
            autoComplete="off"
            id="slider-min"
            name="slider-min"
            onChange={(e) =>
              onUpdateSettings({
                min: Number.parseInt(e.target.value) || 0,
              })
            }
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.currentTarget.blur();
              }
            }}
            type="number"
            value={field.settings?.min || 0}
          />
          <p className="text-muted-foreground text-xs" id="slider-min-help">
            Minimum value for the slider
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="font-medium text-sm" htmlFor="slider-max">
            Maximum Value
          </Label>
          <Input
            aria-describedby="slider-max-help"
            autoComplete="off"
            id="slider-max"
            name="slider-max"
            onChange={(e) =>
              onUpdateSettings({
                max: Number.parseInt(e.target.value) || 100,
              })
            }
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.currentTarget.blur();
              }
            }}
            type="number"
            value={field.settings?.max || 100}
          />
          <p className="text-muted-foreground text-xs" id="slider-max-help">
            Maximum value for the slider
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="font-medium text-sm" htmlFor="slider-step">
            Step Size
          </Label>
          <Input
            aria-describedby="slider-step-help"
            autoComplete="off"
            id="slider-step"
            min="1"
            name="slider-step"
            onChange={(e) =>
              onUpdateSettings({
                step: Number.parseInt(e.target.value) || 1,
              })
            }
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.currentTarget.blur();
              }
            }}
            type="number"
            value={field.settings?.step || 1}
          />
          <p className="text-muted-foreground text-xs" id="slider-step-help">
            Increment/decrement step size for the slider
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="font-medium text-sm" htmlFor="slider-default">
            Default Value
          </Label>
          <Input
            aria-describedby="slider-default-help"
            autoComplete="off"
            id="slider-default"
            name="slider-default"
            onChange={(e) =>
              onUpdateSettings({
                defaultValue: Number.parseInt(e.target.value) || 50,
              })
            }
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.currentTarget.blur();
              }
            }}
            type="number"
            value={field.settings?.defaultValue || 50}
          />
          <p className="text-muted-foreground text-xs" id="slider-default-help">
            Pre-filled value when the form loads
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
