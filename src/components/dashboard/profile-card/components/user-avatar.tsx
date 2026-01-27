import { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { UserAvatarProps } from "../types";
import { getUserInitials } from "../utils";

export function UserAvatar({ name, avatarUrl, size = "xl" }: UserAvatarProps) {
	const sizeClasses = useMemo(
		() => ({
			sm: "size-8",
			md: "size-10",
			lg: "size-12",
			xl: "size-16",
		}),
		[]
	);

	const initials = useMemo(() => getUserInitials(name), [name]);

	const altText = useMemo(() => `${name}'s profile picture`, [name]);

	return (
		<Avatar aria-label={altText} className={sizeClasses[size]} role="img">
			{avatarUrl ? (
				<AvatarImage
					alt={altText}
					loading="lazy"
					onError={(e) => {
						const target = e.target as HTMLImageElement;
						target.style.display = "none";
					}}
					src={avatarUrl}
				/>
			) : (
				<AvatarFallback
					aria-label={`${name}'s initials`}
					className="font-semibold text-lg"
				>
					{initials}
				</AvatarFallback>
			)}
		</Avatar>
	);
}
