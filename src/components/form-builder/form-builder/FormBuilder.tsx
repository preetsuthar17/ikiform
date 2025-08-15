'use client';

import { useRouter } from 'next/navigation';

import React, { useCallback, useState } from 'react';
import type { FormLogic } from '@/components/form-builder/logic-builder/types';

import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent } from '@/components/ui/drawer';

import { toast } from '@/hooks/use-toast';

import type { FormBlock, FormField, FormSchema } from '@/lib/database';

import { formsDb } from '@/lib/database';
import { Loader } from '../../ui/loader';
import { FieldPalette } from '../field-palette';
import { FieldSettingsPanel } from '../field-settings-panel';
import { FormBuilderSkeleton } from '../form-builder-skeleton';
import { FormPreview } from '../form-preview';
import { FormBuilderHeader } from './components/FormBuilderHeader';
import { FormBuilderModals } from './components/FormBuilderModals';
import { FormBuilderPanels } from './components/FormBuilderPanels';
import { UnsavedChangesIndicator } from './components/UnsavedChangesIndicator';

import { DRAFT_KEYS } from './constants';
import { useFormBuilder } from './hooks/useFormBuilder';
import type { FormBuilderProps } from './types';
import {
  addFieldToSchema,
  generateBlockId,
  generateFieldId,
  removeDraftFromStorage,
  removeFieldFromSchema,
  updateFieldInSchema,
} from './utils';

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

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

  const isMobile = useIsMobile();
  const [showFieldPalette, setShowFieldPalette] = useState(false);
  const [showFieldSettings, setShowFieldSettings] = useState(false);

  const handleFieldSelect = useCallback(
    (fieldId: string | null) => {
      actions.setSelectedFieldId(fieldId);
      if (isMobile && fieldId) setShowFieldSettings(true);
      if (isMobile && !fieldId) setShowFieldSettings(false);
    },
    [actions, isMobile]
  );

  const addField = (fieldType: FormField['type'], index?: number) => {
    const newField: FormField = {
      id: generateFieldId(),
      type: fieldType,
      label: `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
      placeholder: '',
      required: false,
      options: ['select', 'radio', 'checkbox'].includes(fieldType)
        ? ['Option 1', 'Option 2']
        : undefined,
      validation: {},
      settings:
        fieldType === 'slider'
          ? { min: 0, max: 100, step: 1, defaultValue: 50 }
          : fieldType === 'tags'
            ? { maxTags: 10, allowDuplicates: false }
            : fieldType === 'poll'
              ? { pollOptions: ['Option 1', 'Option 2'] }
              : {},
    };

    const updatedSchema = addFieldToSchema(
      state.formSchema,
      newField,
      state.selectedBlockId,
      index
    );
    actions.setFormSchema(updatedSchema);
    actions.setSelectedFieldId(newField.id);
  };

  const handleAddField = useCallback(
    (fieldType: FormField['type'], index?: number) => {
      addField(fieldType, index);
      setShowFieldPalette(false);
    },
    [addField]
  );

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
      title: `Step ${state.formSchema.blocks.length + 1}`,
      description: '',
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

  const updateFormSettings = (settings: Partial<FormSchema['settings']>) => {
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
      toast.error('Please log in to save your form.');
      return;
    }

    actions.setSaving(true);
    try {
      if (formId) {
        await formsDb.updateForm(formId, { schema: state.formSchema });
        toast.success('Form saved successfully!');
      } else {
        const newForm = await formsDb.createForm(
          user.id,
          state.formSchema.settings.title,
          state.formSchema
        );
        router.push(`/form-builder/${newForm.id}`);
        toast.success('Form created successfully!');
      }
      removeDraftFromStorage(DRAFT_KEYS.getDraftKey(formId));
    } catch (error) {
      console.error('Error saving form:', error);
      toast.error('Failed to save form. Please try again.');
    } finally {
      actions.setSaving(false);
    }
  };

  const shareForm = () => {
    if (!formId) {
      toast.error('Please save your form before sharing.');
      return;
    }
    actions.setShowShareModal(true);
  };

  const handlePublishForm = async () => {
    if (!formId) return;

    try {
      await formsDb.togglePublishForm(formId, true);
      actions.setIsPublished(true);
      toast.success('Form published successfully!');
    } catch (error) {
      console.error('Error publishing form:', error);
      toast.error('Failed to publish form. Please try again.');
      throw error;
    }
  };

  const viewAnalytics = () => {
    if (!formId) {
      toast.error('Please save your form before viewing analytics.');
      return;
    }
    toast.success('Loading Analytics');
    router.push(`/dashboard/forms/${formId}/analytics`);
  };

  const togglePublish = async () => {
    if (!formId) {
      toast.error('Please save your form before publishing.');
      return;
    }

    actions.setPublishing(true);
    try {
      const newPublishState = !state.isPublished;
      await formsDb.togglePublishForm(formId, newPublishState);
      actions.setIsPublished(newPublishState);

      if (newPublishState) {
        toast.success('Form published successfully!');
      } else {
        toast.success('Form unpublished successfully!');
      }
    } catch (error) {
      console.error('Error toggling publish state:', error);
      toast.error('Failed to update form status. Please try again.');
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
          state.formSchema.blocks[0].id === 'default')
      ) {
        const defaultBlock = state.formSchema.blocks.find(
          (b) => b.id === 'default'
        );
        const currentFields =
          defaultBlock?.fields || state.formSchema.fields || [];

        const newSchema = {
          ...state.formSchema,
          blocks: [
            {
              id: 'step-1',
              title: 'Step 1',
              description: 'First step of your form',
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
        actions.setSelectedBlockId('step-1');
      } else {
        updateFormSettings({
          multiStep: true,
          showProgress: true,
        });
      }
    } else {
      const allFields = state.formSchema.blocks.flatMap(
        (block) => block.fields || []
      );

      const newSchema = {
        ...state.formSchema,
        blocks: [
          {
            id: 'default',
            title: 'Form Fields',
            description: '',
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
      actions.setSelectedBlockId('default');
    }
  };

  const handleLogicChange = (logic: FormLogic) => {
    actions.setFormSchema((prev) => ({
      ...prev,
      logic,
    }));
  };

  if (authLoading || state.loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <FormBuilderSkeleton />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 font-bold text-2xl">Authentication Required</h2>
          <p className="mb-6 text-muted-foreground">
            Please log in to use the form builder.
          </p>
          <Button onClick={() => router.push('/')}>Go to Login</Button>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="flex h-screen flex-col overflow-hidden bg-background">
        <div className="sticky top-0 z-30 bg-card shadow-sm">
          <FormBuilderHeader
            autoSaving={state.autoSaving}
            formId={formId}
            formSchema={state.formSchema}
            isPublished={state.isPublished}
            onAnalytics={viewAnalytics}
            onJsonView={() => actions.setShowJsonView(true)}
            onModeToggle={handleModeToggle}
            onPublish={togglePublish}
            onSave={saveForm}
            onSettings={() => actions.setShowFormSettings(true)}
            onShare={shareForm}
            publishing={state.publishing}
            saving={state.saving}
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
              schema={state.formSchema}
              selectedBlockId={state.selectedBlockId}
              selectedFieldId={state.selectedFieldId}
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
              if (!open) actions.setSelectedFieldId(null);
            }}
            open={showFieldSettings}
          >
            <DrawerContent className="mx-auto w-full rounded-t-2xl p-0">
              <div className="max-h-[80vh]">
                <FieldSettingsPanel
                  field={selectedField}
                  onClose={() => {
                    setShowFieldSettings(false);
                    actions.setSelectedFieldId(null);
                  }}
                  onFieldUpdate={updateField}
                />
              </div>
            </DrawerContent>
          </Drawer>
        </div>
        <UnsavedChangesIndicator
          autoSaving={state.autoSaving}
          hasUnsavedChanges={state.hasUnsavedChanges}
        />
        <FormBuilderModals
          formId={formId}
          formSchema={state.formSchema}
          formSlug={state.formSlug}
          isPublished={state.isPublished}
          onCloseCreationWizard={() => actions.setShowCreationWizard(false)}
          onCloseFormSettings={() => actions.setShowFormSettings(false)}
          onCloseJsonView={() => actions.setShowJsonView(false)}
          onCloseSettings={() => actions.setShowSettings(false)}
          onCloseShareModal={() => actions.setShowShareModal(false)}
          onFormSettingsUpdate={updateFormSettings}
          onFormTypeSelect={handleFormTypeSelect}
          onPublish={handlePublishForm}
          onSchemaUpdate={(updates) => {
            actions.setFormSchema((prev) => ({
              ...prev,
              settings: { ...prev.settings, ...updates.settings },
            }));
            actions.setHasUnsavedChanges(true);
          }}
          showCreationWizard={state.showCreationWizard}
          showFormSettings={state.showFormSettings}
          showJsonView={state.showJsonView}
          showSettings={state.showSettings}
          showShareModal={state.showShareModal}
          userEmail={user?.email}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <FormBuilderHeader
        autoSaving={state.autoSaving}
        formId={formId}
        formSchema={state.formSchema}
        isPublished={state.isPublished}
        onAnalytics={viewAnalytics}
        onJsonView={() => actions.setShowJsonView(true)}
        onModeToggle={handleModeToggle}
        onPublish={togglePublish}
        onSave={saveForm}
        onSettings={() => actions.setShowFormSettings(true)}
        onShare={shareForm}
        publishing={state.publishing}
        saving={state.saving}
      />

      <div className="overflow-hidden">
        <FormBuilderPanels
          formSchema={state.formSchema}
          onBlockAdd={addBlock}
          onBlockDelete={deleteBlock}
          onBlockSelect={actions.setSelectedBlockId}
          onBlocksUpdate={updateBlocks}
          onBlockUpdate={updateBlock}
          onFieldAdd={addField}
          onFieldDelete={deleteField}
          onFieldSelect={actions.setSelectedFieldId}
          onFieldsReorder={reorderFields}
          onFieldUpdate={updateField}
          onFormSettingsUpdate={updateFormSettings}
          onLogicChange={handleLogicChange}
          onStepSelect={handleStepSelection}
          selectedBlockId={state.selectedBlockId}
          selectedField={selectedField}
          selectedFieldId={state.selectedFieldId}
        />
      </div>

      <UnsavedChangesIndicator
        autoSaving={state.autoSaving}
        hasUnsavedChanges={state.hasUnsavedChanges}
      />

      <FormBuilderModals
        formId={formId}
        formSchema={state.formSchema}
        formSlug={state.formSlug}
        isPublished={state.isPublished}
        onCloseCreationWizard={() => actions.setShowCreationWizard(false)}
        onCloseFormSettings={() => actions.setShowFormSettings(false)}
        onCloseJsonView={() => actions.setShowJsonView(false)}
        onCloseSettings={() => actions.setShowSettings(false)}
        onCloseShareModal={() => actions.setShowShareModal(false)}
        onFormSettingsUpdate={updateFormSettings}
        onFormTypeSelect={handleFormTypeSelect}
        onPublish={handlePublishForm}
        onSchemaUpdate={(updates) => {
          actions.setFormSchema((prev) => ({
            ...prev,
            settings: { ...prev.settings, ...updates.settings },
          }));
          actions.setHasUnsavedChanges(true);
        }}
        showCreationWizard={state.showCreationWizard}
        showFormSettings={state.showFormSettings}
        showJsonView={state.showJsonView}
        showSettings={state.showSettings}
        showShareModal={state.showShareModal}
        userEmail={user?.email}
      />
    </div>
  );
};
