import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { FormField } from "@/lib/database";

interface ErrorMessagesProps {
	field: FormField;
	onUpdateValidation: (updates: Partial<FormField["validation"]>) => void;
}

export function ErrorMessages({
	field,
	onUpdateValidation,
}: ErrorMessagesProps) {
	const t = useTranslations("product.formBuilder.fieldSettings.errorMessages");
	const isTextType = ["text", "email", "textarea"].includes(field.type);
	const isNumberType = field.type === "number";

	if (!(field.required || isTextType || isNumberType)) {
		return null;
	}

	return (
		<Card className="flex flex-col gap-4 rounded-2xl bg-background p-4">
			<h3 className="font-medium text-card-foreground">
				{t("title")}
			</h3>
			<div className="flex flex-col gap-4">
				{field.required && (
					<div className="flex flex-col gap-2">
						<Label className="text-card-foreground" htmlFor="required-message">
							{t("requiredFieldMessage")}
						</Label>
						<Input
							id="required-message"
							onChange={(e) =>
								onUpdateValidation({
									requiredMessage: e.target.value || undefined,
								})
							}
							placeholder={t("requiredFieldPlaceholder")}
							value={field.validation?.requiredMessage || ""}
						/>
					</div>
				)}

				{isTextType && (
					<>
						{field.validation?.minLength && (
							<div className="flex flex-col gap-2">
								<Label
									className="text-card-foreground"
									htmlFor="min-length-message"
								>
									{t("minLengthMessage")}
								</Label>
								<Input
									id="min-length-message"
									onChange={(e) =>
										onUpdateValidation({
											minLengthMessage: e.target.value || undefined,
										})
									}
									placeholder={t("minLengthPlaceholder", {
										count: field.validation.minLength,
									})}
									value={field.validation?.minLengthMessage || ""}
								/>
							</div>
						)}

						{field.validation?.maxLength && (
							<div className="flex flex-col gap-2">
								<Label
									className="text-card-foreground"
									htmlFor="max-length-message"
								>
									{t("maxLengthMessage")}
								</Label>
								<Input
									id="max-length-message"
									onChange={(e) =>
										onUpdateValidation({
											maxLengthMessage: e.target.value || undefined,
										})
									}
									placeholder={t("maxLengthPlaceholder", {
										count: field.validation.maxLength,
									})}
									value={field.validation?.maxLengthMessage || ""}
								/>
							</div>
						)}

						{field.validation?.pattern && (
							<div className="flex flex-col gap-2">
								<Label
									className="text-card-foreground"
									htmlFor="pattern-message"
								>
									{t("patternMessage")}
								</Label>
								<Input
									id="pattern-message"
									onChange={(e) =>
										onUpdateValidation({
											patternMessage: e.target.value || undefined,
										})
									}
									placeholder={t("patternPlaceholder")}
									value={field.validation?.patternMessage || ""}
								/>
							</div>
						)}

						{field.type === "email" && (
							<div className="flex flex-col gap-2">
								<Label className="text-card-foreground" htmlFor="email-message">
									{t("emailMessage")}
								</Label>
								<Input
									id="email-message"
									onChange={(e) =>
										onUpdateValidation({
											emailMessage: e.target.value || undefined,
										})
									}
									placeholder={t("emailPlaceholder")}
									value={field.validation?.emailMessage || ""}
								/>
							</div>
						)}
					</>
				)}

				{isNumberType && (
					<>
						{field.validation?.min !== undefined && (
							<div className="flex flex-col gap-2">
								<Label
									className="text-card-foreground"
									htmlFor="min-value-message"
								>
									{t("minValueMessage")}
								</Label>
								<Input
									id="min-value-message"
									onChange={(e) =>
										onUpdateValidation({
											minMessage: e.target.value || undefined,
										})
									}
									placeholder={t("minValuePlaceholder", {
										value: field.validation.min,
									})}
									value={field.validation?.minMessage || ""}
								/>
							</div>
						)}

						{field.validation?.max !== undefined && (
							<div className="flex flex-col gap-2">
								<Label
									className="text-card-foreground"
									htmlFor="max-value-message"
								>
									{t("maxValueMessage")}
								</Label>
								<Input
									id="max-value-message"
									onChange={(e) =>
										onUpdateValidation({
											maxMessage: e.target.value || undefined,
										})
									}
									placeholder={t("maxValuePlaceholder", {
										value: field.validation.max,
									})}
									value={field.validation?.maxMessage || ""}
								/>
							</div>
						)}

						<div className="flex flex-col gap-2">
							<Label className="text-card-foreground" htmlFor="number-message">
								{t("invalidNumberMessage")}
							</Label>
							<Input
								id="number-message"
								onChange={(e) =>
									onUpdateValidation({
										numberMessage: e.target.value || undefined,
									})
								}
								placeholder={t("invalidNumberPlaceholder")}
								value={field.validation?.numberMessage || ""}
							/>
						</div>
					</>
				)}
			</div>
		</Card>
	);
}
