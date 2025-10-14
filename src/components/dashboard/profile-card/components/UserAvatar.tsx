import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { UserAvatarProps } from "../types";
import { getUserInitials } from "../utils";

export function UserAvatar({ name, avatarUrl, size = "xl" }: UserAvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
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
