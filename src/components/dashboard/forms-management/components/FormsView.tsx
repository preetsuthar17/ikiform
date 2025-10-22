import type { Form } from "@/lib/database";
import { FormsList } from "./FormsList";

interface FormsViewProps {
  forms: Form[];
  onEdit: (formId: string) => void;
  onDuplicate: (formId: string) => void;
  onViewForm: (form: Form) => void;
  onViewAnalytics: (formId: string) => void;
  onShare: (form: Form) => void;
  onDelete: (formId: string, formTitle: string) => void;
}

export function FormsView({
  forms,
  onEdit,
  onDuplicate,
  onViewForm,
  onViewAnalytics,
  onShare,
  onDelete,
}: FormsViewProps) {
  return (
    <FormsList
      forms={forms}
      onDelete={onDelete}
      onDuplicate={onDuplicate}
      onEdit={onEdit}
      onShare={onShare}
      onViewAnalytics={onViewAnalytics}
      onViewForm={onViewForm}
    />
  );
}
