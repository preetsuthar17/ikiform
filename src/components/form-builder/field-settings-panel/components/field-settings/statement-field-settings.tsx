import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { FieldSettingsProps } from "./types";

export function StatementFieldSettings({
	field,
	onUpdateSettings,
	onFieldUpdate,
}: FieldSettingsProps) {
	const t = useTranslations("product.formBuilder.fieldSettings.statement");

	const updateStatementHeading = (heading: string) => {
		onUpdateSettings({ statementHeading: heading });
	};

	const updateStatementDescription = (description: string) => {
		onUpdateSettings({ statementDescription: description });
	};

	const updateStatementAlign = (align: "left" | "center" | "right") => {
		onUpdateSettings({ statementAlign: align });
	};

	const updateStatementSize = (size: "sm" | "md" | "lg") => {
		onUpdateSettings({ statementSize: size });
	};

	return (
		<Card className="gap-2 p-4 shadow-none">
			<CardHeader className="p-0">
				<CardTitle className="flex items-center gap-2 text-lg">
					{t("title")}
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-4 p-0">
				<div className="flex flex-col gap-2">
					<Label className="font-medium text-sm" htmlFor="statement-heading">
						{t("heading")}
					</Label>
					<Textarea
						aria-describedby="statement-heading-help"
						className="resize-none"
						id="statement-heading"
						name="statement-heading"
						onChange={(e) => updateStatementHeading(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Escape") {
								e.currentTarget.blur();
							} else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
								e.preventDefault();
								e.currentTarget.blur();
							}
						}}
						placeholder={t("headingPlaceholder")}
						rows={2}
						value={field.settings?.statementHeading || ""}
					/>
					<p
						className="text-muted-foreground text-xs"
						id="statement-heading-help"
					>
						{t("headingHelp")}
					</p>
				</div>

				<div className="flex flex-col gap-2">
					<Label
						className="font-medium text-sm"
						htmlFor="statement-description"
					>
						{t("description")}
					</Label>
					<Textarea
						aria-describedby="statement-description-help"
						className="resize-none"
						id="statement-description"
						name="statement-description"
						onChange={(e) => updateStatementDescription(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Escape") {
								e.currentTarget.blur();
							} else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
								e.preventDefault();
								e.currentTarget.blur();
							}
						}}
						placeholder={t("descriptionPlaceholder")}
						rows={3}
						value={field.settings?.statementDescription || ""}
					/>
					<p
						className="text-muted-foreground text-xs"
						id="statement-description-help"
					>
						{t("descriptionHelp")}
					</p>
				</div>

				<div className="flex flex-col gap-2">
					<Label className="font-medium text-sm" htmlFor="statement-align">
						{t("alignment")}
					</Label>
					<Select
						onValueChange={updateStatementAlign}
						value={field.settings?.statementAlign || "left"}
					>
						<SelectTrigger className="w-full" id="statement-align">
							<SelectValue placeholder={t("alignmentPlaceholder")} />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="left">{t("alignLeft")}</SelectItem>
							<SelectItem value="center">{t("alignCenter")}</SelectItem>
							<SelectItem value="right">{t("alignRight")}</SelectItem>
						</SelectContent>
					</Select>
					<p
						className="text-muted-foreground text-xs"
						id="statement-align-help"
					>
						{t("alignmentHelp")}
					</p>
				</div>

				<div className="flex flex-col gap-2">
					<Label className="font-medium text-sm" htmlFor="statement-size">
						{t("size")}
					</Label>
					<Select
						onValueChange={updateStatementSize}
						value={field.settings?.statementSize || "md"}
					>
						<SelectTrigger className="w-full" id="statement-size">
							<SelectValue placeholder={t("sizePlaceholder")} />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="sm">{t("sizeSmall")}</SelectItem>
							<SelectItem value="md">{t("sizeMedium")}</SelectItem>
							<SelectItem value="lg">{t("sizeLarge")}</SelectItem>
						</SelectContent>
					</Select>
					<p className="text-muted-foreground text-xs" id="statement-size-help">
						{t("sizeHelp")}
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
