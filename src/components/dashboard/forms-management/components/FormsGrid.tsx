// Forms grid component
import React from "react";

// Local Components
import { FormCard } from "./FormCard";

// Types
import type { Form } from "@/lib/database";

interface FormsGridProps {
  forms: Form[];
  onEdit: (formId: string) => void;
  onViewAnalytics: (formId: string) => void;
  onShare: (form: Form) => void;
  onDelete: (formId: string, formTitle: string) => void;
}

export function FormsGrid({
  forms,
  onEdit,
  onViewAnalytics,
  onShare,
  onDelete,
}: FormsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {forms.map((form) => (
        <FormCard
          key={form.id}
          form={form}
          onEdit={onEdit}
          onViewAnalytics={onViewAnalytics}
          onShare={onShare}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
