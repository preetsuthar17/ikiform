import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTranslations } from "next-intl";
import type { FieldSettingsProps } from "./types";

export function EmailFieldSettings({
	field,
	onUpdateSettings,
}: FieldSettingsProps) {
	const t = useTranslations("product.formBuilder.fieldSettings.email");

	return (
		<Card className="flex flex-col gap-4 rounded-2xl bg-background p-4">
			<h3 className="font-medium text-card-foreground">{t("title")}</h3>
			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-2">
					<Label
						className="text-card-foreground"
						htmlFor="email-allowed-domains"
					>
						{t("allowedDomains")}
					</Label>
					<Input
						id="email-allowed-domains"
						onChange={(e) =>
							onUpdateSettings({
								emailValidation: {
									...field.settings?.emailValidation,
									allowedDomains: e.target.value
										? e.target.value.split(",").map((d) => d.trim())
										: undefined,
								},
							})
						}
						placeholder={t("allowedDomainsPlaceholder")}
						type="text"
						value={
							field.settings?.emailValidation?.allowedDomains?.join(", ") || ""
						}
					/>
				</div>
				<div className="flex flex-col gap-2">
					<Label
						className="text-card-foreground"
						htmlFor="email-blocked-domains"
					>
						{t("blockedDomains")}
					</Label>
					<Input
						id="email-blocked-domains"
						onChange={(e) =>
							onUpdateSettings({
								emailValidation: {
									...field.settings?.emailValidation,
									blockedDomains: e.target.value
										? e.target.value.split(",").map((d) => d.trim())
										: undefined,
								},
							})
						}
						placeholder={t("blockedDomainsPlaceholder")}
						type="text"
						value={
							field.settings?.emailValidation?.blockedDomains?.join(", ") || ""
						}
					/>
				</div>
				<div className="flex items-center gap-2">
					<Switch
						checked={!!field.settings?.emailValidation?.requireBusinessEmail}
						id="email-business-only"
						onCheckedChange={(checked) =>
							onUpdateSettings({
								emailValidation: {
									...field.settings?.emailValidation,
									requireBusinessEmail: checked,
								},
							})
						}
					/>
					<Label className="text-card-foreground" htmlFor="email-business-only">
						{t("requireBusinessEmail")}
					</Label>
				</div>
				<div className="flex flex-col gap-2">
					<Label
						className="text-card-foreground"
						htmlFor="email-custom-message"
					>
						{t("customValidationMessage")}
					</Label>
					<Input
						id="email-custom-message"
						onChange={(e) =>
							onUpdateSettings({
								emailValidation: {
									...field.settings?.emailValidation,
									customValidationMessage: e.target.value || undefined,
								},
							})
						}
						placeholder={t("customValidationPlaceholder")}
						type="text"
						value={
							field.settings?.emailValidation?.customValidationMessage || ""
						}
					/>
				</div>
			</div>
		</Card>
	);
}
