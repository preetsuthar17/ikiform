"use client";

import { Separator } from "@/components/ui/separator";

import { ConfirmationModal } from "../form-delete-confirmation-modal";

import {
  EmptyState,
  FormStats,
  FormsGrid,
  FormsHeader,
  LoadingSkeleton,
} from "./components";

import { useFormsManagement } from "./hooks";

import type { FormsManagementProps } from "./types";

export function FormsManagement({ className }: FormsManagementProps) {
  const {
    forms,
    loading,
    deleteModal,
    createNewForm,
    editForm,
    duplicateForm,
    viewForm,
    viewAnalytics,
    shareForm,
    deleteForm,
    confirmDeleteForm,
    handleCreateWithAI,
    handleCreateManually,
    handleCreateFromPrompt,
    setDeleteModal,
  } = useFormsManagement();

  if (loading) {
    return <LoadingSkeleton className={className} />;
  }

  return (
    <div className={`flex flex-col gap-8 ${className || ""}`}>
      {}
      <FormsHeader
        onCreateForm={createNewForm}
        onCreateManually={handleCreateManually}
        onCreateWithAI={handleCreateWithAI}
      />

      <Separator />
      <FormStats forms={forms} />

      <Separator />

      {forms.length === 0 ? (
        <EmptyState
          onCreateForm={createNewForm}
          onCreateManually={handleCreateManually}
          onCreateWithAI={handleCreateWithAI}
        />
      ) : (
        <FormsGrid
          forms={forms}
          onDelete={deleteForm}
          onDuplicate={duplicateForm}
          onEdit={editForm}
          onShare={shareForm}
          onViewAnalytics={viewAnalytics}
          onViewForm={viewForm}
        />
      )}

      <ConfirmationModal
        cancelText="Cancel"
        confirmText="Delete Form"
        description={`Are you sure you want to delete "${deleteModal.formTitle}"? This action cannot be undone and all form data will be permanently lost.`}
        onConfirm={confirmDeleteForm}
        onOpenChange={(open) => setDeleteModal((prev) => ({ ...prev, open }))}
        open={deleteModal.open}
        title="Delete Form"
        variant="destructive"
      />
    </div>
  );
}
