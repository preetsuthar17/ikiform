import type { FormBlock, FormField, FormSchema } from "@/lib/database";

export interface FormBuilderProps {
  formId?: string;
}

export interface FormBuilderState {
  loading: boolean;
  saving: boolean;
  autoSaving: boolean;
  publishing: boolean;
  isPublished: boolean;
  hasUnsavedChanges: boolean;
  selectedFieldId: string | null;
  selectedBlockId: string | null;
  showSettings: boolean;
  showFormSettings: boolean;
  showJsonView: boolean;
  showCreationWizard: boolean;
  showShareModal: boolean;
  isNewForm: boolean;
  formSchema: FormSchema;
  formSlug: string | null;
}

export interface FormBuilderActions {
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  setAutoSaving: (autoSaving: boolean) => void;
  setPublishing: (publishing: boolean) => void;
  setIsPublished: (isPublished: boolean) => void;
  setHasUnsavedChanges: (hasUnsavedChanges: boolean) => void;
  setSelectedFieldId: (fieldId: string | null) => void;
  setSelectedBlockId: (blockId: string | null) => void;
  setShowSettings: (show: boolean) => void;
  setShowFormSettings: (show: boolean) => void;
  setShowJsonView: (show: boolean) => void;
  setShowCreationWizard: (show: boolean) => void;
  setShowShareModal: (show: boolean) => void;
  setIsNewForm: (isNew: boolean) => void;
  setFormSlug: (slug: string | null) => void;
  setFormSchema: (
    schema: FormSchema | ((prev: FormSchema) => FormSchema)
  ) => void;
}

export interface FormBuilderHeaderProps {
  formSchema: FormSchema;
  autoSaving: boolean;
  saving: boolean;
  publishing: boolean;
  isPublished: boolean;
  formId?: string;
  onModeToggle: () => void;
  onJsonView: () => void;
  onAnalytics: () => void;
  onShare: () => void;
  onSettings: () => void;
  onPublish: () => void;
  onSave: () => void;
  onBlockAdd?: () => void;
}

export interface UnsavedChangesIndicatorProps {
  hasUnsavedChanges: boolean;
  autoSaving: boolean;
}

export interface FormBuilderPanelsProps {
  formSchema: FormSchema;
  selectedFieldId: string | null;
  selectedBlockId: string | null;
  selectedField: FormField | null;
  onFieldAdd: (fieldType: FormField["type"]) => void;
  onFieldSelect: (fieldId: string | null) => void;
  onFieldUpdate: (field: FormField) => void;
  onFieldDelete: (fieldId: string) => void;
  onFieldsReorder: (fields: FormField[]) => void;
  onBlockSelect: (blockId: string | null) => void;
  onBlocksUpdate: (blocks: FormBlock[]) => void;
  onBlockAdd: () => void;
  onBlockUpdate: (blockId: string, updates: Partial<FormBlock>) => void;
  onBlockDelete: (blockId: string) => void;
  onFormSettingsUpdate: (settings: Partial<FormSchema["settings"]>) => void;
  onStepSelect: (stepIndex: number) => void;
}

export interface FormBuilderModalsProps {
  showSettings: boolean;
  showFormSettings: boolean;
  showJsonView: boolean;
  showCreationWizard: boolean;
  showShareModal: boolean;
  formSchema: FormSchema;
  formId?: string;
  formSlug?: string | null;
  isPublished: boolean;
  onCloseSettings: () => void;
  onCloseFormSettings: () => void;
  onCloseJsonView: () => void;
  onCloseCreationWizard: () => void;
  onCloseShareModal: () => void;
  onFormTypeSelect: (schema: FormSchema) => void;
  onFormSettingsUpdate: (settings: Partial<FormSchema["settings"]>) => void;
  onSchemaUpdate: (updates: Partial<FormSchema>) => void;
  onPublish: () => Promise<void>;
  userEmail?: string;
}
