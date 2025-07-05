// Libraries
import React from "react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormFieldRenderer } from "@/components/form-builder/form-field-renderer";

// Types
import type { FormSchema, FormField } from "@/lib/database";

interface SingleStepFormContentProps {
  schema: FormSchema;
  fields: FormField[];
  formData: Record<string, any>;
  errors: Record<string, string>;
  submitting: boolean;
  onFieldValueChange: (fieldId: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export const SingleStepFormContent: React.FC<SingleStepFormContentProps> = ({
  schema,
  fields,
  formData,
  errors,
  submitting,
  onFieldValueChange,
  onSubmit,
}) => {
  return (
    <Card
      className="rounded-card flex flex-col gap-6"
      style={{ padding: "2rem" }}
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">
          {schema.settings.title}
        </h1>
        {schema.settings.description && (
          <p className="text-muted-foreground">{schema.settings.description}</p>
        )}
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        {fields.map((field) => (
          <div key={field.id}>
            <FormFieldRenderer
              field={field}
              value={formData[field.id]}
              onChange={(value) => onFieldValueChange(field.id, value)}
              error={errors[field.id]}
            />
          </div>
        ))}

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="submit"
            className="w-fit sm:w-auto"
            disabled={submitting}
            loading={submitting}
          >
            {submitting ? "Submitting" : schema.settings.submitText || "Submit"}
          </Button>
        </div>
      </form>
    </Card>
  );
};
