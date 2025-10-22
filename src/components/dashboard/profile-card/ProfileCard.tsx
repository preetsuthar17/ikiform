"use client";

import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { usePremiumStatus } from "@/hooks/use-premium-status";

import { ProfileCardLoading, ProfileInfo, UserAvatar } from "./components";
import type { ProfileCardProps } from "./types";
import { extractAvatarUrl, extractUserName } from "./utils";

function ProfileCard({ className }: ProfileCardProps) {
  const { user, loading } = useAuth();
  const { hasPremium } = usePremiumStatus(user);

  if (loading) {
    return <ProfileCardLoading className={className} />;
  }

  if (!user) return null;

  const name = extractUserName(user);
  const avatarUrl = extractAvatarUrl(user);

  return (
    <Card
      aria-label="User profile"
      className={`relative flex h-fit max-h-min w-full grow flex-col items-center gap-6 py-11 shadow-none ${className ?? ""}`}
      role="region"
    >
      <UserAvatar avatarUrl={avatarUrl} name={name} />
      <ProfileInfo hasPremium={hasPremium} user={user} />
    </Card>
  );
}

export default ProfileCard;
