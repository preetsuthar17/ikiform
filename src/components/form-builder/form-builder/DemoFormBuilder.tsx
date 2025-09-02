"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import type { FormBlock, FormField, FormSchema } from "@/lib/database";
import { createDefaultFormSchema } from "@/lib/forms/form-defaults";
import { FormBuilderHeader } from "./components/FormBuilderHeader";
import { FormBuilderModals } from "./components/FormBuilderModals";
import { FormBuilderPanels } from "./components/FormBuilderPanels";
import {
  addFieldToSchema,
  findSelectedField,
  generateBlockId,
  generateFieldId,
  removeFieldFromSchema,
  updateFieldInSchema,
} from "./utils";

export default function DemoFormBuilder() {
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

  const selectedField = useMemo(
    () => findSelectedField(formSchema, selectedFieldId),
    [formSchema, selectedFieldId]
  );

  const addField = (fieldType: FormField["type"]) => {
    const newField: FormField = {
      id: generateFieldId(),
      type: fieldType,
      label: `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
      placeholder: "",
      required: false,
      options: ["select", "radio", "checkbox"].includes(fieldType)
        ? ["Option 1", "Option 2"]
        : undefined,
      validation: {},
      settings:
        fieldType === "slider"
          ? { min: 0, max: 100, step: 1, defaultValue: 50 }
          : fieldType === "tags"
            ? { maxTags: 10, allowDuplicates: false }
            : {},
    };
    const updatedSchema = addFieldToSchema(
      formSchema,
      newField,
      selectedBlockId
    );
    setFormSchema(updatedSchema);
    setSelectedFieldId(newField.id);
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

  return (
    <div className="mx-auto flex h-[900px] w-full flex-col overflow-hidden rounded-card border bg-background">
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
        onFormSettingsUpdate={noop}
        onFormTypeSelect={noop}
        onPublish={asyncNoop}
        onSchemaUpdate={noop}
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
