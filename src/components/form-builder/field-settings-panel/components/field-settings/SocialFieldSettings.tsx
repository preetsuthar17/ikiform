import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FieldSettingsProps } from "./types";

export function SocialFieldSettings({
  field,
  onUpdateSettings,
}: FieldSettingsProps) {
  return (
    <Card className="gap-2 p-4 shadow-none">
      <CardHeader className="p-0">
        <CardTitle className="text-lg">Social Platforms</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-0">
        <div className="flex flex-col gap-2">
          <Label className="font-medium text-sm" htmlFor="social-platforms">
            Available Platforms
          </Label>
          <div
            aria-labelledby="social-platforms"
            className="flex flex-wrap gap-3"
            id="social-platforms"
            role="group"
          >
            {[
              { key: "github", label: "GitHub" },
              { key: "twitter", label: "Twitter" },
              { key: "linkedin", label: "LinkedIn" },
              { key: "facebook", label: "Facebook" },
              { key: "instagram", label: "Instagram" },
              { key: "youtube", label: "YouTube" },
              { key: "website", label: "Website" },
            ].map((platform) => (
              <div
                className="flex items-center gap-2 rounded-md p-2 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 hover:bg-accent"
                key={platform.key}
              >
                <Checkbox
                  aria-describedby="social-platforms-help"
                  checked={field.settings?.socialPlatforms?.includes(
                    platform.key
                  )}
                  id={`social-platform-${platform.key}`}
                  name={`social-platform-${platform.key}`}
                  onCheckedChange={(checked) => {
                    const prev = field.settings?.socialPlatforms || [];
                    onUpdateSettings({
                      socialPlatforms: checked
                        ? [...prev, platform.key]
                        : prev.filter((p) => p !== platform.key),
                    });
                  }}
                />
                <Label
                  className="text-sm"
                  htmlFor={`social-platform-${platform.key}`}
                >
                  {platform.label}
                </Label>
              </div>
            ))}
          </div>
          <p
            className="text-muted-foreground text-xs"
            id="social-platforms-help"
          >
            Select which social platforms to include in the field
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="font-medium text-sm" htmlFor="custom-links">
            Custom Links
          </Label>
          <div className="flex flex-col gap-2">
            {(field.settings?.customLinks || []).map((link, idx) => (
              <div className="flex items-center gap-2" key={idx}>
                <Input
                  aria-describedby={`custom-link-${idx}-label-help`}
                  autoComplete="off"
                  className="flex-1"
                  id={`custom-link-${idx}-label`}
                  name={`custom-link-${idx}-label`}
                  onChange={(e) => {
                    const updated = [...(field.settings?.customLinks || [])];
                    updated[idx] = {
                      ...updated[idx],
                      label: e.target.value.trim(),
                    };
                    onUpdateSettings({ customLinks: updated });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      e.currentTarget.blur();
                    }
                  }}
                  placeholder="Label"
                  type="text"
                  value={link.label}
                />
                <Input
                  aria-describedby={`custom-link-${idx}-placeholder-help`}
                  autoComplete="off"
                  className="flex-1"
                  id={`custom-link-${idx}-placeholder`}
                  name={`custom-link-${idx}-placeholder`}
                  onChange={(e) => {
                    const updated = [...(field.settings?.customLinks || [])];
                    updated[idx] = {
                      ...updated[idx],
                      placeholder: e.target.value.trim(),
                    };
                    onUpdateSettings({ customLinks: updated });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      e.currentTarget.blur();
                    }
                  }}
                  placeholder="Placeholder (optional)"
                  type="text"
                  value={link.placeholder || ""}
                />
                <Button
                  aria-label={`Remove custom link ${idx + 1}`}
                  className="shrink-0 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                  onClick={() => {
                    const updated = [...(field.settings?.customLinks || [])];
                    updated.splice(idx, 1);
                    onUpdateSettings({ customLinks: updated });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      const updated = [...(field.settings?.customLinks || [])];
                      updated.splice(idx, 1);
                      onUpdateSettings({ customLinks: updated });
                    }
                  }}
                  size="icon"
                  type="button"
                  variant="destructive"
                >
                  <X aria-hidden="true" className="size-4" />
                </Button>
              </div>
            ))}
            <Button
              aria-label="Add custom link"
              className="w-fit focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
              onClick={() => {
                const updated = [
                  ...(field.settings?.customLinks || []),
                  { label: "", placeholder: "" },
                ];
                onUpdateSettings({ customLinks: updated });
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  const updated = [
                    ...(field.settings?.customLinks || []),
                    { label: "", placeholder: "" },
                  ];
                  onUpdateSettings({ customLinks: updated });
                }
              }}
              size="sm"
              type="button"
              variant="outline"
            >
              <Plus aria-hidden="true" className="size-4" />
              Add Custom Link
            </Button>
          </div>
          <p className="text-muted-foreground text-xs" id="custom-links-help">
            Add custom social links with custom labels and placeholders
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
