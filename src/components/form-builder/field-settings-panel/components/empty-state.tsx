import { Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import type React from "react";

import { Card, CardContent } from "@/components/ui/card";

import type { EmptyStateProps } from "../types";

export const EmptyState: React.FC<EmptyStateProps> = () => {
	const t = useTranslations("product.formBuilder.fieldSettings.emptyState");

	return (
		<div
			aria-live="polite"
			className="flex h-full flex-col items-center justify-center gap-4 border-border bg-background p-6"
			role="status"
		>
			<Card className="w-full max-w-sm shadow-none">
				<CardContent className="flex flex-col items-center gap-4 p-6 text-center">
					<div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
						<Settings aria-hidden="true" className="size-8 text-primary" />
					</div>
					<div className="flex flex-col gap-2">
						<h3 className="font-semibold text-foreground text-lg">
							{t("title")}
						</h3>
						<p className="text-muted-foreground text-sm">{t("description")}</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
