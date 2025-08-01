import React from 'react';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SocialMediaIcons } from '@/components/ui/social-media-icons';
import { Switch } from '@/components/ui/switch';

import type { SocialMediaSectionProps } from '../types';

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
      <div className="mb-4 flex items-center gap-3">
        <svg
          className="h-5 w-5 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <rect height="18" rx="2" strokeWidth="2" width="18" x="3" y="3" />
          <path d="M16 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
          <path d="M7 16a4 4 0 0 1 10 0" />
        </svg>
        <h3 className="font-medium text-lg">Branding</h3>
      </div>
      <div className="flex flex-col gap-6 border-muted border-l-2 pl-6">
        <div className="flex items-center gap-2">
          <Switch
            checked={showIkiformBranding}
            id="ikiform-branding-toggle"
            onCheckedChange={handleBrandingToggle}
            size="sm"
          />
          <Label
            className="font-medium text-sm"
            htmlFor="ikiform-branding-toggle"
          >
            Show "Powered by Ikiform" branding
          </Label>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="font-medium text-base">Social Media Links</Label>
          <Switch
            checked={socialMedia.enabled}
            id="social-media-enabled"
            onCheckedChange={(checked) =>
              handleSettingChange('enabled', checked)
            }
            size="sm"
          />
        </div>
        {socialMedia.enabled ? (
          <>
            <div className="flex flex-col gap-4">
              <div className="grid gap-4">
                {}
                {(
                  [
                    {
                      id: 'linkedin',
                      label: 'LinkedIn',
                      placeholder: 'https://linkedin.com/in/username',
                    },
                    {
                      id: 'twitter',
                      label: 'X (Twitter)',
                      placeholder: 'https://x.com/username',
                    },
                    {
                      id: 'youtube',
                      label: 'YouTube',
                      placeholder: 'https://youtube.com/@channel',
                    },
                    {
                      id: 'instagram',
                      label: 'Instagram',
                      placeholder: 'https://instagram.com/username',
                    },
                    {
                      id: 'facebook',
                      label: 'Facebook',
                      placeholder: 'https://facebook.com/username',
                    },
                    {
                      id: 'github',
                      label: 'GitHub',
                      placeholder: 'https://github.com/username',
                    },
                    {
                      id: 'website',
                      label: 'Website',
                      placeholder: 'https://example.com',
                    },
                  ] as const
                ).map(({ id, label, placeholder }) => (
                  <div className="flex flex-col gap-2" key={id}>
                    <Label className="font-medium text-sm" htmlFor={id}>
                      {label}
                    </Label>
                    <Input
                      id={id}
                      onChange={(e) => handlePlatformChange(id, e.target.value)}
                      placeholder={placeholder}
                      type="url"
                      value={platforms[id as keyof typeof platforms] || ''}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={socialMedia.showIcons !== false}
                  id="show-icons"
                  onCheckedChange={(checked) =>
                    handleSettingChange('showIcons', checked)
                  }
                  size="sm"
                />
                <Label className="font-medium text-sm" htmlFor="show-icons">
                  Show Icons
                </Label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="font-medium text-sm" htmlFor="icon-size">
                    Icon Size
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      handleSettingChange('iconSize', value)
                    }
                    value={socialMedia.iconSize || 'md'}
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
                  <Label className="font-medium text-sm" htmlFor="position">
                    Position
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      handleSettingChange('position', value)
                    }
                    value={socialMedia.position || 'footer'}
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
              <div className="rounded-card border p-4">
                <Label className="mb-2 block font-medium text-sm">
                  Preview
                </Label>
                <SocialMediaIcons
                  className="justify-center"
                  iconSize={socialMedia.iconSize || 'md'}
                  platforms={platforms}
                />
              </div>
            )}
          </>
        ) : (
          <div className="rounded-card bg-muted/30 p-4">
            <p className="text-muted-foreground text-sm">
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
