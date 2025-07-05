// Main forms management component
"use client";

import React from "react";

// UI Components
import { ConfirmationModal } from "../form-delete-confirmation-modal";

// Local Components
import {
  LoadingSkeleton,
  FormsHeader,
  FormStats,
  AIFormSuggestions,
  EmptyState,
  FormsGrid,
} from "./components";

// Hooks
import { useFormsManagement } from "./hooks";

// Types
import type { FormsManagementProps } from "./types";

export function FormsManagement({ className }: FormsManagementProps) {
  const {
    // State
    forms,
    loading,
    deleteModal,

    // Actions
    createNewForm,
    editForm,
    previewForm,
    viewAnalytics,
    shareForm,
    deleteForm,
    confirmDeleteForm,
    handleCreateWithAI,
    handleCreateManually,
    handleCreateFromPrompt,

    // Setters
    setDeleteModal,
  } = useFormsManagement();

  if (loading) {
    return <LoadingSkeleton className={className} />;
  }

  return (
    <div className={`space-y-8 ${className || ""}`}>
      {/* Header Section */}
      <FormsHeader
        onCreateForm={createNewForm}
        onCreateWithAI={handleCreateWithAI}
        onCreateManually={handleCreateManually}
      />

      {/* Quick Stats */}
      <FormStats forms={forms} />

      {/* AI Form Suggestions */}
      <AIFormSuggestions onCreateForm={handleCreateFromPrompt} />

      {/* Forms Grid or Empty State */}
      {forms.length === 0 ? (
        <EmptyState
          onCreateForm={createNewForm}
          onCreateWithAI={handleCreateWithAI}
          onCreateManually={handleCreateManually}
        />
      ) : (
        <FormsGrid
          forms={forms}
          onEdit={editForm}
          onPreview={previewForm}
          onViewAnalytics={viewAnalytics}
          onShare={shareForm}
          onDelete={deleteForm}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal((prev) => ({ ...prev, open }))}
        title="Delete Form"
        description={`Are you sure you want to delete "${deleteModal.formTitle}"? This action cannot be undone and all form data will be permanently lost.`}
        confirmText="Delete Form"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={confirmDeleteForm}
      />
    </div>
  );
}
