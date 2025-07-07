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

export function SocialMediaSection({
  localSettings,
  updateSocialMedia,
}: SocialMediaSectionProps) {
  const socialMedia = localSettings.branding?.socialMedia || {};

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

  const platforms = socialMedia.platforms || {};

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Social Media</h3>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Switch
            size="sm"
            id="social-media-enabled"
            checked={socialMedia.enabled || false}
            onCheckedChange={(checked) =>
              handleSettingChange("enabled", checked)
            }
          />
          <Label htmlFor="social-media-enabled" className="text-sm font-medium">
            Enable Social Media Links
          </Label>
        </div>

        {socialMedia.enabled ? (
          <>
            <div className="flex flex-col gap-4 border-l-2 border-muted pl-6">
              <div className="grid gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="linkedin" className="text-sm font-medium">
                    LinkedIn
                  </Label>
                  <Input
                    id="linkedin"
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    value={platforms.linkedin || ""}
                    onChange={(e) =>
                      handlePlatformChange("linkedin", e.target.value)
                    }
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="twitter" className="text-sm font-medium">
                    X (Twitter)
                  </Label>
                  <Input
                    id="twitter"
                    type="url"
                    placeholder="https://x.com/username"
                    value={platforms.twitter || ""}
                    onChange={(e) =>
                      handlePlatformChange("twitter", e.target.value)
                    }
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="youtube" className="text-sm font-medium">
                    YouTube
                  </Label>
                  <Input
                    id="youtube"
                    type="url"
                    placeholder="https://youtube.com/@channel"
                    value={platforms.youtube || ""}
                    onChange={(e) =>
                      handlePlatformChange("youtube", e.target.value)
                    }
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="instagram" className="text-sm font-medium">
                    Instagram
                  </Label>
                  <Input
                    id="instagram"
                    type="url"
                    placeholder="https://instagram.com/username"
                    value={platforms.instagram || ""}
                    onChange={(e) =>
                      handlePlatformChange("instagram", e.target.value)
                    }
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="facebook" className="text-sm font-medium">
                    Facebook
                  </Label>
                  <Input
                    id="facebook"
                    type="url"
                    placeholder="https://facebook.com/username"
                    value={platforms.facebook || ""}
                    onChange={(e) =>
                      handlePlatformChange("facebook", e.target.value)
                    }
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="github" className="text-sm font-medium">
                    GitHub
                  </Label>
                  <Input
                    id="github"
                    type="url"
                    placeholder="https://github.com/username"
                    value={platforms.github || ""}
                    onChange={(e) =>
                      handlePlatformChange("github", e.target.value)
                    }
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="website" className="text-sm font-medium">
                    Website
                  </Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://example.com"
                    value={platforms.website || ""}
                    onChange={(e) =>
                      handlePlatformChange("website", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
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
              <div className="border rounded-lg p-4">
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
          <div className="bg-muted/30 rounded-lg p-4">
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
