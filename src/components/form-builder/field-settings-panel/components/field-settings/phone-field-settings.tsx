import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import type { FieldSettingsProps } from "./types";

export function PhoneFieldSettings({
	field,
	onUpdateSettings,
}: FieldSettingsProps) {
	const t = useTranslations("product.formBuilder.fieldSettings.phone");

	return (
		<Card className="gap-2 p-4 shadow-none">
			<CardHeader className="p-0">
				<CardTitle className="flex items-center gap-2 text-lg">
					{t("title")}
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-4 p-0">
				<div className="flex flex-col gap-2">
					<Label className="font-medium text-sm" htmlFor="phone-pattern">
						{t("pattern")}
					</Label>
					<Input
						aria-describedby="phone-pattern-help"
						autoComplete="off"
						id="phone-pattern"
						name="phone-pattern"
						onChange={(e) => onUpdateSettings({ pattern: e.target.value })}
						onKeyDown={(e) => {
							if (e.key === "Escape") {
								e.currentTarget.blur();
							}
						}}
						placeholder={t("patternPlaceholder")}
						type="text"
						value={field.settings?.pattern ?? ""}
					/>
					<p className="text-muted-foreground text-xs" id="phone-pattern-help">
						{t("patternHelp")}
					</p>
				</div>
				<div className="flex flex-col gap-2">
					<Label className="font-medium text-sm" htmlFor="phone-message">
						{t("errorMessage")}
					</Label>
					<Input
						aria-describedby="phone-message-help"
						autoComplete="off"
						id="phone-message"
						name="phone-message"
						onChange={(e) =>
							onUpdateSettings({ patternMessage: e.target.value })
						}
						onKeyDown={(e) => {
							if (e.key === "Escape") {
								e.currentTarget.blur();
							}
						}}
						placeholder={t("errorMessagePlaceholder")}
						type="text"
						value={field.settings?.patternMessage ?? ""}
					/>
					<p className="text-muted-foreground text-xs" id="phone-message-help">
						{t("errorMessageHelp")}
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
