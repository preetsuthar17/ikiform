import { X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface SettingsPanelHeaderProps {
	onClose: () => void;
}

export function SettingsPanelHeader({ onClose }: SettingsPanelHeaderProps) {
	const t = useTranslations("product.formBuilder.fieldSettings.header");

	return (
		<header className="flex flex-col border-border bg-background">
			<div className="flex w-full items-center justify-between p-4">
				<h2
					className="font-semibold text-foreground text-lg"
					id="field-settings-title"
				>
					{t("title")}
				</h2>
				<Button
					aria-label={t("closeAria")}
					className="flex gap-2"
					onClick={onClose}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							e.preventDefault();
							onClose();
						}
					}}
					size="sm"
					variant="ghost"
				>
					<X aria-hidden="true" className="size-4" />
				</Button>
			</div>
			<Separator />
		</header>
	);
}
