import React from 'react';
import { Card } from '@/components/ui/card';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SocialMediaIcons } from '@/components/ui/social-media-icons';

import type { BaseFieldProps } from '../types';

import { getBaseClasses } from '../utils';

interface SocialPlatform {
  platform: string;
  label: string;
  placeholder: string;
  icon: string;
}

const socialPlatforms: SocialPlatform[] = [
  {
    platform: 'linkedin',
    label: 'LinkedIn',
    placeholder: 'https://linkedin.com/in/username',
    icon: 'linkedin',
  },
  {
    platform: 'twitter',
    label: 'X (Twitter)',
    placeholder: 'https://x.com/username',
    icon: 'twitter',
  },
  {
    platform: 'youtube',
    label: 'YouTube',
    placeholder: 'https://youtube.com/@channel',
    icon: 'youtube',
  },
  {
    platform: 'instagram',
    label: 'Instagram',
    placeholder: 'https://instagram.com/username',
    icon: 'instagram',
  },
  {
    platform: 'facebook',
    label: 'Facebook',
    placeholder: 'https://facebook.com/username',
    icon: 'facebook',
  },
  {
    platform: 'github',
    label: 'GitHub',
    placeholder: 'https://github.com/username',
    icon: 'github',
  },
  {
    platform: 'website',
    label: 'Website',
    placeholder: 'https://example.com',
    icon: 'website',
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

  const customLinks = field.settings?.customLinks || [];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4">
        {filteredPlatforms.map((platform) => (
          <div className="flex flex-col gap-2" key={platform.platform}>
            <Label
              className="font-medium text-sm"
              htmlFor={`${field.id}-${platform.platform}`}
            >
              {platform.label}
            </Label>
            <Input
              className={baseClasses}
              id={`${field.id}-${platform.platform}`}
              onChange={(e) =>
                handlePlatformChange(platform.platform, e.target.value)
              }
              placeholder={platform.placeholder}
              type="url"
              value={socialData[platform.platform] || ''}
            />
          </div>
        ))}
        {customLinks.map((link, idx) => (
          <div className="flex flex-col gap-2" key={`custom-${idx}`}>
            <Label
              className="font-medium text-sm"
              htmlFor={`${field.id}-custom-${idx}`}
            >
              {link.label || `Custom Link ${idx + 1}`}
            </Label>
            <Input
              className={baseClasses}
              id={`${field.id}-custom-${idx}`}
              onChange={(e) => {
                const updatedData = {
                  ...socialData,
                  [`custom_${idx}`]: e.target.value,
                };
                onChange(updatedData);
              }}
              placeholder={link.placeholder || 'https://example.com'}
              type="url"
              value={socialData[`custom_${idx}`] || ''}
            />
          </div>
        ))}
      </div>

      {field.settings?.showIcons && (
        <Card className="p-4">
          <Label className="block font-medium text-sm">Preview</Label>
          <SocialMediaIcons
            className="justify-center"
            iconSize={field.settings?.iconSize || 'md'}
            platforms={socialData}
          />
        </Card>
      )}
    </div>
  );
}
