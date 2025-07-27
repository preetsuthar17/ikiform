// User avatar component with fallback
import React from 'react';

// UI Components
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// Types
import type { UserAvatarProps } from '../types';
// Utils
import { getUserInitials } from '../utils';

export function UserAvatar({ name, avatarUrl, size = 'xl' }: UserAvatarProps) {
  return (
    <Avatar size={size}>
      {avatarUrl ? (
        <AvatarImage alt={name} src={avatarUrl} />
      ) : (
        <AvatarFallback>{getUserInitials(name)}</AvatarFallback>
      )}
    </Avatar>
  );
}
