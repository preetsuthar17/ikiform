import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

export function BannerFieldSettings({
	field,
	onUpdateSettings,
}: FieldSettingsProps) {
	const t = useTranslations("product.formBuilder.fieldSettings.banner");
	const variant = (field.settings?.bannerVariant as string) || "info";
	const title = field.settings?.bannerTitle || "";
	const description = field.settings?.bannerDescription || "";

	return (
		<Card className="gap-2 p-4 shadow-none">
			<CardHeader className="p-0">
				<CardTitle className="flex items-center gap-2 text-lg">
					{t("title")}
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-4 p-0">
				<div className="flex flex-col gap-2">
					<Label className="font-medium text-sm" htmlFor="banner-variant">
						{t("alertType")}
					</Label>
					<Select
						onValueChange={(v) =>
							onUpdateSettings({
								bannerVariant: v as "warning" | "error" | "info" | "success",
							})
						}
						value={variant}
					>
						<SelectTrigger className="w-full" id="banner-variant">
							<SelectValue placeholder={t("alertTypePlaceholder")} />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="warning">{t("warning")}</SelectItem>
							<SelectItem value="error">{t("error")}</SelectItem>
							<SelectItem value="info">{t("info")}</SelectItem>
							<SelectItem value="success">{t("success")}</SelectItem>
						</SelectContent>
					</Select>
					<p className="text-muted-foreground text-xs" id="banner-variant-help">
						{t("alertTypeHelp")}
					</p>
				</div>

				<div className="flex flex-col gap-2">
					<Label className="font-medium text-sm" htmlFor="banner-title">
						{t("bannerTitle")}
					</Label>
					<Input
						aria-describedby="banner-title-help"
						autoComplete="off"
						id="banner-title"
						name="banner-title"
						onChange={(e) => onUpdateSettings({ bannerTitle: e.target.value })}
						onKeyDown={(e) => {
							if (e.key === "Escape") {
								e.currentTarget.blur();
							}
						}}
						placeholder={t("bannerTitlePlaceholder")}
						type="text"
						value={title}
					/>
					<p className="text-muted-foreground text-xs" id="banner-title-help">
						{t("bannerTitleHelp")}
					</p>
				</div>

				<div className="flex flex-col gap-2">
					<Label className="font-medium text-sm" htmlFor="banner-description">
						{t("description")}
					</Label>
					<Textarea
						aria-describedby="banner-description-help"
						className="min-h-24 resize-none"
						id="banner-description"
						name="banner-description"
						onChange={(e) =>
							onUpdateSettings({ bannerDescription: e.target.value })
						}
						onKeyDown={(e) => {
							if (e.key === "Escape") {
								e.currentTarget.blur();
							} else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
								e.preventDefault();
								e.currentTarget.blur();
							}
						}}
						placeholder={t("descriptionPlaceholder")}
						value={description}
					/>
					<p
						className="text-muted-foreground text-xs"
						id="banner-description-help"
					>
						{t("descriptionHelp")}
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
