// Main profile card component
"use client";

import React, { useState } from "react";

// External Dependencies
import { useAuth } from "@/hooks/use-auth";

// UI Components
import { Card, CardHeader } from "@/components/ui/card";
import { SettingsModal } from "@/components/settings/settings-modal";

// Local Components
import {
  ProfileCardLoading,
  UserAvatar,
  ProfileActions,
  ProfileInfo,
} from "./components";

// Hooks
import { usePremiumStatus } from "@/hooks/use-premium-status";

// Utils
import { extractUserName, extractAvatarUrl } from "./utils";

// Types
import type { ProfileCardProps } from "./types";

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
      className={`flex flex-col items-center gap-6 w-full grow relative py-24 ${className || ""}`}
    >
      <CardHeader className="flex items-center gap-2">
        <UserAvatar name={name} avatarUrl={avatarUrl} size="xl" />
      </CardHeader>

      <ProfileActions
        onSettingsClick={() => setShowSettings(true)}
        onSignOut={signOut}
      />

      <ProfileInfo user={user} hasPremium={hasPremium} />

      <SettingsModal open={showSettings} onOpenChange={setShowSettings} />
    </Card>
  );
}

export default ProfileCard;
