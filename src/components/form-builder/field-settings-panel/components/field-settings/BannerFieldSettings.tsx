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
    <Card
      className="gap-2 p-4 shadow-none"
      style={{
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <CardHeader className="p-0">
        <CardTitle className="text-lg">Banner Settings</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-0">
        <div className="flex flex-col gap-2">
          <Label className="font-medium text-sm" htmlFor="banner-variant">
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
            <SelectTrigger className="w-full" id="banner-variant">
              <SelectValue placeholder="Select alert type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="success">Success</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-muted-foreground text-xs" id="banner-variant-help">
            Choose the visual style and color scheme for the banner
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="font-medium text-sm" htmlFor="banner-title">
            Title
          </Label>
          <Input
            aria-describedby="banner-title-help"
            autoComplete="off"
            id="banner-title"
            name="banner-title"
            onChange={(e) =>
              onUpdateSettings({ bannerTitle: e.target.value.trim() })
            }
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.currentTarget.blur();
              }
            }}
            placeholder="Smoke-free"
            type="text"
            value={title}
          />
          <p className="text-muted-foreground text-xs" id="banner-title-help">
            Main title text for the banner
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="font-medium text-sm" htmlFor="banner-description">
            Description
          </Label>
          <Textarea
            aria-describedby="banner-description-help"
            className="min-h-24 resize-none"
            id="banner-description"
            name="banner-description"
            onChange={(e) =>
              onUpdateSettings({ bannerDescription: e.target.value.trim() })
            }
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.currentTarget.blur();
              } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                e.currentTarget.blur();
              }
            }}
            placeholder="Our accommodations are strictly smoke-free..."
            value={description}
          />
          <p
            className="text-muted-foreground text-xs"
            id="banner-description-help"
          >
            Detailed description text for the banner
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
