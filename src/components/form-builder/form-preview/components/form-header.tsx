import { useTranslations } from "next-intl";
import { getInternalFormTitle } from "@/lib/utils/form-utils";
import type { FormHeaderProps } from "../types";
import { EditableField } from "./editable-field";

export function FormHeader({ schema, onFormSettingsUpdate }: FormHeaderProps) {
	const t = useTranslations("product.formBuilder.formPreview");
	const handleTitleUpdate = (title: string) => {
		onFormSettingsUpdate?.({ title: title || "" });
	};

	const handleDescriptionUpdate = (description: string) => {
		onFormSettingsUpdate?.({ description });
	};

	const internalTitle = getInternalFormTitle(schema);
	const hasPublicTitle =
		schema.settings?.publicTitle &&
		schema.settings.publicTitle !== schema.settings?.title;

	return (
		<div className="flex flex-col">
			<EditableField
				className="flex items-center gap-2"
				disabled={!onFormSettingsUpdate}
				inputClassName="text-3xl font-bold bg-background w-full"
				onSave={handleTitleUpdate}
				placeholder={t("titlePlaceholder")}
				value={schema.settings?.title || ""}
			>
				<div className="flex flex-col gap-1">
					<h1 className="truncate font-bold text-3xl text-foreground">
						{internalTitle}
					</h1>
					{hasPublicTitle && (
						<p className="text-muted-foreground text-sm">
							{t("publicTitle", {
								title: schema.settings?.publicTitle ?? "",
							})}
						</p>
					)}
				</div>
			</EditableField>

			<EditableField
				className="flex items-start gap-2"
				component="textarea"
				disabled={!onFormSettingsUpdate}
				inputClassName="bg-background w-full"
				onSave={handleDescriptionUpdate}
				placeholder={t("descriptionPlaceholder")}
				rows={Math.max(
					(schema.settings?.description || "").split("\n").length || 1,
					1
				)}
				value={schema.settings?.description || ""}
			>
				{schema.settings?.description ? (
					<p className="whitespace-pre-wrap text-muted-foreground">
						{schema.settings?.description}
					</p>
				) : onFormSettingsUpdate ? (
					<p className="text-muted-foreground italic">
						{t("descriptionPlaceholder")}
					</p>
				) : null}
			</EditableField>
		</div>
	);
}
