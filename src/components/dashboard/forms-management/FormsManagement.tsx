// Main forms management component
'use client';

import React from 'react';
import { Separator } from '@/components/ui/separator';
// UI Components
import { ConfirmationModal } from '../form-delete-confirmation-modal';
// Local Components
import {
  AIFormSuggestions,
  EmptyState,
  FormStats,
  FormsGrid,
  FormsHeader,
  LoadingSkeleton,
} from './components';
// Hooks
import { useFormsManagement } from './hooks';
// Types
import type { FormsManagementProps } from './types';

export function FormsManagement({ className }: FormsManagementProps) {
  const {
    // State
    forms,
    loading,
    deleteModal,

    // Actions
    createNewForm,
    editForm,
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
    <div className={`flex flex-col gap-8 ${className || ''}`}>
      {/* Header Section */}
      <FormsHeader
        onCreateForm={createNewForm}
        onCreateManually={handleCreateManually}
        onCreateWithAI={handleCreateWithAI}
      />

      <Separator />

      {/* Quick Stats */}
      <FormStats forms={forms} />

      <Separator />

      {/* Forms Grid or Empty State */}
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
          onEdit={editForm}
          onShare={shareForm}
          onViewAnalytics={viewAnalytics}
        />
      )}

      <Separator />
      {/* AI Form Suggestions */}
      <AIFormSuggestions onCreateForm={handleCreateFromPrompt} />

      <Separator />
      {/* Delete Confirmation Modal */}
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
