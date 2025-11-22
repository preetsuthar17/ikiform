import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface SettingsPanelHeaderProps {
	onClose: () => void;
}

export function SettingsPanelHeader({ onClose }: SettingsPanelHeaderProps) {
	return (
		<header className="flex flex-col border-border bg-background">
			<div className="flex w-full items-center justify-between p-4">
				<h2
					className="font-semibold text-foreground text-lg"
					id="field-settings-title"
				>
					Field Settings
				</h2>
				<Button
					aria-label="Close field settings"
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
