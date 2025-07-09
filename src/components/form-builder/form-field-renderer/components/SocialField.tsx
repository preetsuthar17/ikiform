// External imports
import React from "react";

// Component imports
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { SocialMediaIcons } from "@/components/ui/social-media-icons";

// Utility imports
import { getBaseClasses } from "../utils";

// Type imports
import type { BaseFieldProps } from "../types";

interface SocialPlatform {
  platform: string;
  label: string;
  placeholder: string;
  icon: string;
}

const socialPlatforms: SocialPlatform[] = [
  {
    platform: "linkedin",
    label: "LinkedIn",
    placeholder: "https://linkedin.com/in/username",
    icon: "linkedin",
  },
  {
    platform: "twitter",
    label: "X (Twitter)",
    placeholder: "https://x.com/username",
    icon: "twitter",
  },
  {
    platform: "youtube",
    label: "YouTube",
    placeholder: "https://youtube.com/@channel",
    icon: "youtube",
  },
  {
    platform: "instagram",
    label: "Instagram",
    placeholder: "https://instagram.com/username",
    icon: "instagram",
  },
  {
    platform: "facebook",
    label: "Facebook",
    placeholder: "https://facebook.com/username",
    icon: "facebook",
  },
  {
    platform: "github",
    label: "GitHub",
    placeholder: "https://github.com/username",
    icon: "github",
  },
  {
    platform: "website",
    label: "Website",
    placeholder: "https://example.com",
    icon: "website",
  },
];

export function SocialField({ field, value, onChange, error }: BaseFieldProps) {
  const baseClasses = getBaseClasses(field, error);

  const socialData = value || {};

  const handlePlatformChange = (platform: string, url: string) => {
    const updatedData = { ...socialData, [platform]: url };
    onChange(updatedData);
  };

  const platformsToShow =
    field.settings?.socialPlatforms || socialPlatforms.map((p) => p.platform);

  const filteredPlatforms = socialPlatforms.filter((p) =>
    platformsToShow.includes(p.platform)
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4">
        {filteredPlatforms.map((platform) => (
          <div key={platform.platform} className="flex flex-col gap-2">
            <Label
              htmlFor={`${field.id}-${platform.platform}`}
              className="text-sm font-medium"
            >
              {platform.label}
            </Label>
            <Input
              id={`${field.id}-${platform.platform}`}
              type="url"
              placeholder={platform.placeholder}
              value={socialData[platform.platform] || ""}
              onChange={(e) =>
                handlePlatformChange(platform.platform, e.target.value)
              }
              className={baseClasses}
            />
          </div>
        ))}
      </div>

      {field.settings?.showIcons && (
        <Card className="p-4">
          <Label className="text-sm font-medium block">Preview</Label>
          <SocialMediaIcons
            platforms={socialData}
            iconSize={field.settings?.iconSize || "md"}
            className="justify-center"
          />
        </Card>
      )}
    </div>
  );
}
