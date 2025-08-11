import type { User } from "@supabase/supabase-js";

/**
 * Extract user's display name from various user metadata fields
 */
export function extractUserName(user: User): string {
  return (
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.user_metadata?.user_name ||
    user.email?.split("@")[0] ||
    "User"
  );
}

/**
 * Extract user's avatar URL from metadata
 */
export function extractAvatarUrl(user: User): string | undefined {
  return user.user_metadata?.avatar_url;
}

/**
 * Get user's initials for avatar fallback
 */
export function getUserInitials(name: string): string {
  return name.charAt(0).toUpperCase();
}
