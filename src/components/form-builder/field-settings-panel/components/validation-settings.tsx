import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";

import type { FormField } from "@/lib/database";

interface ValidationSettingsProps {
	field: FormField;
	onUpdateValidation: (updates: Partial<FormField["validation"]>) => void;
}

export function ValidationSettings({
	field,
	onUpdateValidation,
}: ValidationSettingsProps) {
	const t = useTranslations("product.formBuilder.fieldSettings.validation");
	const isTextType = ["text", "email", "textarea"].includes(field.type);
	const isNumberType = field.type === "number";

	if (!(isTextType || isNumberType)) {
		return null;
	}

	return (
		<Card className="gap-2 p-4 shadow-none">
			<CardHeader className="p-0">
				<CardTitle className="flex items-center gap-2 text-lg">
					{t("title")}
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-4 p-0">
				{isTextType && (
					<>
						<div className="flex flex-col gap-2">
							<Label className="font-medium text-sm" htmlFor="min-length">
								{t("minLength")}
							</Label>
							<Input
								aria-describedby="min-length-help"
								autoComplete="off"
								id="min-length"
								name="min-length"
								onChange={(e) =>
									onUpdateValidation({
										minLength: Number.parseInt(e.target.value) || undefined,
									})
								}
								onKeyDown={(e) => {
									if (e.key === "Escape") {
										e.currentTarget.blur();
									}
								}}
								placeholder={t("minLengthPlaceholder")}
								type="number"
								value={field.validation?.minLength || ""}
							/>
							<p className="text-muted-foreground text-xs" id="min-length-help">
								{t("minLengthHelp")}
							</p>
						</div>
						<div className="flex flex-col gap-2">
							<Label className="font-medium text-sm" htmlFor="max-length">
								{t("maxLength")}
							</Label>
							<Input
								aria-describedby="max-length-help"
								autoComplete="off"
								id="max-length"
								name="max-length"
								onChange={(e) =>
									onUpdateValidation({
										maxLength: Number.parseInt(e.target.value) || undefined,
									})
								}
								onKeyDown={(e) => {
									if (e.key === "Escape") {
										e.currentTarget.blur();
									}
								}}
								placeholder={t("maxLengthPlaceholder")}
								type="number"
								value={field.validation?.maxLength || ""}
							/>
							<p className="text-muted-foreground text-xs" id="max-length-help">
								{t("maxLengthHelp")}
							</p>
						</div>
						<div className="flex flex-col gap-2">
							<Label className="font-medium text-sm" htmlFor="pattern">
								{t("pattern")}
							</Label>
							<Input
								aria-describedby="pattern-help"
								autoComplete="off"
								id="pattern"
								name="pattern"
								onChange={(e) =>
									onUpdateValidation({
										pattern: e.target.value || undefined,
									})
								}
								onKeyDown={(e) => {
									if (e.key === "Escape") {
										e.currentTarget.blur();
									}
								}}
								placeholder={t("patternPlaceholder")}
								type="text"
								value={field.validation?.pattern || ""}
							/>
							<p className="text-muted-foreground text-xs" id="pattern-help">
								{t("patternHelp")}
							</p>
						</div>
					</>
				)}

				{isNumberType && (
					<>
						<div className="flex flex-col gap-2">
							<Label className="font-medium text-sm" htmlFor="min-value">
								{t("minValue")}
							</Label>
							<Input
								aria-describedby="min-value-help"
								autoComplete="off"
								id="min-value"
								name="min-value"
								onChange={(e) =>
									onUpdateValidation({
										min: Number.parseInt(e.target.value) || undefined,
									})
								}
								onKeyDown={(e) => {
									if (e.key === "Escape") {
										e.currentTarget.blur();
									}
								}}
								placeholder={t("minValuePlaceholder")}
								type="number"
								value={field.validation?.min || ""}
							/>
							<p className="text-muted-foreground text-xs" id="min-value-help">
								{t("minValueHelp")}
							</p>
						</div>
						<div className="flex flex-col gap-2">
							<Label className="font-medium text-sm" htmlFor="max-value">
								{t("maxValue")}
							</Label>
							<Input
								aria-describedby="max-value-help"
								autoComplete="off"
								id="max-value"
								name="max-value"
								onChange={(e) =>
									onUpdateValidation({
										max: Number.parseInt(e.target.value) || undefined,
									})
								}
								onKeyDown={(e) => {
									if (e.key === "Escape") {
										e.currentTarget.blur();
									}
								}}
								placeholder={t("maxValuePlaceholder")}
								type="number"
								value={field.validation?.max || ""}
							/>
							<p className="text-muted-foreground text-xs" id="max-value-help">
								{t("maxValueHelp")}
							</p>
						</div>
					</>
				)}
			</CardContent>
		</Card>
	);
}
