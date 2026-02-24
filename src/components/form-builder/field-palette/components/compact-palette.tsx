import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FIELD_TYPE_CONFIGS } from "@/lib/fields/field-config";

import type { FieldPaletteProps } from "../types";
import { CompactFieldItem } from "./compact-field-item";

export function CompactPalette({
	onAddField,
}: Pick<FieldPaletteProps, "onAddField">) {
	const t = useTranslations("product.formBuilder.fieldPalette");
	const [searchTerm, setSearchTerm] = useState("");
	const localizedFields = useMemo(
		() =>
			FIELD_TYPE_CONFIGS.map((field) => ({
				type: field.type,
				icon: field.icon,
				label: t(`fields.${field.type}.label`),
				description: t(`fields.${field.type}.description`),
			})),
		[t]
	);

	const filteredFields = useMemo(() => {
		if (!searchTerm.trim()) {
			return localizedFields;
		}

		const term = searchTerm.toLowerCase();
		return localizedFields.filter(
			(field) =>
				field.label.toLowerCase().includes(term) ||
				field.description.toLowerCase().includes(term) ||
				field.type.toLowerCase().includes(term)
		);
	}, [searchTerm, localizedFields]);

	return (
		<div className="flex flex-col gap-3">
			{}
			<div className="relative px-2">
				<Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					className="pl-10"
					onChange={(e) => setSearchTerm(e.target.value)}
					placeholder={t("searchPlaceholder")}
					value={searchTerm}
				/>
			</div>

			<ScrollArea className="max-h-[60vh] p-2">
				{filteredFields.length > 0 ? (
					<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
						{filteredFields.map((fieldType) => (
							<CompactFieldItem
								fieldType={fieldType}
								key={fieldType.type}
								onAddField={onAddField}
							/>
						))}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
						<Search className="size-6 text-muted-foreground" />
						<p className="text-muted-foreground text-sm">
							{t("noFieldsFound", { searchTerm })}
						</p>
						<p className="text-muted-foreground text-xs">
							{t("searchHint")}
						</p>
					</div>
				)}
			</ScrollArea>
		</div>
	);
}
