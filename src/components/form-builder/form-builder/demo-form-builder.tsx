"use client";

import React, { useMemo, useState } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import type { FormBlock, FormField, FormSchema } from "@/lib/database";
import { createFieldFromType } from "@/lib/fields/field-config";
import { createDefaultFormSchema } from "@/lib/forms/form-defaults";
import { FieldPalette } from "../field-palette";
import { FieldSettingsPanel } from "../field-settings-panel";
import { FormPreview } from "../form-preview";
import { FormBuilderHeader } from "./components/form-builder-header";
import { FormBuilderModals } from "./components/form-builder-modals";
import { FormBuilderPanels } from "./components/form-builder-panels";
import {
	addFieldToSchema,
	findSelectedField,
	generateBlockId,
	removeFieldFromSchema,
	updateFieldInSchema,
} from "./utils";

function useIsMobile() {
	const [isMobile, setIsMobile] = React.useState(false);
	React.useEffect(() => {
		const check = () => setIsMobile(window.innerWidth <= 1024);
		check();
		window.addEventListener("resize", check);
		return () => window.removeEventListener("resize", check);
	}, []);
	return isMobile;
}

export default function DemoFormBuilder() {
	const isMobile = useIsMobile();
	const [formSchema, setFormSchema] = useState<FormSchema>(() =>
		createDefaultFormSchema({
			title: "Demo Form",
			description: "Try building a form!",
		})
	);
	const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
	const [selectedBlockId, setSelectedBlockId] = useState<string | null>(
		formSchema.blocks[0]?.id || null
	);
	const [showFormSettings, setShowFormSettings] = useState(false);
	const [showJsonView, setShowJsonView] = useState(false);
	const [showSettings, setShowSettings] = useState(false);
	const [showCreationWizard, setShowCreationWizard] = useState(false);
	const [showShareModal, setShowShareModal] = useState(false);
	const [showFieldPalette, setShowFieldPalette] = useState(false);
	const [showFieldSettings, setShowFieldSettings] = useState(false);

	const selectedField = useMemo(
		() => findSelectedField(formSchema, selectedFieldId),
		[formSchema, selectedFieldId]
	);

	const handleFieldSelect = (fieldId: string | null) => {
		setSelectedFieldId(fieldId);
		if (isMobile && fieldId) setShowFieldSettings(true);
		if (isMobile && !fieldId) setShowFieldSettings(false);
	};

	const addField = (fieldType: FormField["type"]) => {
		const newField = createFieldFromType(fieldType);
		const updatedSchema = addFieldToSchema(
			formSchema,
			newField,
			selectedBlockId
		);
		setFormSchema(updatedSchema);
		setSelectedFieldId(newField.id);
	};

	const handleAddField = (fieldType: FormField["type"]) => {
		addField(fieldType);
		setShowFieldPalette(false);
	};

	const updateField = (updatedField: FormField) => {
		const updatedSchema = updateFieldInSchema(formSchema, updatedField);
		setFormSchema(updatedSchema);
	};

	const deleteField = (fieldId: string) => {
		const updatedSchema = removeFieldFromSchema(formSchema, fieldId);
		setFormSchema(updatedSchema);
		if (selectedFieldId === fieldId) setSelectedFieldId(null);
	};

	const reorderFields = (fields: FormField[]) => {
		setFormSchema((prev) => {
			const updatedBlocks = [...prev.blocks];
			if (updatedBlocks.length > 0) {
				updatedBlocks[0] = {
					...updatedBlocks[0],
					fields,
				};
			}

			let updatedFields = prev.fields;
			if (!prev.blocks || prev.blocks.length === 0) {
				updatedFields = fields;
			}

			return {
				...prev,
				blocks: updatedBlocks,
				fields: updatedFields,
			};
		});
	};

	const addBlock = () => {
		const newBlock: FormBlock = {
			id: generateBlockId(),
			title: `Step ${formSchema.blocks.length + 1}`,
			description: "",
			fields: [],
		};
		setFormSchema((prev) => ({
			...prev,
			blocks: [...prev.blocks, newBlock],
			settings: {
				...prev.settings,
				multiStep: prev.blocks.length > 0,
			},
		}));
		setSelectedBlockId(newBlock.id);
	};

	const updateBlocks = (blocks: FormBlock[]) => {
		setFormSchema((prev) => ({
			...prev,
			blocks,
			fields: blocks.flatMap((block) => block.fields),
		}));
	};

	const updateBlock = (blockId: string, updates: Partial<FormBlock>) => {
		setFormSchema((prev) => {
			const updatedBlocks = prev.blocks.map((block) =>
				block.id === blockId ? { ...block, ...updates } : block
			);
			return {
				...prev,
				blocks: updatedBlocks,
				fields: updatedBlocks.flatMap((block) => block.fields),
			};
		});
	};

	const deleteBlock = (blockId: string) => {
		setFormSchema((prev) => {
			const updatedBlocks = prev.blocks.filter((block) => block.id !== blockId);
			return {
				...prev,
				blocks: updatedBlocks,
				fields: updatedBlocks.flatMap((block) => block.fields),
				settings: {
					...prev.settings,
					multiStep: updatedBlocks.length > 1,
				},
			};
		});
		if (selectedBlockId === blockId) setSelectedBlockId(null);
	};

	const updateFormSettings = (settings: Partial<FormSchema["settings"]>) => {
		setFormSchema((prev) => ({
			...prev,
			settings: { ...prev.settings, ...settings },
		}));
	};

	const handleSchemaUpdate = (updates: Partial<FormSchema>) => {
		setFormSchema((prev) => ({
			...prev,
			...updates,
			settings: {
				...prev.settings,
				...(updates.settings || {}),
			},
		}));
	};

	const handleStepSelection = (stepIndex: number) => {
		if (formSchema.blocks && formSchema.blocks[stepIndex]) {
			setSelectedBlockId(formSchema.blocks[stepIndex].id);
		}
	};

	const handleModeToggle = () => {
		const newMultiStep = !formSchema.settings.multiStep;
		if (newMultiStep) {
			if (
				formSchema.blocks.length === 0 ||
				(formSchema.blocks.length === 1 &&
					formSchema.blocks[0].id === "default")
			) {
				const defaultBlock = formSchema.blocks.find((b) => b.id === "default");
				const currentFields = defaultBlock?.fields || formSchema.fields || [];
				const newSchema = {
					...formSchema,
					blocks: [
						{
							id: "step-1",
							title: "Step 1",
							description: "First step of your form",
							fields: currentFields,
						},
					],
					fields: currentFields,
					settings: {
						...formSchema.settings,
						multiStep: true,
						showProgress: true,
					},
				};
				setFormSchema(newSchema);
				setSelectedBlockId("step-1");
			} else {
				updateFormSettings({
					multiStep: true,
					showProgress: true,
				});
			}
		} else {
			const allFields = formSchema.blocks.flatMap(
				(block) => block.fields || []
			);
			const newSchema = {
				...formSchema,
				blocks: [
					{
						id: "default",
						title: "Form Fields",
						description: "",
						fields: allFields,
					},
				],
				fields: allFields,
				settings: {
					...formSchema.settings,
					multiStep: false,
					showProgress: false,
				},
			};
			setFormSchema(newSchema);
			setSelectedBlockId("default");
		}
	};

	const handleReset = () => {
		setFormSchema(
			createDefaultFormSchema({
				title: "Demo Form",
				description: "Try building a form!",
			})
		);
		setSelectedFieldId(null);
		setSelectedBlockId("default");
	};

	const noop = () => {};
	const asyncNoop = async () => {};

	if (isMobile) {
		return (
			<div className="flex h-screen flex-col overflow-hidden bg-background">
				<div className="sticky top-0 z-30 bg-card">
					<FormBuilderHeader
						autoSaving={false}
						formId={undefined}
						formSchema={formSchema}
						isPublished={false}
						onAnalytics={noop}
						onJsonView={() => setShowJsonView(true)}
						onModeToggle={handleModeToggle}
						onPublish={noop}
						onSave={noop}
						onSettings={() => setShowFormSettings(true)}
						onShare={noop}
						publishing={false}
						saving={false}
					/>
				</div>
				<div className="relative flex-1 overflow-auto">
					<div className="h-full w-full">
						<FormPreview
							onAddField={addField}
							onBlockUpdate={updateBlock}
							onFieldDelete={deleteField}
							onFieldSelect={handleFieldSelect}
							onFieldsReorder={reorderFields}
							onFormSettingsUpdate={updateFormSettings}
							onStepSelect={handleStepSelection}
							schema={formSchema}
							selectedBlockId={selectedBlockId}
							selectedFieldId={selectedFieldId}
						/>
					</div>
					<Drawer onOpenChange={setShowFieldPalette} open={showFieldPalette}>
						<DrawerContent className="mx-auto w-full rounded-t-2xl p-4">
							<div className="h-[70vh] w-full">
								<FieldPalette onAddField={handleAddField} />
							</div>
						</DrawerContent>
					</Drawer>
					<Drawer
						onOpenChange={(open) => {
							setShowFieldSettings(open);
							if (!open) setSelectedFieldId(null);
						}}
						open={showFieldSettings}
					>
						<DrawerContent className="mx-auto w-full rounded-t-2xl p-0">
							<div className="flex h-[80vh] flex-col">
								<FieldSettingsPanel
									field={selectedField}
									onClose={() => {
										setShowFieldSettings(false);
										setSelectedFieldId(null);
									}}
									onFieldUpdate={updateField}
								/>
							</div>
						</DrawerContent>
					</Drawer>
				</div>
				<FormBuilderModals
					formId={undefined}
					formSchema={formSchema}
					isPublished={false}
					onCloseCreationWizard={() => setShowCreationWizard(false)}
					onCloseFormSettings={() => setShowFormSettings(false)}
					onCloseJsonView={() => setShowJsonView(false)}
					onCloseSettings={() => setShowSettings(false)}
					onCloseShareModal={() => setShowShareModal(false)}
					onFormSettingsUpdate={updateFormSettings}
					onFormTypeSelect={noop}
					onPublish={asyncNoop}
					onSchemaUpdate={handleSchemaUpdate}
					showCreationWizard={showCreationWizard}
					showFormSettings={showFormSettings}
					showJsonView={showJsonView}
					showSettings={showSettings}
					showShareModal={showShareModal}
					userEmail={undefined}
				/>
			</div>
		);
	}

	return (
		<div className="mx-auto flex w-full flex-col overflow-hidden rounded-2xl border bg-background">
			<FormBuilderHeader
				autoSaving={false}
				formId={undefined}
				formSchema={formSchema}
				isPublished={false}
				onAnalytics={noop}
				onJsonView={() => setShowJsonView(true)}
				onModeToggle={handleModeToggle}
				onPublish={noop}
				onSave={noop}
				onSettings={() => setShowFormSettings(true)}
				onShare={noop}
				publishing={false}
				saving={false}
			/>
			<div className="min-h-0 flex-1">
				<FormBuilderPanels
					formSchema={formSchema}
					onBlockAdd={addBlock}
					onBlockDelete={deleteBlock}
					onBlockSelect={setSelectedBlockId}
					onBlocksUpdate={updateBlocks}
					onBlockUpdate={updateBlock}
					onFieldAdd={addField}
					onFieldDelete={deleteField}
					onFieldSelect={setSelectedFieldId}
					onFieldsReorder={reorderFields}
					onFieldUpdate={updateField}
					onFormSettingsUpdate={updateFormSettings}
					onStepSelect={handleStepSelection}
					selectedBlockId={selectedBlockId}
					selectedField={selectedField}
					selectedFieldId={selectedFieldId}
				/>
			</div>
			<FormBuilderModals
				formId={undefined}
				formSchema={formSchema}
				isPublished={false}
				onCloseCreationWizard={() => setShowCreationWizard(false)}
				onCloseFormSettings={() => setShowFormSettings(false)}
				onCloseJsonView={() => setShowJsonView(false)}
				onCloseSettings={() => setShowSettings(false)}
				onCloseShareModal={() => setShowShareModal(false)}
				onFormSettingsUpdate={updateFormSettings}
				onFormTypeSelect={noop}
				onPublish={asyncNoop}
				onSchemaUpdate={handleSchemaUpdate}
				showCreationWizard={showCreationWizard}
				showFormSettings={showFormSettings}
				showJsonView={showJsonView}
				showSettings={showSettings}
				showShareModal={showShareModal}
				userEmail={undefined}
			/>
		</div>
	);
}
