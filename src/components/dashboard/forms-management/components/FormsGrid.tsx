// Forms grid component
import React from 'react';
// Types
import type { Form } from '@/lib/database';
// Local Components
import { FormCard } from './FormCard';

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
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {forms.map((form) => (
        <FormCard
          form={form}
          key={form.id}
          onDelete={onDelete}
          onEdit={onEdit}
          onShare={onShare}
          onViewAnalytics={onViewAnalytics}
        />
      ))}
    </div>
  );
}
