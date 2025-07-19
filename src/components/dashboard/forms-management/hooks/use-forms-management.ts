// Custom hooks for forms management
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// External Dependencies
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";

// Database
import { formsDb } from "@/lib/database";

// Types
import type { Form } from "@/lib/database";
import type { DeleteModalState } from "../types";

// Utils
import { generateShareUrl, copyToClipboard } from "../utils";

// Constants
import { DEFAULT_DELETE_MODAL_STATE } from "../constants";

export function useFormsManagement() {
  const router = useRouter();
  const { user } = useAuth();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<DeleteModalState>(
    DEFAULT_DELETE_MODAL_STATE,
  );
  const [showChoiceModal, setShowChoiceModal] = useState(false);

  // Load forms from database
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

  // Form actions
  const createNewForm = () => {
    setShowChoiceModal(true);
  };

  const editForm = (formId: string) => {
    router.push(`/form-builder/${formId}`);
  };

  const viewForm = (formId: string) => {
    window.open(`/forms/${formId}`, "_blank");
  };

  const viewAnalytics = (formId: string) => {
    router.push(`/dashboard/forms/${formId}/analytics`);
  };

  const shareForm = async (form: Form) => {
    try {
      if (!form.is_published) {
        await formsDb.togglePublishForm(form.id, true);
        await loadForms(); // Refresh the forms list
      }

      const shareUrl = generateShareUrl(form.id);
      await copyToClipboard(shareUrl);
    } catch (error) {
      console.error("Error sharing form:", error);
      toast.error("Failed to share form");
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
      await loadForms(); // Refresh the forms list
      toast.success("Form deleted successfully");
    } catch (error) {
      console.error("Error deleting form:", error);
      toast.error("Failed to delete form");
    }
  };

  const handleCreateWithAI = () => {
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

  // Load forms on mount
  useEffect(() => {
    if (user) {
      loadForms();
    }
  }, [user]);

  return {
    // State
    forms,
    loading,
    deleteModal,
    showChoiceModal,

    // Actions
    createNewForm,
    editForm,
    viewForm,
    viewAnalytics,
    shareForm,
    deleteForm,
    confirmDeleteForm,
    handleCreateWithAI,
    handleCreateManually,
    handleCreateFromPrompt,

    // Setters
    setDeleteModal,
    setShowChoiceModal,
  };
}
