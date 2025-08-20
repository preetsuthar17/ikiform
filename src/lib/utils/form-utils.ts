import type { FormSchema } from '@/lib/database/database.types';

/**
 * Gets the appropriate title for display based on context
 * @param schema - The form schema
 * @param isPublic - Whether this is for public display (true) or internal use (false)
 * @returns The title to display
 */
export function getFormTitle(schema: FormSchema, isPublic = false): string {
  if (isPublic && schema.settings.publicTitle) {
    return schema.settings.publicTitle;
  }
  return schema.settings.title || 'Untitled Form';
}

/**
 * Gets the display title for public forms (embed, actual form display)
 * @param schema - The form schema
 * @returns The public title or falls back to internal title
 */
export function getPublicFormTitle(schema: FormSchema): string {
  return getFormTitle(schema, true);
}

/**
 * Gets the internal title for admin/dashboard use
 * @param schema - The form schema
 * @returns The internal title
 */
export function getInternalFormTitle(schema: FormSchema): string {
  return getFormTitle(schema, false);
}
