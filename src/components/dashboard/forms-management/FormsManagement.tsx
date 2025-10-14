"use client";

import { useMemo, useState } from "react";
import { ConfirmationModal } from "../form-delete-confirmation-modal";

import {
  EmptyState,
  FormsHeader,
  FormsSearch,
  FormsView,
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

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("updated");

  // Filter and sort forms
  const filteredForms = useMemo(() => {
    let filtered = forms;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((form) => {
        const title = (
          form.schema?.settings?.title ||
          form.title ||
          ""
        ).toLowerCase();
        const description = (form.description || "").toLowerCase();
        const id = form.id.toLowerCase();
        return (
          title.includes(query) ||
          description.includes(query) ||
          id.includes(query)
        );
      });
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((form) => {
        if (statusFilter === "published") return form.is_published;
        if (statusFilter === "draft") return !form.is_published;
        return true;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title": {
          const aTitle = (
            a.schema?.settings?.title ||
            a.title ||
            ""
          ).toLowerCase();
          const bTitle = (
            b.schema?.settings?.title ||
            b.title ||
            ""
          ).toLowerCase();
          return aTitle.localeCompare(bTitle);
        }
        case "created": {
          const aCreated = new Date(a.created_at).getTime();
          const bCreated = new Date(b.created_at).getTime();
          // Handle invalid dates
          if (isNaN(aCreated) && isNaN(bCreated)) return 0;
          if (isNaN(aCreated)) return 1;
          if (isNaN(bCreated)) return -1;
          return bCreated - aCreated; // Newest first
        }
        case "updated":
        default: {
          const aUpdated = new Date(a.updated_at).getTime();
          const bUpdated = new Date(b.updated_at).getTime();
          // Handle invalid dates
          if (isNaN(aUpdated) && isNaN(bUpdated)) return 0;
          if (isNaN(aUpdated)) return 1;
          if (isNaN(bUpdated)) return -1;
          return bUpdated - aUpdated; // Newest first
        }
      }
    });

    return filtered;
  }, [forms, searchQuery, statusFilter, sortBy]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSortBy("updated");
  };

  if (loading) {
    return <LoadingSkeleton className={className} />;
  }

  return (
    <div className={`flex flex-col gap-8 ${className || ""}`}>
      <FormsHeader
        onCreateForm={createNewForm}
        onCreateManually={handleCreateManually}
        onCreateWithAI={handleCreateWithAI}
      />

      {forms.length === 0 ? (
        <EmptyState
          onCreateForm={createNewForm}
          onCreateManually={handleCreateManually}
          onCreateWithAI={handleCreateWithAI}
        />
      ) : (
        <>
          <FormsSearch
            onClearFilters={handleClearFilters}
            onSearchChange={setSearchQuery}
            onSortByChange={setSortBy}
            onStatusFilterChange={setStatusFilter}
            searchQuery={searchQuery}
            sortBy={sortBy}
            statusFilter={statusFilter}
          />

          {filteredForms.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">
                No forms match your search criteria.
              </p>
              <button
                className="mt-2 text-primary hover:underline"
                onClick={handleClearFilters}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <FormsView
              forms={filteredForms}
              onDelete={deleteForm}
              onDuplicate={duplicateForm}
              onEdit={editForm}
              onShare={shareForm}
              onViewAnalytics={viewAnalytics}
              onViewForm={viewForm}
            />
          )}
        </>
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
