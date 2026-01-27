"use client";

import type { User } from "@supabase/supabase-js";
import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { ProfileInfo, UserAvatar } from "./components";
import type { ProfileCardProps } from "./types";
import { extractAvatarUrl, extractUserName } from "./utils";

interface ProfileCardClientProps extends ProfileCardProps {
	user: User;
	hasPremium: boolean;
	hasCustomerPortal: boolean;
}

function ProfileCardClient({
	className,
	user,
	hasPremium,
	hasCustomerPortal,
}: ProfileCardClientProps) {
	const userData = useMemo(() => {
		return {
			name: extractUserName(user),
			avatarUrl: extractAvatarUrl(user),
		};
	}, [user]);

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

export default ProfileCardClient;
