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
}

export const FormContent: React.FC<FormContentProps> = ({
  currentBlock,
  formData,
  errors,
  onFieldValueChange,
  title,
  description,
  schema,
}) => {
  const firstFieldRef = useRef<any>(null);
  useEffect(() => {
    if (firstFieldRef.current) {
      firstFieldRef.current.focus();
    }
  }, [currentBlock]);

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
      </div>

      <div className="flex flex-col gap-6">
        {currentBlock.fields.map((field, idx) => (
          <div key={field.id}>
            <FormFieldRenderer
              field={field}
              value={formData[field.id]}
              onChange={(value) => onFieldValueChange(field.id, value)}
              error={errors[field.id]}
              fieldRef={idx === 0 ? firstFieldRef : undefined}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
