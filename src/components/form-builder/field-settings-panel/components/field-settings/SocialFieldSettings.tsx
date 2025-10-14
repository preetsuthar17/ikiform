import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { FieldSettingsProps } from "./types";

export function SocialFieldSettings({
  field,
  onUpdateSettings,
}: FieldSettingsProps) {
  return (
    <Card className="flex flex-col gap-4 rounded-2xl bg-background p-4">
      <h3 className="font-medium text-card-foreground">Social Platforms</h3>
      <div className="mb-2 flex flex-wrap gap-3">
        {[
          { key: "github", label: "GitHub" },
          { key: "twitter", label: "Twitter" },
          { key: "linkedin", label: "LinkedIn" },
          { key: "facebook", label: "Facebook" },
          { key: "instagram", label: "Instagram" },
          { key: "youtube", label: "YouTube" },
          { key: "website", label: "Website" },
        ].map((platform) => (
          <label
            className="flex cursor-pointer items-center gap-2"
            key={platform.key}
          >
            <input
              checked={field.settings?.socialPlatforms?.includes(platform.key)}
              onChange={(e) => {
                const prev = field.settings?.socialPlatforms || [];
                onUpdateSettings({
                  socialPlatforms: e.target.checked
                    ? [...prev, platform.key]
                    : prev.filter((p) => p !== platform.key),
                });
              }}
              type="checkbox"
            />
            {platform.label}
          </label>
        ))}
      </div>
      <h4 className="mt-4 font-medium text-card-foreground">Custom Links</h4>
      <div className="flex flex-col gap-2">
        {(field.settings?.customLinks || []).map((link, idx) => (
          <div className="flex items-center gap-2" key={idx}>
            <Input
              onChange={(e) => {
                const updated = [...(field.settings?.customLinks || [])];
                updated[idx] = { ...updated[idx], label: e.target.value };
                onUpdateSettings({ customLinks: updated });
              }}
              placeholder="Label"
              type="text"
              value={link.label}
            />
            <Input
              onChange={(e) => {
                const updated = [...(field.settings?.customLinks || [])];
                updated[idx] = {
                  ...updated[idx],
                  placeholder: e.target.value,
                };
                onUpdateSettings({ customLinks: updated });
              }}
              placeholder="Placeholder (optional)"
              type="text"
              value={link.placeholder || ""}
            />
            <Button
              className="shrink-0"
              onClick={() => {
                const updated = [...(field.settings?.customLinks || [])];
                updated.splice(idx, 1);
                onUpdateSettings({ customLinks: updated });
              }}
              size="icon"
              type="button"
              variant="destructive"
            >
              ×
            </Button>
          </div>
        ))}
        <Button
          className="mt-2 w-fit"
          onClick={() => {
            const updated = [
              ...(field.settings?.customLinks || []),
              { label: "", placeholder: "" },
            ];
            onUpdateSettings({ customLinks: updated });
          }}
          size="sm"
          type="button"
          variant="outline"
        >
          + Add Custom Link
        </Button>
      </div>
    </Card>
  );
}
