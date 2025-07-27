// Main profile card component
'use client';

import React, { useState } from 'react';
import { SettingsModal } from '@/components/settings/settings-modal';

// UI Components
import { Card, CardHeader } from '@/components/ui/card';
// External Dependencies
import { useAuth } from '@/hooks/use-auth';
// Hooks
import { usePremiumStatus } from '@/hooks/use-premium-status';
// Local Components
import {
  ProfileActions,
  ProfileCardLoading,
  ProfileInfo,
  UserAvatar,
} from './components';
// Types
import type { ProfileCardProps } from './types';
// Utils
import { extractAvatarUrl, extractUserName } from './utils';

export function ProfileCard({ className }: ProfileCardProps) {
  const { user, signOut, loading } = useAuth();
  const { hasPremium } = usePremiumStatus(user);
  const [showSettings, setShowSettings] = useState(false);

  if (loading) {
    return <ProfileCardLoading className={className} />;
  }

  if (!user) return null;

  const name = extractUserName(user);
  const avatarUrl = extractAvatarUrl(user);

  return (
    <Card
      className={`relative flex w-full grow flex-col items-center gap-6 bg-card py-24 ${className || ''}`}
    >
      <CardHeader className="flex items-center gap-2">
        <UserAvatar avatarUrl={avatarUrl} name={name} size="xl" />
      </CardHeader>

      <ProfileActions
        onSettingsClick={() => setShowSettings(true)}
        onSignOut={signOut}
      />

      <ProfileInfo hasPremium={hasPremium} user={user} />

      <SettingsModal onOpenChange={setShowSettings} open={showSettings} />
    </Card>
  );
}

export default ProfileCard;
