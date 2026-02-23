import { useTranslations } from "next-intl";
import type { BlockFieldsListProps } from "../types";
import { FieldItem } from "./field-item";

export function BlockFieldsList({
	fields,
	selectedFieldId,
	onFieldSelect,
	onFieldDelete,
}: BlockFieldsListProps) {
	const t = useTranslations("product.formBuilder.blockManager.fieldsList");

	if (fields.length === 0) {
		return (
			<p className="flex py-3 text-muted-foreground text-sm italic">
				{t("empty")}
			</p>
		);
	}

	return (
		<div className="flex flex-col gap-3">
			{fields.map((field) => (
				<FieldItem
					field={field}
					isSelected={selectedFieldId === field.id}
					key={field.id}
					onFieldDelete={onFieldDelete}
					onFieldSelect={onFieldSelect}
				/>
			))}
		</div>
	);
}
