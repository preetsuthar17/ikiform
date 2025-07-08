"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { FormBuilderPanels } from "./components/FormBuilderPanels";
import { createDefaultFormSchema } from "@/lib/forms/form-defaults";
import {
  generateFieldId,
  generateBlockId,
  addFieldToSchema,
  updateFieldInSchema,
  removeFieldFromSchema,
} from "./utils";
import { findSelectedField } from "./utils";
import type { FormField, FormSchema, FormBlock } from "@/lib/database";

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
      return {
        ...prev,
        blocks: updatedBlocks,
        fields,
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

  return (
    <div className="border rounded-card shadow-lg/2 bg-background overflow-hidden flex flex-col h-[900px] w-full mx-auto">
      <div className="flex items-center justify-between px-4 py-2 border-b bg-">
        <div className="font-semibold text-lg">
          Interactive Form Builder Demo
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleModeToggle}>
            {formSchema.settings.multiStep ? "Single Step" : "Multi Step"}
          </Button>
          <Button variant="destructive" size="sm" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <FormBuilderPanels
          formSchema={formSchema}
          selectedFieldId={selectedFieldId}
          selectedBlockId={selectedBlockId}
          selectedField={selectedField}
          onFieldAdd={addField}
          onFieldSelect={setSelectedFieldId}
          onFieldUpdate={updateField}
          onFieldDelete={deleteField}
          onFieldsReorder={reorderFields}
          onBlockSelect={setSelectedBlockId}
          onBlocksUpdate={updateBlocks}
          onBlockAdd={addBlock}
          onBlockUpdate={updateBlock}
          onBlockDelete={deleteBlock}
          onFormSettingsUpdate={updateFormSettings}
          onStepSelect={handleStepSelection}
        />
      </div>
    </div>
  );
}
