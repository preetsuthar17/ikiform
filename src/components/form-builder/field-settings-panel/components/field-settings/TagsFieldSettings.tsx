import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { FieldSettingsProps } from "./types";

export function TagsFieldSettings({
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
        <CardTitle className="text-lg">Tags Settings</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-0">
        <div className="flex flex-col gap-2">
          <Label className="font-medium text-sm" htmlFor="tags-max">
            Maximum Tags
          </Label>
          <Input
            aria-describedby="tags-max-help"
            autoComplete="off"
            id="tags-max"
            min="1"
            name="tags-max"
            onChange={(e) =>
              onUpdateSettings({
                maxTags: Number.parseInt(e.target.value) || 10,
              })
            }
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.currentTarget.blur();
              }
            }}
            type="number"
            value={field.settings?.maxTags || 10}
          />
          <p className="text-muted-foreground text-xs" id="tags-max-help">
            Maximum number of tags users can add (minimum 1)
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <Label className="font-medium text-sm" htmlFor="tags-duplicates">
              Allow Duplicate Tags
            </Label>
            <p className="text-muted-foreground text-xs">
              Allow users to add the same tag multiple times
            </p>
          </div>
          <Switch
            aria-describedby="tags-duplicates-help"
            checked={field.settings?.allowDuplicates}
            id="tags-duplicates"
            name="tags-duplicates"
            onCheckedChange={(checked) =>
              onUpdateSettings({ allowDuplicates: checked })
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
