import { Check, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import type { BlockEditFormProps } from "../types";

export function BlockEditForm({
	title,
	description,
	onTitleChange,
	onDescriptionChange,
	onSave,
	onCancel,
}: BlockEditFormProps) {
	const t = useTranslations("product.formBuilder.blockManager.editForm");

	return (
		<div className="flex w-full flex-col gap-3">
			<Input
				className="font-medium"
				onChange={(e) => onTitleChange(e.target.value)}
				placeholder={t("stepTitlePlaceholder")}
				value={title}
			/>
			<Textarea
				className="w-full"
				onChange={(e) => onDescriptionChange(e.target.value)}
				placeholder={t("stepDescriptionPlaceholder")}
				rows={2}
				value={description}
			/>
			<div className="flex items-center gap-2">
				<Button aria-label={t("save")} onClick={onSave} size="icon">
					<Check className="size-4" />
				</Button>
				<Button
					aria-label={t("cancel")}
					onClick={onCancel}
					size="icon"
					variant="secondary"
				>
					<X className="size-4" />
				</Button>
			</div>
		</div>
	);
}
