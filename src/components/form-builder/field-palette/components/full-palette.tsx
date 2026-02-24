import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FIELD_TYPE_CONFIGS } from "@/lib/fields/field-config";

import type { FieldPaletteProps } from "../types";
import { FieldItem } from "./field-item";
import { PaletteHeader } from "./palette-header";

export function FullPalette({
	onAddField,
}: Pick<FieldPaletteProps, "onAddField" | "formSchema" | "onSchemaUpdate">) {
	const t = useTranslations("product.formBuilder.fieldPalette");
	const [searchTerm, setSearchTerm] = useState("");
	const localizedFields = useMemo(
		() =>
			FIELD_TYPE_CONFIGS.map((field) => ({
				...field,
				label: t(`fields.${field.type}.label`),
				description: t(`fields.${field.type}.description`),
				categoryLabel: t(`categories.${field.category}`),
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

	const groupedFields = useMemo(() => {
		const groups: Record<string, typeof localizedFields> = {};

		filteredFields.forEach((field) => {
			if (!groups[field.category]) {
				groups[field.category] = [];
			}
			groups[field.category].push(field);
		});

		return groups;
	}, [filteredFields, localizedFields]);

	return (
		<div
			aria-label={t("ariaPalette")}
			className="flex h-full flex-col gap-6 border-border p-2 lg:border-r lg:p-4"
			role="complementary"
			style={{
				overscrollBehavior: "contain",
			}}
		>
			<div className="flex flex-col gap-4">
				<PaletteHeader
					description={t("headerDescription")}
					title={t("headerTitle")}
				/>
			</div>
			<InputGroup>
				<InputGroupAddon align="inline-start">
					<Search aria-hidden="true" className="size-4 text-muted-foreground" />
				</InputGroupAddon>
				<InputGroupInput
					aria-label={t("searchAria")}
					autoComplete="off"
					name="field-search"
					onChange={(e) => setSearchTerm(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Escape") {
							setSearchTerm("");
							e.currentTarget.blur();
						}
					}}
					placeholder={t("searchPlaceholder")}
					type="search"
					value={searchTerm}
				/>
			</InputGroup>

			<ScrollArea
				className="h-0 min-h-0 flex-1"
				style={{
					overscrollBehavior: "contain",
				}}
			>
				<div className="flex flex-col gap-4 rounded-2xl">
					{Object.entries(groupedFields).length > 0 ? (
						Object.entries(groupedFields).map(([key, fields]) => {
							const colCount = 2;
							const columns = Array.from({ length: colCount }, (_, colIdx) =>
								fields.filter((_, idx) => idx % colCount === colIdx)
							);

							return (
								<div className="flex flex-col gap-2" key={key}>
									<div
										aria-level={3}
										className="px-1 text-muted-foreground text-xs uppercase tracking-wide"
										role="heading"
									>
										{fields[0]?.categoryLabel ?? t(`categories.${key}`)}
									</div>
									<div
										aria-label={t("categoryFieldsAria", {
											category: fields[0]?.categoryLabel ?? t(`categories.${key}`),
										})}
										className="grid grid-cols-1 gap-2 rounded-2xl"
										role="list"
									>
										{columns.map((col, colIdx) => (
											<div className="flex flex-col gap-2" key={colIdx}>
												{col.map((f) => (
													<FieldItem
														fieldType={{
															type: f.type,
															label: f.label,
															description: f.description,
															icon: f.icon,
														}}
														key={f.type}
														onAddField={onAddField}
													/>
												))}
											</div>
										))}
									</div>
								</div>
							);
						})
					) : (
						<div
							aria-live="polite"
							className="flex flex-col items-center justify-center gap-2 py-8 text-center"
							role="status"
						>
							<Search
								aria-hidden="true"
								className="size-8 text-muted-foreground"
							/>
							<p className="text-muted-foreground text-sm">
								{t("noFieldsFound", { searchTerm })}
							</p>
							<p className="text-muted-foreground text-xs">
								{t("searchHint")}
							</p>
						</div>
					)}
				</div>
			</ScrollArea>
		</div>
	);
}
