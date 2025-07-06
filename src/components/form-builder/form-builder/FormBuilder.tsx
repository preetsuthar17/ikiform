"use client";

// External imports
import React from "react";
import { useRouter } from "next/navigation";

// Component imports
import { Button } from "@/components/ui/button";
import { Loader } from "../../ui/loader";
import { FormBuilderHeader } from "./components/FormBuilderHeader";
import { FormBuilderPanels } from "./components/FormBuilderPanels";
import { FormBuilderModals } from "./components/FormBuilderModals";
import { UnsavedChangesIndicator } from "./components/UnsavedChangesIndicator";

// Hook imports
import { toast } from "@/hooks/use-toast";
import { useFormBuilder } from "./hooks/useFormBuilder";

// Utility imports
import { formsDb } from "@/lib/database";
import {
  generateFieldId,
  generateBlockId,
  addFieldToSchema,
  updateFieldInSchema,
  removeFieldFromSchema,
  removeDraftFromStorage,
} from "./utils";

// Type imports
import type { FormField, FormSchema, FormBlock } from "@/lib/database";
import type { FormBuilderProps } from "./types";

// Constant imports
import { DRAFT_KEYS } from "./constants";

export const FormBuilder: React.FC<FormBuilderProps> = ({ formId }) => {
  const router = useRouter();
  const {
    state,
    actions,
    selectedField,
    user,
    authLoading,
    debouncedAutoSave,
  } = useFormBuilder(formId);

  // Form actions
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
      state.formSchema,
      newField,
      state.selectedBlockId,
    );
    actions.setFormSchema(updatedSchema);
    actions.setSelectedFieldId(newField.id);
  };

  const updateField = (updatedField: FormField) => {
    const updatedSchema = updateFieldInSchema(state.formSchema, updatedField);
    actions.setFormSchema(updatedSchema);
  };

  const deleteField = (fieldId: string) => {
    const updatedSchema = removeFieldFromSchema(state.formSchema, fieldId);
    actions.setFormSchema(updatedSchema);

    if (state.selectedFieldId === fieldId) {
      actions.setSelectedFieldId(null);
    }
  };

  const reorderFields = (fields: FormField[]) => {
    actions.setFormSchema((prev) => {
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
      title: `Step ${state.formSchema.blocks.length + 1}`,
      description: "",
      fields: [],
    };

    actions.setFormSchema((prev) => ({
      ...prev,
      blocks: [...prev.blocks, newBlock],
      settings: {
        ...prev.settings,
        multiStep: prev.blocks.length > 0,
      },
    }));

    actions.setSelectedBlockId(newBlock.id);
  };

  const updateBlocks = (blocks: FormBlock[]) => {
    actions.setFormSchema((prev) => ({
      ...prev,
      blocks,
      fields: blocks.flatMap((block) => block.fields),
    }));
  };

  const updateBlock = (blockId: string, updates: Partial<FormBlock>) => {
    actions.setFormSchema((prev) => {
      const updatedBlocks = prev.blocks.map((block) =>
        block.id === blockId ? { ...block, ...updates } : block,
      );

      return {
        ...prev,
        blocks: updatedBlocks,
        fields: updatedBlocks.flatMap((block) => block.fields),
      };
    });
  };

  const deleteBlock = (blockId: string) => {
    actions.setFormSchema((prev) => {
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

    if (state.selectedBlockId === blockId) {
      actions.setSelectedBlockId(null);
    }
  };

  const handleFormTypeSelect = (schema: FormSchema) => {
    actions.setFormSchema(schema);
    actions.setIsNewForm(false);
    if (schema.blocks.length > 0) {
      actions.setSelectedBlockId(schema.blocks[0].id);
    }
  };

  const updateFormSettings = (settings: Partial<FormSchema["settings"]>) => {
    actions.setFormSchema((prev) => {
      const newSchema = {
        ...prev,
        settings: { ...prev.settings, ...settings },
      };

      debouncedAutoSave(newSchema);
      return newSchema;
    });
  };

  const saveForm = async () => {
    if (!user) {
      toast.error("Please log in to save your form.");
      return;
    }

    actions.setSaving(true);
    try {
      if (formId) {
        await formsDb.updateForm(formId, { schema: state.formSchema });
        toast.success("Form saved successfully!");
      } else {
        const newForm = await formsDb.createForm(
          user.id,
          state.formSchema.settings.title,
          state.formSchema,
        );
        router.push(`/form-builder/${newForm.id}`);
        toast.success("Form created successfully!");
      }
      removeDraftFromStorage(DRAFT_KEYS.getDraftKey(formId));
    } catch (error) {
      console.error("Error saving form:", error);
      toast.error("Failed to save form. Please try again.");
    } finally {
      actions.setSaving(false);
    }
  };



  const shareForm = () => {
    if (!formId) {
      toast.error("Please save your form before sharing.");
      return;
    }
    actions.setShowShareModal(true);
  };

  const handlePublishForm = async () => {
    if (!formId) return;

    try {
      await formsDb.togglePublishForm(formId, true);
      actions.setIsPublished(true);
      toast.success("Form published successfully!");
    } catch (error) {
      console.error("Error publishing form:", error);
      toast.error("Failed to publish form. Please try again.");
      throw error;
    }
  };

  const viewAnalytics = () => {
    if (!formId) {
      toast.error("Please save your form before viewing analytics.");
      return;
    }
    toast.success("Redirecting to analytics page...");
    router.push(`/dashboard/forms/${formId}/analytics`);
  };

  const togglePublish = async () => {
    if (!formId) {
      toast.error("Please save your form before publishing.");
      return;
    }

    actions.setPublishing(true);
    try {
      const newPublishState = !state.isPublished;
      await formsDb.togglePublishForm(formId, newPublishState);
      actions.setIsPublished(newPublishState);

      if (newPublishState) {
        toast.success("Form published successfully!");
      } else {
        toast.success("Form unpublished successfully!");
      }
    } catch (error) {
      console.error("Error toggling publish state:", error);
      toast.error("Failed to update form status. Please try again.");
    } finally {
      actions.setPublishing(false);
    }
  };

  const handleStepSelection = (stepIndex: number) => {
    if (state.formSchema.blocks && state.formSchema.blocks[stepIndex]) {
      actions.setSelectedBlockId(state.formSchema.blocks[stepIndex].id);
    }
  };

  const handleModeToggle = () => {
    const newMultiStep = !state.formSchema.settings.multiStep;

    if (newMultiStep) {
      if (
        state.formSchema.blocks.length === 0 ||
        (state.formSchema.blocks.length === 1 &&
          state.formSchema.blocks[0].id === "default")
      ) {
        const defaultBlock = state.formSchema.blocks.find(
          (b) => b.id === "default",
        );
        const currentFields =
          defaultBlock?.fields || state.formSchema.fields || [];

        const newSchema = {
          ...state.formSchema,
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
            ...state.formSchema.settings,
            multiStep: true,
            showProgress: true,
          },
        };
        actions.setFormSchema(newSchema);
        actions.setSelectedBlockId("step-1");
      } else {
        updateFormSettings({
          multiStep: true,
          showProgress: true,
        });
      }
    } else {
      const allFields = state.formSchema.blocks.flatMap(
        (block) => block.fields || [],
      );

      const newSchema = {
        ...state.formSchema,
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
          ...state.formSchema.settings,
          multiStep: false,
          showProgress: false,
        },
      };
      actions.setFormSchema(newSchema);
      actions.setSelectedBlockId("default");
    }
  };

  // Loading states
  if (authLoading || state.loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center flex flex-col gap-3">
          <Loader />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-muted-foreground mb-6">
            Please log in to use the form builder.
          </p>
          <Button onClick={() => router.push("/")}>Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <FormBuilderHeader
        formSchema={state.formSchema}
        autoSaving={state.autoSaving}
        saving={state.saving}
        publishing={state.publishing}
        isPublished={state.isPublished}
        formId={formId}
        onModeToggle={handleModeToggle}
        onJsonView={() => actions.setShowJsonView(true)}
        onAnalytics={viewAnalytics}
        onShare={shareForm}
        onSettings={() => actions.setShowFormSettings(true)}
        onPublish={togglePublish}
        onSave={saveForm}
      />

      <div className="flex-1 overflow-hidden">
        <FormBuilderPanels
          formSchema={state.formSchema}
          selectedFieldId={state.selectedFieldId}
          selectedBlockId={state.selectedBlockId}
          selectedField={selectedField}
          onFieldAdd={addField}
          onFieldSelect={actions.setSelectedFieldId}
          onFieldUpdate={updateField}
          onFieldDelete={deleteField}
          onFieldsReorder={reorderFields}
          onBlockSelect={actions.setSelectedBlockId}
          onBlocksUpdate={updateBlocks}
          onBlockAdd={addBlock}
          onBlockUpdate={updateBlock}
          onBlockDelete={deleteBlock}
          onFormSettingsUpdate={updateFormSettings}
          onStepSelect={handleStepSelection}
        />
      </div>

      <UnsavedChangesIndicator
        hasUnsavedChanges={state.hasUnsavedChanges}
        autoSaving={state.autoSaving}
      />

      <FormBuilderModals
        showSettings={state.showSettings}
        showFormSettings={state.showFormSettings}
        showJsonView={state.showJsonView}
        showCreationWizard={state.showCreationWizard}
        showShareModal={state.showShareModal}
        formSchema={state.formSchema}
        formId={formId}
        isPublished={state.isPublished}
        onCloseSettings={() => actions.setShowSettings(false)}
        onCloseFormSettings={() => actions.setShowFormSettings(false)}
        onCloseJsonView={() => actions.setShowJsonView(false)}
        onCloseCreationWizard={() => actions.setShowCreationWizard(false)}
        onCloseShareModal={() => actions.setShowShareModal(false)}
        onFormTypeSelect={handleFormTypeSelect}
        onFormSettingsUpdate={updateFormSettings}
        onSchemaUpdate={(updates) => {
          actions.setFormSchema((prev) => ({ ...prev, ...updates }));
          actions.setHasUnsavedChanges(true);
        }}
        onPublish={handlePublishForm}
      />
    </div>
  );
};
