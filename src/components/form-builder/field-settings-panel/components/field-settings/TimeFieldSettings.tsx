import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { FieldSettingsProps } from "./types";

export function TimeFieldSettings({
  field,
  onUpdateSettings,
}: FieldSettingsProps) {
  return (
    <Card
      className="gap-2 p-4 shadow-none"
      style={{
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <CardHeader className="p-0">
        <CardTitle className="text-lg">Time Field Settings</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-0">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <Label
              className="font-medium text-sm"
              htmlFor="showCurrentTimeButton"
            >
              Show 'Set Current Time' Button
            </Label>
            <p className="text-muted-foreground text-xs">
              Display a button to automatically set the current time
            </p>
          </div>
          <Switch
            aria-describedby="showCurrentTimeButton-help"
            checked={!!field.settings?.showCurrentTimeButton}
            id="showCurrentTimeButton"
            name="showCurrentTimeButton"
            onCheckedChange={(checked) =>
              onUpdateSettings({ showCurrentTimeButton: checked })
            }
            style={{
              touchAction: "manipulation",
              WebkitTapHighlightColor: "transparent",
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
