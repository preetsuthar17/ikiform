// Libraries
import React, { useEffect, useRef } from "react";

// UI Components
import { FormFieldRenderer } from "@/components/form-builder/form-field-renderer";
import { SocialMediaIcons } from "@/components/ui/social-media-icons";

// Types
import type { FormBlock, FormSchema } from "@/lib/database";

interface FormContentProps {
  currentBlock: FormBlock;
  formData: Record<string, any>;
  errors: Record<string, string>;
  onFieldValueChange: (fieldId: string, value: any) => void;
  title?: string;
  description?: string;
  schema: FormSchema;
  fieldVisibility?: Record<string, { visible: boolean; disabled: boolean }>;
  logicMessages?: string[];
}

export const FormContent: React.FC<FormContentProps> = ({
  currentBlock,
  formData,
  errors,
  onFieldValueChange,
  title,
  description,
  schema,
  fieldVisibility,
  logicMessages,
}) => {
  const firstFieldRef = useRef<any>(null);
  useEffect(() => {
    if (firstFieldRef.current) {
      firstFieldRef.current.focus();
    }
  }, [currentBlock]);

  // Filter fields by logic visibility
  const visibleFields = fieldVisibility
    ? currentBlock.fields.filter(
        (field) => fieldVisibility[field.id]?.visible !== false,
      )
    : currentBlock.fields;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
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

      <div className="flex flex-col gap-6">
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
      </div>
    </div>
  );
};
