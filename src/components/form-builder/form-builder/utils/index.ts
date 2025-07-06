// Type imports
import type { FormField, FormSchema } from "@/lib/database";

// Constant imports
import { FORM_BUILDER_CONSTANTS } from "../constants";

// Utility functions
export const generateFieldId = (): string => {
  return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const generateBlockId = (): string => {
  return `step-${Date.now()}`;
};

export const hasFormChanges = (
  formSchema: FormSchema,
  lastSavedSchema: FormSchema | null
): boolean => {
  if (!lastSavedSchema) {
    return (
      formSchema.fields.length > 0 ||
      (formSchema.blocks.length > 0 &&
        formSchema.blocks[0].fields.length > 0) ||
      formSchema.settings.title !== FORM_BUILDER_CONSTANTS.DEFAULT_FORM_TITLE ||
      formSchema.settings.description !==
        FORM_BUILDER_CONSTANTS.DEFAULT_FORM_DESCRIPTION ||
      formSchema.settings.submitText !==
        FORM_BUILDER_CONSTANTS.DEFAULT_SUBMIT_TEXT ||
      formSchema.settings.successMessage !==
        FORM_BUILDER_CONSTANTS.DEFAULT_SUCCESS_MESSAGE ||
      formSchema.settings.redirectUrl !==
        FORM_BUILDER_CONSTANTS.DEFAULT_REDIRECT_URL
    );
  }

  const currentSchemaStr = JSON.stringify(formSchema);
  const savedSchemaStr = JSON.stringify(lastSavedSchema);
  return currentSchemaStr !== savedSchemaStr;
};

// Debounced localStorage to prevent excessive writes
let saveTimeoutId: NodeJS.Timeout | null = null;

export const saveDraftToStorage = (
  draftKey: string,
  formSchema: FormSchema
): void => {
  if (typeof window !== "undefined") {
    // Clear previous timeout
    if (saveTimeoutId) {
      clearTimeout(saveTimeoutId);
    }

    // Debounce localStorage writes to prevent blocking
    saveTimeoutId = setTimeout(() => {
      try {
        localStorage.setItem(draftKey, JSON.stringify(formSchema));
      } catch (error) {
        console.warn("Failed to save draft to localStorage:", error);
      }
      saveTimeoutId = null;
    }, 100); // 100ms debounce
  }
};

export const loadDraftFromStorage = (draftKey: string): FormSchema | null => {
  if (typeof window === "undefined") return null;

  const draft = localStorage.getItem(draftKey);
  if (!draft) return null;

  try {
    const parsed = JSON.parse(draft);
    if (
      parsed &&
      typeof parsed === "object" &&
      parsed.fields &&
      parsed.settings
    ) {
      return parsed;
    }
  } catch {
    // Ignore parse errors
  }

  return null;
};

export const removeDraftFromStorage = (draftKey: string): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(draftKey);
  }
};

export const findSelectedField = (
  formSchema: FormSchema,
  selectedFieldId: string | null
): FormField | null => {
  if (!selectedFieldId) return null;

  const allFields = formSchema.blocks?.length
    ? formSchema.blocks.flatMap((block) => block.fields)
    : formSchema.fields || [];

  return allFields.find((field) => field.id === selectedFieldId) || null;
};

export const getAllFields = (formSchema: FormSchema): FormField[] => {
  return formSchema.blocks?.length
    ? formSchema.blocks.flatMap((block) => block.fields)
    : formSchema.fields || [];
};

export const updateFieldInSchema = (
  formSchema: FormSchema,
  updatedField: FormField
): FormSchema => {
  const updatedBlocks = formSchema.blocks.map((block) => ({
    ...block,
    fields: block.fields.map((field) =>
      field.id === updatedField.id ? updatedField : field
    ),
  }));

  return {
    ...formSchema,
    blocks: updatedBlocks,
    fields: formSchema.fields.map((field) =>
      field.id === updatedField.id ? updatedField : field
    ),
  };
};

export const removeFieldFromSchema = (
  formSchema: FormSchema,
  fieldId: string
): FormSchema => {
  const updatedBlocks = formSchema.blocks.map((block) => ({
    ...block,
    fields: block.fields.filter((field) => field.id !== fieldId),
  }));

  return {
    ...formSchema,
    blocks: updatedBlocks,
    fields: formSchema.fields.filter((field) => field.id !== fieldId),
  };
};

export const addFieldToSchema = (
  formSchema: FormSchema,
  newField: FormField,
  selectedBlockId: string | null
): FormSchema => {
  const targetBlockId = selectedBlockId || formSchema.blocks[0]?.id;
  const updatedBlocks = formSchema.blocks.map((block) =>
    block.id === targetBlockId
      ? { ...block, fields: [...block.fields, newField] }
      : block
  );

  return {
    ...formSchema,
    blocks: updatedBlocks,
    fields: [...formSchema.fields, newField],
  };
};
