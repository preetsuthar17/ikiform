import { getInternalFormTitle } from "@/lib/utils/form-utils";
import type { FormHeaderProps } from "../types";
import { EditableField } from "./editable-field";

export function FormHeader({ schema, onFormSettingsUpdate }: FormHeaderProps) {
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
				placeholder="Click to add title..."
				value={schema.settings?.title || ""}
			>
				<div className="flex flex-col gap-1">
					<h1 className="truncate font-bold text-3xl text-foreground">
						{internalTitle}
					</h1>
					{hasPublicTitle && (
						<p className="text-muted-foreground text-sm">
							Public title: "{schema.settings?.publicTitle}"
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
				placeholder="Click to add a description..."
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
						Click to add a description...
					</p>
				) : null}
			</EditableField>
		</div>
	);
}
