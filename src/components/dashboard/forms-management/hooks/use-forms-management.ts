import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";

import type { Form } from "@/lib/database";

import { formsDb } from "@/lib/database";

import { DEFAULT_DELETE_MODAL_STATE } from "../constants";
import type { DeleteModalState } from "../types";

import { copyToClipboard, generateShareUrl } from "../utils";

export function useFormsManagement() {
  const router = useRouter();
  const { user } = useAuth();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<DeleteModalState>(
    DEFAULT_DELETE_MODAL_STATE
  );
  const [showChoiceModal, setShowChoiceModal] = useState(false);

  const loadForms = async () => {
    if (!user) return;

    try {
      const userForms = await formsDb.getUserForms(user.id);
      setForms(userForms);
    } catch (error) {
      console.error("Error loading forms:", error);
      toast.error("Failed to load forms");
    } finally {
      setLoading(false);
    }
  };

  const createNewForm = () => {
    setShowChoiceModal(true);
  };

  const editForm = (formId: string) => {
    router.push(`/form-builder/${formId}`);
  };

  const viewForm = (form: Form) => {
    const identifier = form.slug || form.id;
    window.open(`/f/${identifier}`, "_blank");
  };

  const viewAnalytics = (formId: string) => {
    router.push(`/dashboard/forms/${formId}/analytics`);
  };

  const shareForm = async (form: Form) => {
    try {
      if (!form.is_published) {
        await formsDb.togglePublishForm(form.id, true);
        await loadForms();
      }

      const shareUrl = generateShareUrl(form);
      await copyToClipboard(shareUrl);
    } catch (error) {
      console.error("Error sharing form:", error);
      toast.error("Failed to share form");
    }
  };

  const duplicateForm = async (formId: string) => {
    try {
      const duplicated = await formsDb.duplicateForm(formId);
      toast.success("Form duplicated");
      router.push(`/form-builder/${duplicated.id}`);
    } catch (error) {
      console.error("Error duplicating form:", error);
      toast.error("Failed to duplicate form");
    }
  };

  const deleteForm = async (formId: string, formTitle: string) => {
    setDeleteModal({
      open: true,
      formId,
      formTitle,
    });
  };

  const confirmDeleteForm = async () => {
    try {
      await formsDb.deleteForm(deleteModal.formId);
      await loadForms();
      toast.success("Form deleted successfully");
    } catch (error) {
      console.error("Error deleting form:", error);
      toast.error("Failed to delete form");
    }
  };

  const handleCreateWithAi = () => {
    setShowChoiceModal(false);
    router.push("/ai-builder");
  };

  const handleCreateManually = () => {
    setShowChoiceModal(false);
    router.push("/form-builder");
  };

  const handleCreateFromPrompt = (prompt: string) => {
    const encodedPrompt = encodeURIComponent(prompt);
    router.push(`/ai-builder?prompt=${encodedPrompt}&sent=true`);
  };

  useEffect(() => {
    if (user) {
      loadForms();
    }
  }, [user]);

  return {
    forms,
    loading,
    deleteModal,
    showChoiceModal,
    createNewForm,
    editForm,
    viewForm,
    viewAnalytics,
    shareForm,
    duplicateForm,
    deleteForm,
    confirmDeleteForm,
    handleCreateWithAI: handleCreateWithAi,
    handleCreateManually,
    handleCreateFromPrompt,
    setDeleteModal,
    setShowChoiceModal,
  };
}
