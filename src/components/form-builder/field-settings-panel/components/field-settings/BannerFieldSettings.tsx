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
import { Textarea } from "@/components/ui/textarea";
import type { FieldSettingsProps } from "./types";

export function BannerFieldSettings({
  field,
  onUpdateSettings,
}: FieldSettingsProps) {
  const variant = (field.settings?.bannerVariant as string) || "info";
  const title = field.settings?.bannerTitle || "";
  const description = field.settings?.bannerDescription || "";

  return (
    <Card className="flex flex-col gap-4 rounded-2xl bg-background p-4">
      <h3 className="font-medium text-card-foreground">Banner Settings</h3>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label className="text-card-foreground" htmlFor="banner-variant">
            Alert Type
          </Label>
          <Select
            onValueChange={(v) =>
              onUpdateSettings({
                bannerVariant: v as "warning" | "error" | "info" | "success",
              })
            }
            value={variant}
          >
            <SelectTrigger
              className="border-border bg-input"
              id="banner-variant"
            >
              <SelectValue placeholder="Select alert type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="success">Success</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-card-foreground" htmlFor="banner-title">
            Title
          </Label>
          <Input
            className="border-border bg-input"
            id="banner-title"
            onChange={(e) => onUpdateSettings({ bannerTitle: e.target.value })}
            placeholder="Smoke-free"
            value={title}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-card-foreground" htmlFor="banner-description">
            Description
          </Label>
          <Textarea
            className="min-h-24 border-border bg-input"
            id="banner-description"
            onChange={(e) =>
              onUpdateSettings({ bannerDescription: e.target.value })
            }
            placeholder="Our accommodations are strictly smoke-free..."
            value={description}
          />
        </div>
      </div>
    </Card>
  );
}
