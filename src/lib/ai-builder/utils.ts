import { ChatMessage } from "./types";

export const generateSessionId = () => {
  return (
    "ai-builder-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9)
  );
};

export function validateFormSchema(schema: any): boolean {
  if (!schema || typeof schema !== "object") {
    return false;
  }

  // Check for required top-level properties
  if (!schema.settings || !schema.blocks || !Array.isArray(schema.blocks)) {
    return false;
  }

  // Check that blocks contain valid field objects
  for (const block of schema.blocks) {
    if (!block.id || !block.title || !Array.isArray(block.fields)) {
      return false;
    }

    // Check that fields have required properties
    for (const field of block.fields) {
      if (
        !field.id ||
        !field.type ||
        !field.label ||
        typeof field.required !== "boolean"
      ) {
        return false;
      }
    }
  }

  return true;
}

export function extractJsonFromText(text: string): any {
  try {
    // Find JSON-like content between triple backticks
    const codeBlockMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (codeBlockMatch) {
      try {
        const parsed = JSON.parse(codeBlockMatch[1]);
        if (validateFormSchema(parsed)) {
          return parsed;
        }
      } catch (e) {
        // Try to fix common JSON issues
        const fixed = fixIncompleteJson(codeBlockMatch[1]);
        if (fixed) {
          try {
            const parsed = JSON.parse(fixed);
            if (validateFormSchema(parsed)) {
              return parsed;
            }
          } catch (e2) {
            // Ignore parsing errors
          }
        }
      }
    }

    // Find JSON-like content between single backticks
    const inlineMatch = text.match(/`(\{[\s\S]*?\})`/);
    if (inlineMatch) {
      try {
        const parsed = JSON.parse(inlineMatch[1]);
        if (validateFormSchema(parsed)) {
          return parsed;
        }
      } catch (e) {
        const fixed = fixIncompleteJson(inlineMatch[1]);
        if (fixed) {
          try {
            const parsed = JSON.parse(fixed);
            if (validateFormSchema(parsed)) {
              return parsed;
            }
          } catch (e2) {
            // Ignore parsing errors
          }
        }
      }
    }

    // Try to find JSON at the end of the text
    const jsonMatch = text.match(/\{[\s\S]*\}$/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        if (validateFormSchema(parsed)) {
          return parsed;
        }
      } catch (e) {
        const fixed = fixIncompleteJson(jsonMatch[0]);
        if (fixed) {
          try {
            const parsed = JSON.parse(fixed);
            if (validateFormSchema(parsed)) {
              return parsed;
            }
          } catch (e2) {
            // Ignore parsing errors
          }
        }
      }
    }

    // Try to find any JSON-like structure in the text
    const anyJsonMatch = text.match(/\{[\s\S]*\}/);
    if (anyJsonMatch) {
      try {
        const parsed = JSON.parse(anyJsonMatch[0]);
        if (validateFormSchema(parsed)) {
          return parsed;
        }
      } catch (e) {
        const fixed = fixIncompleteJson(anyJsonMatch[0]);
        if (fixed) {
          try {
            const parsed = JSON.parse(fixed);
            if (validateFormSchema(parsed)) {
              return parsed;
            }
          } catch (e2) {
            // Ignore parsing errors
          }
        }
      }
    }

    return null;
  } catch (error) {
    console.error("Error extracting JSON:", error);
    return null;
  }
}

function fixIncompleteJson(jsonString: string): string | null {
  try {
    // First, try to parse as-is
    JSON.parse(jsonString);
    return jsonString;
  } catch (e) {
    // If it fails, try to fix common issues
    let fixed = jsonString;

    // Count braces and brackets to see if they're balanced
    const openBraces = (fixed.match(/\{/g) || []).length;
    const closeBraces = (fixed.match(/\}/g) || []).length;
    const openBrackets = (fixed.match(/\[/g) || []).length;
    const closeBrackets = (fixed.match(/\]/g) || []).length;

    // Add missing closing braces/brackets
    while (openBraces > closeBraces) {
      fixed += "}";
    }
    while (openBrackets > closeBrackets) {
      fixed += "]";
    }

    // Remove trailing commas before closing braces/brackets
    fixed = fixed.replace(/,(\s*[}\]])/g, "$1");

    // Try to parse the fixed version
    try {
      JSON.parse(fixed);
      return fixed;
    } catch (e2) {
      // If still failing, try a more aggressive approach
      // Find the last complete object/array and truncate there
      const lastCompleteMatch = fixed.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/);
      if (lastCompleteMatch) {
        try {
          JSON.parse(lastCompleteMatch[0]);
          return lastCompleteMatch[0];
        } catch (e3) {
          // Give up
          return null;
        }
      }

      return null;
    }
  }
}

export const checkForDuplicateSchema = (forms: any[], schema: any) => {
  return forms.find((f) => JSON.stringify(f.schema) === JSON.stringify(schema));
};

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

export function fixAIGeneratedSchema(schema: any): any {
  if (!schema || typeof schema !== "object") {
    return schema;
  }

  // If the schema has both fields and blocks with field references, fix the structure
  if (
    schema.fields &&
    Array.isArray(schema.fields) &&
    schema.blocks &&
    Array.isArray(schema.blocks)
  ) {
    // Create a map of field IDs to field objects
    const fieldMap = new Map();
    schema.fields.forEach((field: any) => {
      if (field.id) {
        fieldMap.set(field.id, field);
      }
    });

    // Fix blocks to contain actual field objects instead of field references
    const fixedBlocks = schema.blocks.map((block: any) => {
      if (block.fields && Array.isArray(block.fields)) {
        const actualFields = block.fields
          .map((fieldRef: any) => {
            // If it's a field reference (just an ID), get the actual field
            if (typeof fieldRef === "string") {
              return fieldMap.get(fieldRef);
            }
            // If it's already a field object with an ID, get the full field
            if (fieldRef.id) {
              return fieldMap.get(fieldRef.id) || fieldRef;
            }
            // If it's a complete field object, use it as is
            return fieldRef;
          })
          .filter(Boolean); // Remove any undefined fields

        return {
          ...block,
          fields: actualFields,
        };
      }
      return block;
    });

    return {
      ...schema,
      blocks: fixedBlocks,
      fields: schema.fields, // Keep the fields array for backward compatibility
    };
  }

  return schema;
}
