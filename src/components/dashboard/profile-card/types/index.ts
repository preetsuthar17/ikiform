import type { User } from "@supabase/supabase-js";

export interface ProfileCardProps {
  className?: string;
}

export interface UserProfileData {
  name: string;
  email: string;
  avatarUrl?: string;
  hasPremium: boolean;
  hasCustomerPortal: boolean;
}

export interface PremiumStatus {
  hasPremium: boolean;
  hasCustomerPortal: boolean;
  checkingPremium: boolean;
}

export interface ProfileActionsProps {
  onSignOut: () => void;
}

export interface ProfileInfoProps {
  user: User;
  hasPremium: boolean;
}

export interface ProfileLoadingProps {
  className?: string;
}

export interface UserAvatarProps {
  name: string;
  avatarUrl?: string;
  size?: "sm" | "md" | "lg" | "xl";
}
