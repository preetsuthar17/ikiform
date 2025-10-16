import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SocialMediaIcons } from "@/components/ui/social-media-icons";
import { Switch } from "@/components/ui/switch";

import { toast } from "@/hooks/use-toast";
import { formsDb } from "@/lib/database";
import type { SocialMediaSectionProps } from "../types";

interface BrandingSectionProps extends SocialMediaSectionProps {
  updateSettings: (updates: any) => void;
  formId?: string;
  schema?: any;
}

export function BrandingSection({
  localSettings,
  updateSocialMedia,
  updateSettings,
  formId,
  schema,
}: BrandingSectionProps) {
  const socialMedia = localSettings.branding?.socialMedia || {};
  const showIkiformBranding =
    localSettings.branding?.showIkiformBranding !== false;

  const platforms = socialMedia.platforms || {};
  const [hasChanges, setHasChanges] = useState(false as boolean);
  const [saving, setSaving] = useState(false as boolean);
  const [saved, setSaved] = useState(false as boolean);

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () =>
      window.removeEventListener(
        "beforeunload",
        onBeforeUnload as unknown as EventListener
      );
  }, [hasChanges]);

  // mark changes on any updateSocialMedia/updateSettings
  const wrappedUpdateSocial = (updates: any) => {
    updateSocialMedia(updates);
    setHasChanges(true);
    setSaved(false);
  };
  const wrappedUpdateSettings = (updates: any) => {
    updateSettings(updates);
    setHasChanges(true);
    setSaved(false);
  };

  const handlePlatformChange = (platform: string, url: string) => {
    const updatedPlatforms = {
      ...socialMedia.platforms,
      [platform]: url,
    };
    wrappedUpdateSocial({ platforms: updatedPlatforms });
  };

  const handleSettingChange = (key: string, value: any) => {
    wrappedUpdateSocial({ [key]: value });
  };

  const handleBrandingToggle = (show: boolean) => {
    wrappedUpdateSettings({
      branding: { ...localSettings.branding, showIkiformBranding: show },
    });
  };

  const resetBranding = () => {
    // reset to current schema values
    const original = (schema?.settings as any)?.branding || {};
    wrappedUpdateSettings({ branding: original });
    setHasChanges(false);
  };

  const saveBranding = async () => {
    if (!formId) {
      toast.error("Form ID is required to save settings");
      return;
    }
    setSaving(true);
    try {
      const trimmed = {
        ...localSettings.branding,
        socialMedia: {
          ...localSettings.branding?.socialMedia,
          platforms: Object.fromEntries(
            Object.entries(
              localSettings.branding?.socialMedia?.platforms || {}
            ).map(([key, value]) => [key, ((value as string) || "").trim()])
          ),
        },
      };
      const newSchema = {
        ...schema,
        settings: {
          ...schema.settings,
          branding: trimmed,
        },
      };
      await formsDb.updateForm(formId, { schema: newSchema as any });
      setSaved(true);
      setHasChanges(false);
      toast.success("Branding settings saved successfully");
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error(e);
      toast.error("Failed to save branding settings");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (saved) {
      const announcement = document.createElement("div");
      announcement.setAttribute("aria-live", "polite");
      announcement.setAttribute("aria-atomic", "true");
      announcement.className = "sr-only";
      announcement.textContent = "Branding settings saved successfully";
      document.body.appendChild(announcement);
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }
  }, [saved]);

  return (
    <Card
      aria-labelledby="branding-title"
      className="shadow-none"
      onKeyDown={(e) => {
        const target = e.target as HTMLElement;
        const isTextarea = target.tagName === "TEXTAREA";
        if (isTextarea && e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          saveBranding();
        }
      }}
      role="region"
      style={{
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent",
        overscrollBehavior: "contain",
      }}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle
              className="flex items-center gap-2 text-lg tracking-tight"
              id="branding-title"
            >
              Branding
            </CardTitle>
            <CardDescription id="branding-description">
              Manage Ikiform branding and social media links
            </CardDescription>
          </div>
          {hasChanges && (
            <Badge className="gap-2" variant="secondary">
              <div className="size-2 rounded-full bg-orange-500" />
              Unsaved changes
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <Label
              className="font-medium text-sm"
              htmlFor="ikiform-branding-toggle"
            >
              Show "Powered by Ikiform"
            </Label>
            <p
              className="text-muted-foreground text-xs"
              id="ikiform-branding-description"
            >
              Display a small attribution in the footer
            </p>
          </div>
          <Switch
            aria-describedby="ikiform-branding-description"
            checked={showIkiformBranding}
            id="ikiform-branding-toggle"
            onCheckedChange={handleBrandingToggle}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <Label
              className="font-medium text-sm"
              htmlFor="social-media-enabled"
            >
              Social Media Links
            </Label>
            <p className="text-muted-foreground text-xs">
              Enable links to your social profiles on the form
            </p>
          </div>
          <Switch
            checked={socialMedia.enabled}
            id="social-media-enabled"
            onCheckedChange={(checked) =>
              handleSettingChange("enabled", checked)
            }
          />
        </div>

        {socialMedia.enabled ? (
          <>
            <div className="grid gap-4">
              {(
                [
                  {
                    id: "linkedin",
                    label: "LinkedIn",
                    placeholder: "https://linkedin.com/in/username",
                  },
                  {
                    id: "twitter",
                    label: "X (Twitter)",
                    placeholder: "https://x.com/username",
                  },
                  {
                    id: "youtube",
                    label: "YouTube",
                    placeholder: "https://youtube.com/@channel",
                  },
                  {
                    id: "instagram",
                    label: "Instagram",
                    placeholder: "https://instagram.com/username",
                  },
                  {
                    id: "facebook",
                    label: "Facebook",
                    placeholder: "https://facebook.com/username",
                  },
                  {
                    id: "github",
                    label: "GitHub",
                    placeholder: "https://github.com/username",
                  },
                  {
                    id: "website",
                    label: "Website",
                    placeholder: "https://example.com",
                  },
                ] as const
              ).map(({ id, label, placeholder }) => (
                <div className="flex flex-col gap-2" key={id}>
                  <Label className="font-medium text-sm" htmlFor={id}>
                    {label}
                  </Label>
                  <Input
                    className="text-base shadow-none md:text-sm"
                    id={id}
                    name={`social-${id}`}
                    onChange={(e) => handlePlatformChange(id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        (e.target as HTMLElement).blur();
                      }
                    }}
                    placeholder={placeholder}
                    type="url"
                    value={platforms[id as keyof typeof platforms] || ""}
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label className="font-medium text-sm" htmlFor="icon-size">
                  Icon Size
                </Label>
                <Select
                  onValueChange={(value) =>
                    handleSettingChange("iconSize", value)
                  }
                  value={socialMedia.iconSize || "md"}
                >
                  <SelectTrigger className="shadow-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="shadow-xs">
                    <SelectItem value="sm">Small</SelectItem>
                    <SelectItem value="md">Medium</SelectItem>
                    <SelectItem value="lg">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label className="font-medium text-sm" htmlFor="position">
                  Position
                </Label>
                <Select
                  onValueChange={(value) =>
                    handleSettingChange("position", value)
                  }
                  value={socialMedia.position || "footer"}
                >
                  <SelectTrigger className="shadow-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="shadow-xs">
                    <SelectItem value="footer">Footer</SelectItem>
                    <SelectItem value="header">Header</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {socialMedia.showIcons !== false && (
              <div className="rounded-lg border p-4">
                <Label className="font-medium text-sm">Preview</Label>
                <SocialMediaIcons
                  className="justify-center"
                  iconSize={socialMedia.iconSize || "md"}
                  platforms={platforms}
                />
              </div>
            )}
          </>
        ) : (
          <div className="rounded-lg bg-muted/30 p-4">
            <p className="text-muted-foreground text-sm">
              Enable social media links to display your social profiles on your
              forms.
            </p>
          </div>
        )}

        <div
          aria-label="Branding settings actions"
          className="flex items-center justify-between"
          role="group"
        >
          <div className="flex items-center gap-2">
            {hasChanges && (
              <Button
                className="gap-2 text-muted-foreground hover:text-foreground"
                onClick={resetBranding}
                size="sm"
                variant="ghost"
              >
                Reset
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {saved && (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <div className="size-2 rounded-full bg-green-500" />
                Saved
              </div>
            )}
            <Button
              aria-describedby="branding-description"
              aria-label="Save branding settings"
              disabled={saving || !hasChanges}
              loading={saving}
              onClick={saveBranding}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  saveBranding();
                }
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
