// Libraries
import React from "react";

// UI Components
import { FormFieldRenderer } from "@/components/form-builder/form-field-renderer";

// Types
import type { FormBlock } from "@/lib/database";

interface FormContentProps {
  currentBlock: FormBlock;
  formData: Record<string, any>;
  errors: Record<string, string>;
  onFieldValueChange: (fieldId: string, value: any) => void;
  title?: string;
  description?: string;
}

export const FormContent: React.FC<FormContentProps> = ({
  currentBlock,
  formData,
  errors,
  onFieldValueChange,
  title,
  description,
}) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">
          {currentBlock.title || title}
        </h1>
        {(currentBlock.description || description) && (
          <p className="text-muted-foreground">
            {currentBlock.description || description}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {currentBlock.fields.map((field) => (
          <div key={field.id}>
            <FormFieldRenderer
              field={field}
              value={formData[field.id]}
              onChange={(value) => onFieldValueChange(field.id, value)}
              error={errors[field.id]}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
