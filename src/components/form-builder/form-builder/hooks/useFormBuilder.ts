import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";

import type { FormSchema } from "@/lib/database";

import { formsDb } from "@/lib/database";
import {
  createDefaultFormSchema,
  ensureDefaultRateLimitSettings,
} from "@/lib/forms";

import { DRAFT_KEYS, FORM_BUILDER_CONSTANTS } from "../constants";
import type { FormBuilderActions, FormBuilderState } from "../types";
import {
  addFieldToSchema,
  findSelectedField,
  generateBlockId,
  generateFieldId,
  hasFormChanges,
  loadDraftFromStorage,
  removeDraftFromStorage,
  removeFieldFromSchema,
  saveDraftToStorage,
  updateFieldInSchema,
} from "../utils";

export const useFormBuilder = (formId?: string) => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [state, setState] = useState<FormBuilderState>({
    loading: false,
    saving: false,
    autoSaving: false,
    publishing: false,
    isPublished: false,
    hasUnsavedChanges: false,
    selectedFieldId: null,
    selectedBlockId: null,
    showSettings: false,
    showFormSettings: false,
    showJsonView: false,
    showCreationWizard: false,
    showShareModal: false,
    isNewForm: !formId,
    formSlug: null,
    formSchema: createDefaultFormSchema({
      title: FORM_BUILDER_CONSTANTS.DEFAULT_FORM_TITLE,
      description: FORM_BUILDER_CONSTANTS.DEFAULT_FORM_DESCRIPTION,
      multiStep: false,
    }),
  });

  const draftKey = DRAFT_KEYS.getDraftKey(formId);
  const isRestored = useRef(false);
  const isFormLoaded = useRef(false);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedSchemaRef = useRef<FormSchema | null>(null);
  const lastManuallySavedSchemaRef = useRef<FormSchema | null>(null);
  const importedFromAI = useRef(false);

  const actions: FormBuilderActions = {
    setLoading: (loading) => setState((prev) => ({ ...prev, loading })),
    setSaving: (saving) => setState((prev) => ({ ...prev, saving })),
    setAutoSaving: (autoSaving) =>
      setState((prev) => ({ ...prev, autoSaving })),
    setPublishing: (publishing) =>
      setState((prev) => ({ ...prev, publishing })),
    setIsPublished: (isPublished) =>
      setState((prev) => ({ ...prev, isPublished })),
    setHasUnsavedChanges: (hasUnsavedChanges) =>
      setState((prev) => ({ ...prev, hasUnsavedChanges })),
    setSelectedFieldId: (selectedFieldId) =>
      setState((prev) => ({ ...prev, selectedFieldId })),
    setSelectedBlockId: (selectedBlockId) =>
      setState((prev) => ({ ...prev, selectedBlockId })),
    setShowSettings: (showSettings) =>
      setState((prev) => ({ ...prev, showSettings })),
    setShowFormSettings: (showFormSettings) =>
      setState((prev) => ({ ...prev, showFormSettings })),
    setShowJsonView: (showJsonView) =>
      setState((prev) => ({ ...prev, showJsonView })),
    setShowCreationWizard: (showCreationWizard) =>
      setState((prev) => ({ ...prev, showCreationWizard })),
    setShowShareModal: (showShareModal) =>
      setState((prev) => ({ ...prev, showShareModal })),
    setIsNewForm: (isNewForm) => setState((prev) => ({ ...prev, isNewForm })),
    setFormSlug: (formSlug) => setState((prev) => ({ ...prev, formSlug })),
    setFormSchema: (schema) =>
      setState((prev) => ({
        ...prev,
        formSchema:
          typeof schema === "function" ? schema(prev.formSchema) : schema,
      })),
  };

  useEffect(() => {
    if (isRestored.current) return;
    isRestored.current = true;

    const draft = loadDraftFromStorage(draftKey);
    if (draft) {
      actions.setFormSchema(draft);
    }
  }, [draftKey]);

  useEffect(() => {
    saveDraftToStorage(draftKey, state.formSchema);
  }, [state.formSchema, draftKey]);

  useEffect(() => {
    if (formId && user && !isFormLoaded.current) {
      loadForm();
    }
  }, [formId, user]);

  useEffect(() => {
    isFormLoaded.current = false;
  }, [formId]);

  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (state.isNewForm && !authLoading && user && !importedFromAI.current) {
      actions.setShowCreationWizard(true);
    }
  }, [state.isNewForm, authLoading, user]);

  useEffect(() => {
    const hasChanges = hasFormChanges(
      state.formSchema,
      lastManuallySavedSchemaRef.current,
    );
    actions.setHasUnsavedChanges(hasChanges);
  }, [state.formSchema]);

  useEffect(() => {
    const imported = localStorage.getItem(DRAFT_KEYS.IMPORTED_FORM_SCHEMA);
    if (imported) {
      try {
        const schema = JSON.parse(imported);
        const normalizedSchema = {
          blocks: Array.isArray(schema.blocks) ? schema.blocks : [],
          fields: Array.isArray(schema.fields) ? schema.fields : [],
          settings:
            typeof schema.settings === "object" && schema.settings
              ? {
                  title:
                    schema.settings.title ||
                    FORM_BUILDER_CONSTANTS.DEFAULT_FORM_TITLE,
                  description:
                    schema.settings.description ||
                    FORM_BUILDER_CONSTANTS.DEFAULT_FORM_DESCRIPTION,
                  submitText:
                    schema.settings.submitText ||
                    FORM_BUILDER_CONSTANTS.DEFAULT_SUBMIT_TEXT,
                  successMessage:
                    schema.settings.successMessage ||
                    FORM_BUILDER_CONSTANTS.DEFAULT_SUCCESS_MESSAGE,
                  redirectUrl:
                    schema.settings.redirectUrl ||
                    FORM_BUILDER_CONSTANTS.DEFAULT_REDIRECT_URL,
                  multiStep: !!schema.settings.multiStep,
                  showProgress:
                    "showProgress" in schema.settings
                      ? !!schema.settings.showProgress
                      : true,
                  ...schema.settings,
                }
              : {
                  title: FORM_BUILDER_CONSTANTS.DEFAULT_FORM_TITLE,
                  description: FORM_BUILDER_CONSTANTS.DEFAULT_FORM_DESCRIPTION,
                  submitText: FORM_BUILDER_CONSTANTS.DEFAULT_SUBMIT_TEXT,
                  successMessage:
                    FORM_BUILDER_CONSTANTS.DEFAULT_SUCCESS_MESSAGE,
                  redirectUrl: FORM_BUILDER_CONSTANTS.DEFAULT_REDIRECT_URL,
                  multiStep: false,
                  showProgress: true,
                },
        };

        actions.setFormSchema(ensureDefaultRateLimitSettings(normalizedSchema));
        actions.setHasUnsavedChanges(true);
        importedFromAI.current = true;
      } catch {}
      localStorage.removeItem(DRAFT_KEYS.IMPORTED_FORM_SCHEMA);
    }
  }, []);

  const loadForm = async () => {
    if (!(formId && user) || isFormLoaded.current) return;

    actions.setLoading(true);
    try {
      const form = await formsDb.getForm(formId);
      if (form.user_id !== user.id) {
        toast.error("You do not have permission to edit this form.");
        router.push("/dashboard");
        return;
      }

      actions.setFormSchema(form.schema);
      actions.setIsPublished(form.is_published);
      actions.setFormSlug(form.slug || null);
      lastSavedSchemaRef.current = {
        ...form.schema,
        fields: [...form.schema.fields],
      };
      lastManuallySavedSchemaRef.current = {
        ...form.schema,
        fields: [...form.schema.fields],
      };
      isFormLoaded.current = true;

      removeDraftFromStorage(draftKey);
    } catch (error) {
      console.error("Error loading form:", error);
      toast.error("Failed to load form. Please try again.");
    } finally {
      actions.setLoading(false);
    }
  };

  const debouncedAutoSave = async (schema: FormSchema) => {
    if (!(formId && user) || state.saving || state.autoSaving) return;

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(async () => {
      actions.setAutoSaving(true);
      try {
        await formsDb.updateForm(formId, { schema });
        lastSavedSchemaRef.current = schema;
      } catch (error) {
        console.error("Auto-save failed:", error);
      } finally {
        actions.setAutoSaving(false);
      }
    }, FORM_BUILDER_CONSTANTS.AUTOSAVE_DELAY);
  };

  const selectedField = findSelectedField(
    state.formSchema,
    state.selectedFieldId,
  );

  return {
    state,
    actions,
    selectedField,
    user,
    authLoading,
    debouncedAutoSave,
    loadForm,
  };
};
