import type { Form } from '@/lib/database';

/**
 * Count total fields across blocks and direct fields
 */
export function getTotalFields(form: Form): number {
  const fieldsFromDirectArray = form.schema?.fields?.length || 0;
  const fieldsFromBlocks =
    form.schema?.blocks?.reduce(
      (total, block) => total + (block.fields?.length || 0),
      0
    ) || 0;
  return Math.max(fieldsFromDirectArray, fieldsFromBlocks);
}

/**
 * Format date string for display
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Generate share URL for a form
 */
export function generateShareUrl(formId: string): string {
  return `${window.location.origin}/forms/${formId}`;
}

/**
 * Encode prompt for URL
 */
export function encodePromptForUrl(prompt: string): string {
  return encodeURIComponent(prompt);
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}
