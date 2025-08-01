import type React from 'react';
import { useEffect, useRef } from 'react';
import { FormFieldRenderer } from '@/components/form-builder/form-field-renderer';
import { getLivePatternError } from '@/components/form-builder/form-field-renderer/components/TextInputField';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SocialMediaIcons } from '@/components/ui/social-media-icons';

import type { FormField, FormSchema } from '@/lib/database';

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
  const firstFieldRef = useRef<any>(null);
  useEffect(() => {
    if (firstFieldRef.current) {
      firstFieldRef.current.focus();
    }
  }, []);

  const visibleFields = fieldVisibility
    ? fields.filter((field) => fieldVisibility[field.id]?.visible !== false)
    : fields;

  return (
    <Card
      className={`flex grow flex-col gap-6 rounded-card p-8 ${schema.settings.designMode === 'minimal' ? 'border-none bg-transparent shadow-none hover:bg-transparent' : ''}`}
      variant={schema.settings.designMode === 'minimal' ? 'ghost' : 'default'}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-3xl text-foreground">
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
          (schema.settings.branding.socialMedia.position === 'header' ||
            schema.settings.branding.socialMedia.position === 'both') && (
            <SocialMediaIcons
              className="justify-start"
              iconSize={schema.settings.branding.socialMedia.iconSize || 'md'}
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

      <form className="flex flex-col gap-6" onSubmit={onSubmit}>
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
              onChange={(value) => onFieldValueChange(field.id, value)}
              value={formData[field.id]}
            />
          </div>
        ))}

        {(() => {
          for (const field of visibleFields) {
            if (
              ['text', 'email', 'textarea'].includes(field.type) &&
              getLivePatternError(field, formData[field.id])
            ) {
              return (
                <div className="mb-2 text-destructive text-xs">
                  Please fix the highlighted errors before submitting.
                </div>
              );
            }
          }
          return null;
        })()}

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            className="w-fit sm:w-auto"
            disabled={
              submitting ||
              visibleFields.some(
                (field) =>
                  ['text', 'email', 'textarea'].includes(field.type) &&
                  getLivePatternError(field, formData[field.id])
              )
            }
            loading={submitting}
            type="submit"
          >
            {submitting ? 'Submitting' : schema.settings.submitText || 'Submit'}
          </Button>
        </div>
      </form>
    </Card>
  );
};
