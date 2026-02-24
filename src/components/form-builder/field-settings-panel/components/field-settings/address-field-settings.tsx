import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import type { FieldSettingsProps } from "./types";

export function AddressFieldSettings({
	field,
	onUpdateSettings,
}: FieldSettingsProps) {
	const t = useTranslations("product.formBuilder.fieldSettings.address");

	return (
		<Card className="gap-2 p-4 shadow-none">
			<CardHeader className="p-0">
				<CardTitle className="flex items-center gap-2 text-lg">
					{t("title")}
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-4 p-0">
				<div className="flex flex-col gap-2">
					<Label
						className="font-medium text-sm"
						htmlFor="address-required-lines"
					>
						{t("requiredLines")}
					</Label>
					<Input
						aria-describedby="address-required-lines-help"
						autoComplete="off"
						id="address-required-lines"
						max={5}
						min={1}
						name="address-required-lines"
						onChange={(e) =>
							onUpdateSettings({
								requiredLines: Number.parseInt(e.target.value),
							})
						}
						onKeyDown={(e) => {
							if (e.key === "Escape") {
								e.currentTarget.blur();
							}
						}}
						placeholder={t("requiredLinesPlaceholder")}
						type="number"
						value={field.settings?.requiredLines ?? ""}
					/>
					<p
						className="text-muted-foreground text-xs"
						id="address-required-lines-help"
					>
						{t("requiredLinesHelp")}
					</p>
				</div>
				<div className="flex flex-col gap-2">
					<Label className="font-medium text-sm" htmlFor="address-message">
						{t("customErrorMessage")}
					</Label>
					<Input
						aria-describedby="address-message-help"
						autoComplete="off"
						id="address-message"
						name="address-message"
						onChange={(e) =>
							onUpdateSettings({ requiredMessage: e.target.value })
						}
						onKeyDown={(e) => {
							if (e.key === "Escape") {
								e.currentTarget.blur();
							}
						}}
						placeholder={t("customErrorPlaceholder")}
						type="text"
						value={field.settings?.requiredMessage ?? ""}
					/>
					<p
						className="text-muted-foreground text-xs"
						id="address-message-help"
					>
						{t("customErrorHelp")}
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
