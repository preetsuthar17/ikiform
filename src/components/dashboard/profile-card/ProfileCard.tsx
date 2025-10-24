"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { usePremiumStatus } from "@/hooks/use-premium-status";

import { ProfileCardLoading, ProfileInfo, UserAvatar } from "./components";
import type { ProfileCardProps } from "./types";
import { extractAvatarUrl, extractUserName } from "./utils";

function ProfileCard({ className }: ProfileCardProps) {
  const { user, loading } = useAuth();
  const { hasPremium } = usePremiumStatus(user);

  const userData = useMemo(() => {
    if (!user) return null;
    return {
      name: extractUserName(user),
      avatarUrl: extractAvatarUrl(user),
    };
  }, [user]);

  if (loading) {
    return <ProfileCardLoading className={className} />;
  }

  if (!(user && userData)) return null;

  return (
    <Card
      aria-label="User profile information"
      className={`relative flex h-fit max-h-min w-full grow flex-col items-center gap-6 py-11 shadow-none ${className ?? ""}`}
      role="region"
    >
      <UserAvatar avatarUrl={userData.avatarUrl} name={userData.name} />
      <ProfileInfo hasPremium={hasPremium} user={user} />
    </Card>
  );
}

export default ProfileCard;
