import type React from "react";
import { useEffect, useRef } from "react";

import { FormFieldRenderer } from "@/components/form-builder/form-field-renderer";
import { Separator } from "@/components/ui";
import { SocialMediaIcons } from "@/components/ui/social-media-icons";
import type { FormBlock, FormSchema } from "@/lib/database";
import type { FormCustomStyles } from "@/lib/utils/form-layout";
import { getPublicFormTitle } from "@/lib/utils/form-utils";

interface FormContentProps {
  formId: string;
  currentBlock: FormBlock;
  formData: Record<string, any>;
  errors: Record<string, string>;
  onFieldValueChange: (fieldId: string, value: any) => void;
  title?: string;
  description?: string;
  schema: FormSchema;
  fieldVisibility?: Record<string, { visible: boolean; disabled: boolean }>;
  logicMessages?: string[];
  customStyles?: FormCustomStyles;
}

export const FormContent: React.FC<FormContentProps> = ({
  formId,
  currentBlock,
  formData,
  errors,
  onFieldValueChange,
  title,
  description,
  schema,
  fieldVisibility,
  logicMessages,
  customStyles,
}) => {
  const firstFieldRef = useRef<any>(null);
  useEffect(() => {
    if (
      firstFieldRef.current &&
      schema.settings.behavior?.autoFocusFirstField
    ) {
      firstFieldRef.current.focus();
    }
  }, [currentBlock, schema.settings.behavior?.autoFocusFirstField]);

  const visibleFields = fieldVisibility
    ? currentBlock.fields.filter(
        (field) => fieldVisibility[field.id]?.visible !== false
      )
    : currentBlock.fields;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        {!schema.settings.hideHeader && (
          <>
            <div className="flex flex-col gap-2">
              <h1
                className="text-foreground"
                style={customStyles?.headingStyle}
              >
                {currentBlock.title || getPublicFormTitle(schema)}
              </h1>
              {(currentBlock.description || description) && (
                <p
                  className="text-muted-foreground"
                  style={customStyles?.textStyle}
                >
                  {currentBlock.description || description}
                </p>
              )}
            </div>
            <Separator />
          </>
        )}
        {schema.settings.branding?.socialMedia?.enabled &&
          schema.settings.branding.socialMedia.platforms &&
          (schema.settings.branding.socialMedia.position === "header" ||
            schema.settings.branding.socialMedia.position === "both") && (
            <SocialMediaIcons
              className="justify-start"
              iconSize={schema.settings.branding.socialMedia.iconSize || "md"}
              platforms={schema.settings.branding.socialMedia.platforms}
            />
          )}
        {logicMessages && logicMessages.length > 0 && (
          <div className="mb-2 rounded-md border-yellow-400 border-l-4 bg-yellow-50 p-3 text-yellow-800">
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
              disabled={fieldVisibility?.[field.id]?.disabled}
              error={errors[field.id]}
              field={field}
              fieldRef={idx === 0 ? firstFieldRef : undefined}
              formId={formId}
              onChange={(value) => onFieldValueChange(field.id, value)}
              value={formData[field.id]}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
