import React from "react";

import type { Form } from "@/lib/database";

import { FormCard } from "./FormCard";

interface FormsGridProps {
  forms: Form[];
  onEdit: (formId: string) => void;
  onDuplicate: (formId: string) => void;
  onViewForm: (form: Form) => void;
  onViewAnalytics: (formId: string) => void;
  onShare: (form: Form) => void;
  onDelete: (formId: string, formTitle: string) => void;
}

export function FormsGrid({
  forms,
  onEdit,
  onDuplicate,
  onViewForm,
  onViewAnalytics,
  onShare,
  onDelete,
}: FormsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {forms.map((form) => (
        <FormCard
          form={form}
          key={form.id}
          onDelete={onDelete}
          onEdit={onEdit}
          onDuplicate={onDuplicate}
          onShare={onShare}
          onViewAnalytics={onViewAnalytics}
          onViewForm={onViewForm}
        />
      ))}
    </div>
  );
}
