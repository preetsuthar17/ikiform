import sanitizeHtml from 'sanitize-html';

export function sanitizeString(input: string): string {
  return sanitizeHtml(input, {
    allowedTags: [], // Remove all HTML tags
    allowedAttributes: {},
    disallowedTagsMode: 'discard',
    // Optionally, you can allow some tags/attributes if needed
  });
}
