// External libraries
import React from "react";

// UI components
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SocialMediaIcons } from "@/components/ui/social-media-icons";

// Types
import type { SocialMediaSectionProps } from "../types";

interface BrandingSectionProps extends SocialMediaSectionProps {
  updateSettings: (updates: any) => void;
}

export function BrandingSection({
  localSettings,
  updateSocialMedia,
  updateSettings,
}: BrandingSectionProps) {
  const socialMedia = localSettings.branding?.socialMedia || {};
  const showIkiformBranding =
    localSettings.branding?.showIkiformBranding !== false;

  const handlePlatformChange = (platform: string, url: string) => {
    const updatedPlatforms = {
      ...socialMedia.platforms,
      [platform]: url,
    };
    updateSocialMedia({ platforms: updatedPlatforms });
  };

  const handleSettingChange = (key: string, value: any) => {
    updateSocialMedia({ [key]: value });
  };

  const handleBrandingToggle = (show: boolean) => {
    updateSettings({
      branding: { ...localSettings.branding, showIkiformBranding: show },
    });
  };

  const platforms = socialMedia.platforms || {};

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <svg
          className="w-5 h-5 text-primary"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
          <path d="M16 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
          <path d="M7 16a4 4 0 0 1 10 0" />
        </svg>
        <h3 className="text-lg font-medium">Branding</h3>
      </div>
      <div className="flex flex-col gap-6 border-l-2 border-muted pl-6">
        <div className="flex items-center gap-2">
          <Switch
            size="sm"
            id="ikiform-branding-toggle"
            checked={showIkiformBranding}
            onCheckedChange={handleBrandingToggle}
          />
          <Label
            htmlFor="ikiform-branding-toggle"
            className="text-sm font-medium"
          >
            Show "Powered by Ikiform" branding
          </Label>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-base font-medium">Social Media Links</Label>
          <Switch
            size="sm"
            id="social-media-enabled"
            checked={socialMedia.enabled || false}
            onCheckedChange={(checked) =>
              handleSettingChange("enabled", checked)
            }
          />
        </div>
        {socialMedia.enabled ? (
          <>
            <div className="flex flex-col gap-4">
              <div className="grid gap-4">
                {/* Social media platform fields (LinkedIn, Twitter, etc.) */}
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
                    <Label htmlFor={id} className="text-sm font-medium">
                      {label}
                    </Label>
                    <Input
                      id={id}
                      type="url"
                      placeholder={placeholder}
                      value={platforms[id as keyof typeof platforms] || ""}
                      onChange={(e) => handlePlatformChange(id, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  size="sm"
                  id="show-icons"
                  checked={socialMedia.showIcons !== false}
                  onCheckedChange={(checked) =>
                    handleSettingChange("showIcons", checked)
                  }
                />
                <Label htmlFor="show-icons" className="text-sm font-medium">
                  Show Icons
                </Label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="icon-size" className="text-sm font-medium">
                    Icon Size
                  </Label>
                  <Select
                    value={socialMedia.iconSize || "md"}
                    onValueChange={(value) =>
                      handleSettingChange("iconSize", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sm">Small</SelectItem>
                      <SelectItem value="md">Medium</SelectItem>
                      <SelectItem value="lg">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="position" className="text-sm font-medium">
                    Position
                  </Label>
                  <Select
                    value={socialMedia.position || "footer"}
                    onValueChange={(value) =>
                      handleSettingChange("position", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="footer">Footer</SelectItem>
                      <SelectItem value="header">Header</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            {socialMedia.showIcons !== false && (
              <div className="border rounded-card p-4">
                <Label className="text-sm font-medium mb-2 block">
                  Preview
                </Label>
                <SocialMediaIcons
                  platforms={platforms}
                  iconSize={socialMedia.iconSize || "md"}
                  className="justify-center"
                />
              </div>
            )}
          </>
        ) : (
          <div className="bg-muted/30 rounded-card p-4">
            <p className="text-sm text-muted-foreground">
              Enable social media links to display your social profiles on your
              forms. This helps visitors connect with you across different
              platforms.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
