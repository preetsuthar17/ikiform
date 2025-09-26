export const generateSessionId = () =>
  "ai-builder-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);

export const extractJsonFromText = (text: string) => {
  try {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
  } catch {
    return null;
  }
  return null;
};

export const checkForDuplicateSchema = (forms: any[], schema: any) =>
  forms.find((f) => JSON.stringify(f.schema) === JSON.stringify(schema));

export const initializeScrollbarStyles = () => {
  if (typeof window !== "undefined") {
    const style = document.createElement("style");
    style.innerHTML = `
      .scrollbar-none {
        scrollbar-width: none;
        -ms-overflow-style: none;
      }
      .scrollbar-none::-webkit-scrollbar {
        display: none;
      }
    `;
    document.head.appendChild(style);
  }
};
