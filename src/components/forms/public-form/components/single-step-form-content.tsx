// Libraries
import React, { useEffect, useRef } from "react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormFieldRenderer } from "@/components/form-builder/form-field-renderer";
import { SocialMediaIcons } from "@/components/ui/social-media-icons";
import { getLivePatternError } from "@/components/form-builder/form-field-renderer/components/TextInputField";

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
  fieldVisibility?: Record<string, { visible: boolean; disabled: boolean }>;
  logicMessages?: string[];
}

export const SingleStepFormContent: React.FC<SingleStepFormContentProps> = ({
  schema,
  fields,
  formData,
  errors,
  submitting,
  onFieldValueChange,
  onSubmit,
  fieldVisibility,
  logicMessages,
}) => {
  // Debug logging
  // console.log("Form Schema:", schema);
  // console.log("Form Fields:", fields);
  // console.log("Form Data:", formData);

  const firstFieldRef = useRef<any>(null);
  useEffect(() => {
    if (firstFieldRef.current) {
      firstFieldRef.current.focus();
    }
  }, []);

  // Filter fields by logic visibility
  const visibleFields = fieldVisibility
    ? fields.filter((field) => fieldVisibility[field.id]?.visible !== false)
    : fields;

  return (
    <Card
      className={`rounded-card flex flex-col gap-6 p-8 w-full grow ${schema.settings.designMode === "minimal" ? "bg-transparent border-none shadow-none hover:bg-transparent" : ""}`}
      variant={schema.settings.designMode === "minimal" ? "ghost" : "default"}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground">
            {schema.settings.title}
          </h1>
          {schema.settings.description && (
            <p className="text-muted-foreground">
              {schema.settings.description}
            </p>
          )}
        </div>

        {schema.settings.branding?.socialMedia?.enabled &&
          schema.settings.branding.socialMedia.platforms &&
          (schema.settings.branding.socialMedia.position === "header" ||
            schema.settings.branding.socialMedia.position === "both") && (
            <SocialMediaIcons
              platforms={schema.settings.branding.socialMedia.platforms}
              iconSize={schema.settings.branding.socialMedia.iconSize || "md"}
              className="justify-start"
            />
          )}
        {logicMessages && logicMessages.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-3 rounded-md mb-2">
            {logicMessages.map((msg, i) => (
              <div key={i}>{msg}</div>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        {visibleFields.map((field, idx) => (
          <div
            key={field.id}
            style={
              fieldVisibility?.[field.id]?.disabled ? { opacity: 0.5 } : {}
            }
          >
            <FormFieldRenderer
              field={field}
              value={formData[field.id]}
              onChange={(value) => onFieldValueChange(field.id, value)}
              error={errors[field.id]}
              fieldRef={idx === 0 ? firstFieldRef : undefined}
              disabled={fieldVisibility?.[field.id]?.disabled}
            />
          </div>
        ))}

        {(() => {
          // Check for any live regex error in text fields
          for (const field of visibleFields) {
            if (
              ["text", "email", "textarea"].includes(field.type) &&
              getLivePatternError(field, formData[field.id])
            ) {
              return (
                <div className="text-destructive text-xs mb-2">
                  Please fix the highlighted errors before submitting.
                </div>
              );
            }
          }
          return null;
        })()}

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="submit"
            className="w-fit sm:w-auto"
            disabled={
              submitting ||
              visibleFields.some(
                (field) =>
                  ["text", "email", "textarea"].includes(field.type) &&
                  getLivePatternError(field, formData[field.id]),
              )
            }
            loading={submitting}
          >
            {submitting ? "Submitting" : schema.settings.submitText || "Submit"}
          </Button>
        </div>
      </form>
    </Card>
  );
};
