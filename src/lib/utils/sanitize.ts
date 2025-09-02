import sanitizeHtml from "sanitize-html";

export function sanitizeString(input: string): string {
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
    disallowedTagsMode: "discard",
  });
}
