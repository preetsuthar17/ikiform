import type { User } from "@supabase/supabase-js";

export function extractUserName(user: User): string {
	return (
		user.user_metadata?.full_name ||
		user.user_metadata?.name ||
		user.user_metadata?.user_name ||
		user.email?.split("@")[0] ||
		"User"
	);
}

export function extractAvatarUrl(user: User): string | undefined {
	return user.user_metadata?.avatar_url;
}

export function getUserInitials(name: string): string {
	if (!name || name.length === 0) return "U";

	const words = name.trim().split(/\s+/);
	if (words.length === 1) {
		return words[0].charAt(0).toUpperCase();
	}

	return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}
