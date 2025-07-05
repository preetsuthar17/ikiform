// User avatar component with fallback
import React from "react";

// UI Components
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Utils
import { getUserInitials } from "../utils";

// Types
import type { UserAvatarProps } from "../types";

export function UserAvatar({ name, avatarUrl, size = "xl" }: UserAvatarProps) {
  return (
    <Avatar size={size}>
      {avatarUrl ? (
        <AvatarImage src={avatarUrl} alt={name} />
      ) : (
        <AvatarFallback>{getUserInitials(name)}</AvatarFallback>
      )}
    </Avatar>
  );
}
