import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import type { UserAvatarProps } from "../types";

import { getUserInitials } from "../utils";

export function UserAvatar({ name, avatarUrl, size = "xl" }: UserAvatarProps) {
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
