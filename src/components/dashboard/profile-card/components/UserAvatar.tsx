import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { UserAvatarProps } from "../types";
import { getUserInitials } from "../utils";

export function UserAvatar({ name, avatarUrl, size = "xl" }: UserAvatarProps) {
  const sizeClasses = {
    sm: "size-8",
    md: "size-10",
    lg: "size-12",
    xl: "size-16",
  };

  return (
    <Avatar className={sizeClasses[size]}>
      {avatarUrl ? (
        <AvatarImage
          alt={`${name}'s profile picture`}
          loading="lazy"
          src={avatarUrl}
        />
      ) : (
        <AvatarFallback className="font-semibold text-lg">
          {getUserInitials(name)}
        </AvatarFallback>
      )}
    </Avatar>
  );
}
