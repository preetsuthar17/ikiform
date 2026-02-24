import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";

import { Card } from "@/components/ui/card";

import type { StepHeaderProps } from "../types";

import { EditableField } from "./editable-field";

export function StepHeader({
	currentStep,
	currentStepIndex,
	onBlockUpdate,
}: StepHeaderProps) {
	const t = useTranslations("product.formBuilder.formPreview");

	const handleTitleUpdate = (title: string) => {
		onBlockUpdate?.(currentStep.id, { title });
	};

	const handleDescriptionUpdate = (description: string) => {
		onBlockUpdate?.(currentStep.id, { description });
	};

	return (
		<Card className="gap-0 p-4 shadow-none">
			<EditableField
				className="flex items-center gap-2 p-0"
				disabled={!onBlockUpdate}
				inputClassName="text-xl font-semibold bg-background w-full"
				onSave={handleTitleUpdate}
				placeholder={t("stepTitlePlaceholder")}
				value={currentStep.title}
			>
				<div className="flex items-center gap-2">
					<h2 className="font-semibold text-foreground text-xl">
						{currentStep.title}
					</h2>
					<Badge className="text-xs" variant="secondary">
						{t("stepBadge", { index: currentStepIndex + 1 })}
					</Badge>
				</div>
			</EditableField>

			<EditableField
				className="flex items-start gap-2 p-0"
				component="textarea"
				disabled={!onBlockUpdate}
				inputClassName="bg-background min-h-[60px] w-full"
				onSave={handleDescriptionUpdate}
				placeholder={t("stepDescriptionPlaceholder")}
				rows={2}
				value={currentStep.description || ""}
			>
				{currentStep.description ? (
					<p className="whitespace-pre-wrap text-muted-foreground">
						{currentStep.description}
					</p>
				) : onBlockUpdate ? (
					<p className="text-muted-foreground italic">
						{t("stepDescriptionPlaceholder")}
					</p>
				) : null}
			</EditableField>
		</Card>
	);
}
