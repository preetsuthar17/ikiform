import { Crown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { CardContent } from "@/components/ui/card";
import type { ProfileInfoProps } from "../types";
import { extractUserName } from "../utils";

export function ProfileInfo({ user, hasPremium }: ProfileInfoProps) {
	const t = useTranslations("dashboard.profile");
	const name = useMemo(() => extractUserName(user), [user]);

	return (
		<CardContent className="flex flex-col gap-4">
			<div className="flex flex-col gap-1 text-center">
				<div className="flex items-center justify-center gap-2 font-semibold text-xl">
					<span aria-label={t("userNameAria", { name })} className="truncate">
						{name}
					</span>
					{hasPremium && (
						<Crown
							aria-label={t("premiumUserBadge")}
							className="size-5 shrink-0 text-yellow-500"
							role="img"
						/>
					)}
				</div>
				<div
					aria-label={t("userEmailAria", { email: user.email ?? "" })}
					className="truncate text-muted-foreground text-sm"
					title={user.email}
				>
					{user.email}
				</div>
			</div>
		</CardContent>
	);
}
