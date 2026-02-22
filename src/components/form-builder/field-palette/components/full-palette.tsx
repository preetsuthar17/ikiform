import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	FIELD_CATEGORIES,
	FIELD_TYPE_CONFIGS,
} from "@/lib/fields/field-config";

import { PALETTE_CONFIG } from "../constants";

import type { FieldPaletteProps } from "../types";
import { FieldItem } from "./field-item";
import { PaletteHeader } from "./palette-header";

export function FullPalette({
	onAddField,
}: Pick<FieldPaletteProps, "onAddField" | "formSchema" | "onSchemaUpdate">) {
	const [searchTerm, setSearchTerm] = useState("");

	const filteredFields = useMemo(() => {
		if (!searchTerm.trim()) {
			return FIELD_TYPE_CONFIGS;
		}

		const term = searchTerm.toLowerCase();
		return FIELD_TYPE_CONFIGS.filter(
			(field) =>
				field.label.toLowerCase().includes(term) ||
				field.description.toLowerCase().includes(term) ||
				field.type.toLowerCase().includes(term)
		);
	}, [searchTerm]);

	const groupedFields = useMemo(() => {
		const groups: Record<string, typeof FIELD_TYPE_CONFIGS> = {};

		filteredFields.forEach((field) => {
			if (!groups[field.category]) {
				groups[field.category] = [];
			}
			groups[field.category].push(field);
		});

		return groups;
	}, [filteredFields]);

	return (
		<div
			aria-label="Field palette"
			className="flex h-full flex-col gap-6 border-border p-2 lg:border-r lg:p-4"
			role="complementary"
			style={{
				overscrollBehavior: "contain",
			}}
		>
			<div className="flex flex-col gap-4">
				<PaletteHeader
					description={PALETTE_CONFIG.HEADER.DESCRIPTION}
					title={PALETTE_CONFIG.HEADER.TITLE}
				/>
			</div>
			<InputGroup>
				<InputGroupAddon align="inline-start">
					<Search aria-hidden="true" className="size-4 text-muted-foreground" />
				</InputGroupAddon>
				<InputGroupInput
					aria-label="Search fields"
					autoComplete="off"
					name="field-search"
					onChange={(e) => setSearchTerm(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Escape") {
							setSearchTerm("");
							e.currentTarget.blur();
						}
					}}
					placeholder="Search fields..."
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
										{FIELD_CATEGORIES[key as keyof typeof FIELD_CATEGORIES]}
									</div>
									<div
										aria-label={`${FIELD_CATEGORIES[key as keyof typeof FIELD_CATEGORIES]} fields`}
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
								No fields found matching "{searchTerm}"
							</p>
							<p className="text-muted-foreground text-xs">
								Try searching by field name, description, or type
							</p>
						</div>
					)}
				</div>
			</ScrollArea>
		</div>
	);
}
