'use client';

import Link from 'next/link';
import React from 'react';
import {
  FaFacebook,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
  FaYoutube,
} from 'react-icons/fa6';

interface SocialMediaPlatforms {
  linkedin?: string;
  twitter?: string;
  youtube?: string;
  instagram?: string;
  facebook?: string;
  github?: string;
  website?: string;
}

interface SocialMediaIconsProps {
  platforms: SocialMediaPlatforms;
  iconSize?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabels?: boolean;
}

const iconSizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

const socialIcons = {
  linkedin: FaLinkedin,
  twitter: FaXTwitter,
  youtube: FaYoutube,
  instagram: FaInstagram,
  facebook: FaFacebook,
  github: FaGithub,
  website: FaGlobe,
};

const socialLabels = {
  linkedin: 'LinkedIn',
  twitter: 'X (Twitter)',
  youtube: 'YouTube',
  instagram: 'Instagram',
  facebook: 'Facebook',
  github: 'GitHub',
  website: 'Website',
};

export function SocialMediaIcons({
  platforms,
  iconSize = 'md',
  className = '',
  showLabels = false,
}: SocialMediaIconsProps) {
  const sizeClass = iconSizeClasses[iconSize];

  const activePlatforms = Object.entries(platforms).filter(
    ([_, url]) => url && url.trim() !== ''
  );

  if (activePlatforms.length === 0) {
    return null;
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {activePlatforms.map(([platform, url]) => {
        const Icon = socialIcons[platform as keyof typeof socialIcons];
        const label = socialLabels[platform as keyof typeof socialLabels];

        if (typeof Icon !== 'function' || !url) return null;

        return (
          <Link
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
            href={url}
            key={platform}
            rel="noopener noreferrer"
            target="_blank"
            title={label}
          >
            <Icon className={sizeClass} />
            {showLabels && <span className="text-sm">{label}</span>}
          </Link>
        );
      })}
    </div>
  );
}
