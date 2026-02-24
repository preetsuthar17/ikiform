import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { FIELD_TYPE_CONFIGS } from "@/lib/fields/field-config";

import { FormFieldRenderer } from "../../form-field-renderer";

import type { FormFieldsContainerProps } from "../types";

export function FormFieldsContainer({
	fields,
	selectedFieldId,
	formData,
	onFieldSelect,
	onFieldDelete,
	onFieldValueChange,
	isMultiStep,
	onAddField,
	onFieldsReorder,
	fieldVisibility,
	showLogicCues = false,
}: FormFieldsContainerProps & { showLogicCues?: boolean }) {
	const t = useTranslations("product.formBuilder.formFields");
	const tPalette = useTranslations("product.formBuilder.fieldPalette");
	const itemRefs = React.useRef<Record<string, HTMLDivElement | null>>({});
	const addButtonRef = React.useRef<HTMLButtonElement | null>(null);
	const localizedFieldTypes = React.useMemo(
		() =>
			FIELD_TYPE_CONFIGS.map((field) => ({
				type: field.type,
				label: tPalette(`fields.${field.type}.label`),
			})),
		[tPalette]
	);

	const handleDragEnd = (result: any) => {
		if (!(result.destination && onFieldsReorder)) {
			return;
		}

		const sourceIndex = result.source.index;
		const destinationIndex = result.destination.index;

		if (sourceIndex === destinationIndex) {
			return;
		}

		const newFields = Array.from(fields);
		const [reorderedField] = newFields.splice(sourceIndex, 1);
		newFields.splice(destinationIndex, 0, reorderedField);

		onFieldsReorder(newFields);
	};

	const AddFieldButton = () => (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					aria-label={t("addFieldToFormAria")}
					className="h-42 w-full border-2 border-dashed transition-colors hover:border-primary/50 hover:bg-accent/10"
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							e.preventDefault();
						}
					}}
					ref={addButtonRef}
					variant="outline"
				>
					<Plus aria-hidden="true" className="size-4" />
					{t("addField")}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="center"
				className="h-42 w-48"
				style={{
					overscrollBehavior: "contain",
				}}
			>
				<ScrollArea type="always">
					{localizedFieldTypes.map((fieldType) => (
						<DropdownMenuItem
							aria-label={t("addSpecificFieldAria", { label: fieldType.label })}
							className="cursor-pointer"
							key={fieldType.type}
							onClick={() =>
								onAddField?.(fieldType.type)
							}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									onAddField?.(fieldType.type);
								}
							}}
						>
							{fieldType.label}
						</DropdownMenuItem>
					))}
				</ScrollArea>
			</DropdownMenuContent>
		</DropdownMenu>
	);

	const renderFields = showLogicCues
		? fields
		: fieldVisibility
			? fields.filter((field) => fieldVisibility[field.id]?.visible !== false)
			: fields;

	if (renderFields.length === 0) {
		return (
			<section
				aria-labelledby="form-fields-empty-heading"
				className="flex flex-col items-center justify-center gap-4 py-16 text-center"
				role="region"
			>
				<h2 className="sr-only" id="form-fields-empty-heading">
					{t("formFields")}
				</h2>
				<div className="flex size-16 items-center justify-center rounded-2xl bg-accent">
					<div aria-hidden="true" className="size-8 rounded-2xl bg-muted" />
				</div>
				<p className="font-medium text-foreground text-lg">
					{isMultiStep ? t("noFieldsInStep") : t("noFieldsYet")}
				</p>
				<p className="text-muted-foreground text-sm">
					{isMultiStep
						? t("addFieldsToStep")
						: t("addFieldsFromLeftPanel")}
				</p>
				{onAddField && <AddFieldButton />}
			</section>
		);
	}

	return (
		<section
			aria-labelledby="form-fields-heading"
			className="flex flex-col gap-4"
			role="region"
		>
			<h2 className="sr-only" id="form-fields-heading">
				{t("formFields")}
			</h2>
			<div aria-live="polite" className="sr-only">
				{t("fieldsCount", { count: renderFields.length })}
			</div>
			<DragDropContext onDragEnd={handleDragEnd}>
				<Droppable droppableId="fields">
					{(provided, snapshot) => (
						<ul
							className="flex flex-col gap-4"
							ref={provided.innerRef}
							role="list"
							{...provided.droppableProps}
						>
							{renderFields.map((field, index) => {
								const isHidden = fieldVisibility?.[field.id]?.visible === false;
								const isDisabled = fieldVisibility?.[field.id]?.disabled;
								return (
									<Draggable
										draggableId={field.id}
										index={index}
										key={field.id}
									>
										{(provided, snapshot) => (
											<li
												className="group relative"
												ref={provided.innerRef}
												role="listitem"
												{...provided.draggableProps}
												{...provided.dragHandleProps}
											>
												<div
													aria-selected={selectedFieldId === field.id}
													className="group relative"
													onKeyDown={(e) => {
														if (
															(e.key === "Enter" ||
																e.key === "Backspace" ||
																e.key === "Delete") &&
															(e.target instanceof HTMLInputElement ||
																e.target instanceof HTMLTextAreaElement)
														) {
															e.stopPropagation();
														}
														if (e.key === "Delete" || e.key === "Backspace") {
															e.preventDefault();
															const next =
																renderFields[index + 1]?.id ??
																renderFields[index - 1]?.id;
															onFieldDelete(field.id);
															requestAnimationFrame(() => {
																if (next && itemRefs.current[next]) {
																	itemRefs.current[next]?.focus();
																} else {
																	addButtonRef.current?.focus();
																}
															});
														}
													}}
												>
														<Card
														aria-describedby={
															showLogicCues && (isHidden || isDisabled)
																? `${field.id}-state`
																: undefined
														}
														aria-label={t("fieldAria", { type: field.type })}
														className={`p-4 shadow-none transition-all duration-200 ${
															selectedFieldId === field.id
																? "border-primary bg-accent/10 ring-2 ring-primary/20"
																: "border-border hover:bg-accent/5"
														} ${
															showLogicCues && isHidden
																? "pointer-events-none relative border-2 border-muted border-dashed opacity-50"
																: showLogicCues && isDisabled
																	? "relative opacity-60"
																	: ""
														} ${
															snapshot.isDragging
																? "rotate-2 shadow-lg ring-2 ring-primary/50"
																: ""
														}`}
														onClick={() =>
															onFieldSelect(
																selectedFieldId === field.id ? null : field.id
															)
														}
														onKeyDown={(e) => {
															if (e.key === "Enter" || e.key === " ") {
																e.preventDefault();
																onFieldSelect(
																	selectedFieldId === field.id ? null : field.id
																);
															}
														}}
														ref={(el) => {
															itemRefs.current[field.id] =
																el as HTMLDivElement | null;
														}}
														role="button"
														tabIndex={0}
													>
													<div className="absolute top-2 left-2 z-10 flex items-center gap-1 opacity-100 transition-opacity group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                            <div
                              className="cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing bg-card  p-3"
                            >
                              <GripVertical className="size-4" />
                            </div>
                          </div>
														<div className="absolute top-2 right-2 z-10 flex gap-1 opacity-100 transition-opacity group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
															<Tooltip>
																<TooltipTrigger asChild>
																	<Button
																		aria-label={t("deleteFieldAria", {
																			type: field.type,
																		})}
																		className="text-destructive hover:bg-destructive/10 hover:text-destructive-foreground"
																		onClick={(e) => {
																			e.stopPropagation();
																			const next =
																				renderFields[index + 1]?.id ??
																				renderFields[index - 1]?.id;
																			onFieldDelete(field.id);
																			requestAnimationFrame(() => {
																				if (next && itemRefs.current[next]) {
																					itemRefs.current[next]?.focus();
																				} else {
																					addButtonRef.current?.focus();
																				}
																			});
																		}}
																		onKeyDown={(e) => {
																			if (e.key === "Enter" || e.key === " ") {
																				e.preventDefault();
																				e.stopPropagation();
																				const next =
																					renderFields[index + 1]?.id ??
																					renderFields[index - 1]?.id;
																				onFieldDelete(field.id);
																				requestAnimationFrame(() => {
																					if (next && itemRefs.current[next]) {
																						itemRefs.current[next]?.focus();
																					} else {
																						addButtonRef.current?.focus();
																					}
																				});
																			}
																		}}
																		size="icon-sm"
																		variant="ghost"
																	>
																		<Trash2
																			aria-hidden="true"
																			className="size-4"
																		/>
																	</Button>
																</TooltipTrigger>
																<TooltipContent align="center" side="top">
																	{t("deleteField")}
																</TooltipContent>
															</Tooltip>
														</div>
														<FormFieldRenderer
															builderMode={true}
															disabled={fieldVisibility?.[field.id]?.disabled}
															field={field}
															onChange={(value) =>
																onFieldValueChange(field.id, value)
															}
															value={
																typeof formData[field.id] === "object"
																	? (formData[field.id].text ??
																		JSON.stringify(formData[field.id]))
																	: formData[field.id]
															}
														/>
													</Card>
												</div>
											</li>
										)}
									</Draggable>
								);
							})}
							{provided.placeholder}
							{onAddField && <AddFieldButton />}
						</ul>
					)}
				</Droppable>
			</DragDropContext>
		</section>
	);
}
