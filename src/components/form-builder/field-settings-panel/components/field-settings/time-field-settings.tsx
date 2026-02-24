import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTranslations } from "next-intl";
import type { FieldSettingsProps } from "./types";

export function TimeFieldSettings({
	field,
	onUpdateSettings,
}: FieldSettingsProps) {
	const t = useTranslations("product.formBuilder.fieldSettings.time");

	return (
		<Card className="gap-2 p-4 shadow-none">
			<CardHeader className="p-0">
				<CardTitle className="flex items-center gap-2 text-lg">
					{t("title")}
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-4 p-0">
				<div className="flex items-center justify-between">
					<div className="flex flex-col gap-1">
						<Label
							className="font-medium text-sm"
							htmlFor="showCurrentTimeButton"
						>
							{t("showCurrentTimeButton")}
						</Label>
						<p className="text-muted-foreground text-xs">
							{t("showCurrentTimeButtonHelp")}
						</p>
					</div>
					<Switch
						aria-describedby="showCurrentTimeButton-help"
						checked={!!field.settings?.showCurrentTimeButton}
						id="showCurrentTimeButton"
						name="showCurrentTimeButton"
						onCheckedChange={(checked) =>
							onUpdateSettings({ showCurrentTimeButton: checked })
						}
					/>
				</div>
			</CardContent>
		</Card>
	);
}
