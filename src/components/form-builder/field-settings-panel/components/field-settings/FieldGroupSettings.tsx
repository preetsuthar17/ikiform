import { ChevronDown, Plus, Settings, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
	createFieldFromType,
	FIELD_CATEGORIES,
	FIELD_TYPE_CONFIGS,
} from "@/lib/fields/field-config";
import { FieldSpecificSettings } from "../FieldSpecificSettings";
import type { FieldSettingsProps } from "./types";

export function FieldGroupSettings({
	field,
	onUpdateSettings,
	onFieldUpdate,
}: FieldSettingsProps) {
	const groupFields = field.settings?.groupFields || [];
	const groupLayout = field.settings?.groupLayout || "horizontal";
	const groupSpacing = field.settings?.groupSpacing || "normal";
	const groupColumns = field.settings?.groupColumns || 2;
	const [pickerOpen, setPickerOpen] = useState(false);

	const [expandedFields, setExpandedFields] = useState<{
		[id: string]: boolean;
	}>({});

	const addFieldToGroup = (fieldType: string) => {
		const newField = createFieldFromType(fieldType as any);
		const updatedGroupFields = [...groupFields, newField];
		onUpdateSettings({
			groupFields: updatedGroupFields,
		});
	};

	const removeFieldFromGroup = (fieldId: string) => {
		const updatedGroupFields = groupFields.filter((f) => f.id !== fieldId);
		onUpdateSettings({
			groupFields: updatedGroupFields,
		});
		setExpandedFields((prev) => {
			const copy = { ...prev };
			delete copy[fieldId];
			return copy;
		});
	};

	const updateGroupField = (fieldId: string, updates: any) => {
		const updatedGroupFields = groupFields.map((f) =>
			f.id === fieldId ? { ...f, ...updates } : f,
		);
		onUpdateSettings({
			groupFields: updatedGroupFields,
		});
	};

	const setFieldExpansion = (fieldId: string, open: boolean) => {
		setExpandedFields((prev) => ({
			...prev,
			[fieldId]: open,
		}));
	};

	const handleSettingsButton = (fieldId: string) => {
		setFieldExpansion(fieldId, !expandedFields[fieldId]);
	};

	return (
		<div className="flex flex-col gap-4">
			<Card className="gap-2 p-4 shadow-none">
				<CardHeader className="p-0">
					<CardTitle className="flex items-center gap-2 text-lg">
						Layout Settings
					</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col gap-2 p-0">
					<div className="flex flex-col gap-2">
						<Label className="font-medium text-sm" htmlFor="group-layout">
							Layout Direction
						</Label>
						<Select
							onValueChange={(value) =>
								onUpdateSettings({
									groupLayout: value as "horizontal" | "vertical",
								})
							}
							value={groupLayout}
						>
							<SelectTrigger className="w-full" id="group-layout">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="horizontal">
									Horizontal (Side by Side)
								</SelectItem>
								<SelectItem value="vertical">Vertical (Stacked)</SelectItem>
							</SelectContent>
						</Select>
						<p className="text-muted-foreground text-xs" id="group-layout-help">
							How fields are arranged within the group
						</p>
					</div>

					{groupLayout === "horizontal" && (
						<div className="flex flex-col gap-2">
							<Label className="font-medium text-sm" htmlFor="group-columns">
								Number of Columns
							</Label>
							<Select
								onValueChange={(value) =>
									onUpdateSettings({
										groupColumns: Number.parseInt(value) as 2 | 3 | 4,
									})
								}
								value={groupColumns.toString()}
							>
								<SelectTrigger className="w-full" id="group-columns">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="2">2 Columns</SelectItem>
									<SelectItem value="3">3 Columns</SelectItem>
									<SelectItem value="4">4 Columns</SelectItem>
								</SelectContent>
							</Select>
							<p
								className="text-muted-foreground text-xs"
								id="group-columns-help"
							>
								Number of columns for horizontal layout
							</p>
						</div>
					)}

					<div className="flex flex-col gap-2">
						<Label className="font-medium text-sm" htmlFor="group-spacing">
							Field Spacing
						</Label>
						<Select
							onValueChange={(value) =>
								onUpdateSettings({
									groupSpacing: value as "compact" | "normal" | "relaxed",
								})
							}
							value={groupSpacing}
						>
							<SelectTrigger className="w-full" id="group-spacing">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="compact">Compact</SelectItem>
								<SelectItem value="normal">Normal</SelectItem>
								<SelectItem value="relaxed">Relaxed</SelectItem>
							</SelectContent>
						</Select>
						<p
							className="text-muted-foreground text-xs"
							id="group-spacing-help"
						>
							Spacing between fields in the group
						</p>
					</div>
				</CardContent>
			</Card>

			<Card className="gap-2 p-4 shadow-none">
				<CardHeader className="p-0">
					<CardTitle className="flex items-center gap-2 text-lg">
						Group Fields ({groupFields.length})
					</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col gap-2 p-0">
					<div className="flex justify-start">
						<Dialog onOpenChange={setPickerOpen} open={pickerOpen}>
							<DialogTrigger asChild>
								<Button
									aria-label="Add field to group"
									className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
									size="sm"
									type="button"
									variant="outline"
								>
									<Plus aria-hidden="true" className="size-4" />
									Add field
								</Button>
							</DialogTrigger>
							<DialogContent className="p-0">
								<DialogHeader className="px-4 pt-4">
									<DialogTitle>Add a field</DialogTitle>
								</DialogHeader>
								<ScrollArea className="max-h-[70vh] p-4 pt-2">
									<div className="grid grid-cols-1 gap-6">
										{Object.entries(FIELD_CATEGORIES).map(([key, title]) => (
											<div className="flex flex-col gap-3" key={key}>
												<div className="px-1 text-muted-foreground text-xs uppercase tracking-wide">
													{title}
												</div>
												<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
													{FIELD_TYPE_CONFIGS.filter(
														(f) => f.category === (key as any),
													).map((f) => (
														<Button
															className="h-19 w-full items-center justify-start text-left"
															key={f.type}
															onClick={() => {
																addFieldToGroup(f.type);
																setPickerOpen(false);
															}}
															type="button"
															variant="outline"
														>
															<div className="flex flex-col">
																<span className="font-medium text-foreground text-sm">
																	{f.label}
																</span>
																<span className="text-wrap text-muted-foreground text-xs">
																	{f.description}
																</span>
															</div>
														</Button>
													))}
												</div>
											</div>
										))}
									</div>
								</ScrollArea>
							</DialogContent>
						</Dialog>
					</div>

					{groupFields.length === 0 ? (
						<div
							aria-live="polite"
							className="rounded-md border border-border border-dashed p-6 text-center text-muted-foreground"
							role="status"
						>
							<p className="text-sm">No fields in this group yet.</p>
							<p className="text-xs">
								Add fields using the dropdown or quick add buttons above.
							</p>
						</div>
					) : (
						<div className="flex flex-col gap-3">
							{groupFields.map((groupField) => (
								<Card className="gap-2 p-4 shadow-none" key={groupField.id}>
									<div className="flex flex-col gap-4">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<h4 className="font-medium text-card-foreground text-sm">
													{groupField.label || `${groupField.type} Field`}
												</h4>
												<span className="rounded bg-muted px-2 py-1 text-muted-foreground text-xs">
													{groupField.type}
												</span>
											</div>
											<div className="flex items-center gap-1">
												<Button
													aria-label={`Settings for ${groupField.label || groupField.type} field`}
													className="size-8"
													onClick={() => handleSettingsButton(groupField.id)}
													onKeyDown={(e) => {
														if (e.key === "Enter" || e.key === " ") {
															e.preventDefault();
															handleSettingsButton(groupField.id);
														}
													}}
													size="icon"
													type="button"
													variant="ghost"
												>
													<Settings aria-hidden="true" className="size-4" />
												</Button>
												<Button
													aria-label={`Remove ${groupField.label || groupField.type} field`}
													className="size-8"
													onClick={() => removeFieldFromGroup(groupField.id)}
													onKeyDown={(e) => {
														if (e.key === "Enter" || e.key === " ") {
															e.preventDefault();
															removeFieldFromGroup(groupField.id);
														}
													}}
													size="icon"
													type="button"
													variant="destructive"
												>
													<X aria-hidden="true" className="size-4" />
												</Button>
											</div>
										</div>

										<div className="grid grid-cols-1 gap-2 md:grid-cols-2">
											<div className="flex flex-col gap-2">
												<Label
													className="font-medium text-sm"
													htmlFor={`${groupField.id}-label`}
												>
													Field Label
												</Label>
												<Input
													aria-describedby={`${groupField.id}-label-help`}
													autoComplete="off"
													id={`${groupField.id}-label`}
													name={`${groupField.id}-label`}
													onChange={(e) =>
														updateGroupField(groupField.id, {
															label: e.target.value,
														})
													}
													onKeyDown={(e) => {
														if (e.key === "Escape") {
															e.currentTarget.blur();
														}
													}}
													placeholder="Enter field label"
													type="text"
													value={groupField.label}
												/>
												<p
													className="text-muted-foreground text-xs"
													id={`${groupField.id}-label-help`}
												>
													Label for this field
												</p>
											</div>
											<div className="flex flex-col gap-2">
												<Label
													className="font-medium text-sm"
													htmlFor={`${groupField.id}-placeholder`}
												>
													Placeholder Text
												</Label>
												<Input
													aria-describedby={`${groupField.id}-placeholder-help`}
													autoComplete="off"
													id={`${groupField.id}-placeholder`}
													name={`${groupField.id}-placeholder`}
													onChange={(e) =>
														updateGroupField(groupField.id, {
															placeholder: e.target.value,
														})
													}
													onKeyDown={(e) => {
														if (e.key === "Escape") {
															e.currentTarget.blur();
														}
													}}
													placeholder="Enter placeholder text"
													type="text"
													value={groupField.placeholder || ""}
												/>
												<p
													className="text-muted-foreground text-xs"
													id={`${groupField.id}-placeholder-help`}
												>
													Placeholder text for this field
												</p>
											</div>
										</div>

										<div className="flex items-center justify-between">
											<div className="flex flex-col gap-1">
												<Label
													className="font-medium text-sm"
													htmlFor={`${groupField.id}-required`}
												>
													Required field
												</Label>
												<p className="text-muted-foreground text-xs">
													Make this field mandatory
												</p>
											</div>
											<Switch
												aria-describedby={`${groupField.id}-required-help`}
												checked={groupField.required}
												id={`${groupField.id}-required`}
												name={`${groupField.id}-required`}
												onCheckedChange={(checked) =>
													updateGroupField(groupField.id, { required: checked })
												}
											/>
										</div>

										<Collapsible
											onOpenChange={(open) =>
												setFieldExpansion(groupField.id, open)
											}
											open={!!expandedFields[groupField.id]}
										>
											<CollapsibleTrigger asChild>
												<Button
													aria-label={`Toggle advanced settings for ${groupField.label || groupField.type}`}
													className="w-full justify-between"
													onKeyDown={(e) => {
														if (e.key === "Enter" || e.key === " ") {
															e.preventDefault();
															setFieldExpansion(
																groupField.id,
																!expandedFields[groupField.id],
															);
														}
													}}
													type="button"
													variant="outline"
												>
													<span className="text-card-foreground text-sm">
														Advanced Settings
													</span>
													<ChevronDown
														aria-hidden="true"
														className={`size-4 transition-transform ${
															expandedFields[groupField.id] ? "rotate-180" : ""
														}`}
													/>
												</Button>
											</CollapsibleTrigger>
											<CollapsibleContent className="mt-2 flex flex-col gap-4">
												<div className="bg-background">
													<FieldSpecificSettings
														field={groupField}
														onFieldUpdate={(updatedField) =>
															updateGroupField(groupField.id, updatedField)
														}
														onUpdateSettings={(settings) =>
															updateGroupField(groupField.id, {
																settings: {
																	...groupField.settings,
																	...settings,
																},
															})
														}
													/>
												</div>
											</CollapsibleContent>
										</Collapsible>
									</div>
								</Card>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
