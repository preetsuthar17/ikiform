import { NextRequest, NextResponse } from "next/server";
import type { FormSchema } from "@/lib/database.types";

export interface AIFormBuilderRequest {
  prompt: string;
  existingSchema?: FormSchema;
  mode?: "create" | "modify";
}

export interface AIFormBuilderResponse {
  success: boolean;
  schema?: FormSchema;
  error?: string;
  explanation?: string;
}

// Available field types for AI to use
const AVAILABLE_FIELD_TYPES = [
  "text",
  "email",
  "textarea",
  "radio",
  "checkbox",
  "number",
  "select",
  "slider",
  "tags",
];

// Create a comprehensive prompt template for the AI
const createSystemPrompt = () => `
You are an expert form builder AI. Your job is to create comprehensive, user-friendly forms based on natural language descriptions.

IMPORTANT: Always return a complete FormSchema JSON with blocks containing fields. Never return an empty form.

AVAILABLE FIELD TYPES:
- text: Single-line text input
- email: Email address input with validation
- textarea: Multi-line text input
- radio: Single choice from multiple options
- checkbox: Multiple choice from options
- number: Numeric input with min/max validation
- select: Dropdown selection (single or multiple)
- slider: Numeric slider with min/max/step
- tags: Tag input for multiple values

FIELD CUSTOMIZATION OPTIONS:
- label: Display name for the field (REQUIRED)
- description: Help text shown below the field
- placeholder: Placeholder text
- required: Whether the field is mandatory (true/false)
- options: Array of choices (for radio, checkbox, select)
- validation: Rules like minLength, maxLength, min, max, pattern
- settings: Additional configuration like rows (textarea), min/max/step (slider), etc.

FORM STRUCTURE:
The form schema must follow this structure:
{
  "blocks": [
    {
      "id": "block-1",
      "title": "Block Title",
      "description": "Block description",
      "fields": [
        {
          "id": "field-1",
          "type": "text",
          "label": "Field Label",
          "description": "Field description",
          "placeholder": "Enter value...",
          "required": true,
          "validation": {
            "minLength": 2,
            "maxLength": 50
          }
        }
      ]
    }
  ],
  "settings": {
    "title": "Form Title",
    "description": "Form description",
    "submitText": "Submit",
    "multiStep": true/false
  }
}

EXAMPLE FIELD CONFIGURATIONS:
1. Name Field:
{
  "id": "name",
  "type": "text",
  "label": "Full Name",
  "required": true,
  "placeholder": "Enter your full name",
  "validation": {
    "minLength": 2,
    "maxLength": 50,
    "pattern": "^[a-zA-Z ]*$",
    "patternMessage": "Name can only contain letters and spaces"
  }
}

2. Email Field:
{
  "id": "email",
  "type": "email",
  "label": "Email Address",
  "required": true,
  "placeholder": "your@email.com",
  "validation": {
    "emailMessage": "Please enter a valid email address"
  }
}

3. Experience Field:
{
  "id": "experience",
  "type": "textarea",
  "label": "Work Experience",
  "description": "Describe your relevant work experience",
  "required": true,
  "settings": {
    "rows": 4
  },
  "validation": {
    "minLength": 50,
    "maxLength": 1000
  }
}

4. Skills Selection:
{
  "id": "skills",
  "type": "checkbox",
  "label": "Skills",
  "description": "Select all that apply",
  "required": true,
  "options": [
    "JavaScript",
    "Python",
    "Java",
    "React",
    "Node.js"
  ]
}

Be thorough and practical. Create forms that collect all necessary information while maintaining a good user experience. Include proper validation rules and helpful descriptions.

Use multi-step forms when the form has distinct sections (e.g., "Personal Details", "Experience", "Skills") or when there are more than 6-8 fields.
`;

// Validate and clean the AI-generated schema
function validateAndCleanSchema(schema: any): FormSchema {
  // Reject empty schemas
  if (!schema || Object.keys(schema).length === 0) {
    throw new Error("Empty schema received");
  }

  // Ensure required properties exist
  const cleanSchema: FormSchema = {
    blocks: [],
    fields: [],
    settings: {
      title: "AI Generated Form",
      description: "",
      submitText: "Submit",
      successMessage: "Thank you for your submission!",
      redirectUrl: "",
      multiStep: false,
      showProgress: true,
    },
  };

  // Validate and clean settings
  if (schema.settings) {
    cleanSchema.settings = {
      ...cleanSchema.settings,
      ...schema.settings,
      title: schema.settings.title || "AI Generated Form",
    };
  }

  // Validate and clean blocks
  if (Array.isArray(schema.blocks)) {
    cleanSchema.blocks = schema.blocks.map((block: any, index: number) => ({
      id: block.id || `block-${index + 1}`,
      title: block.title || `Step ${index + 1}`,
      description: block.description || "",
      fields: Array.isArray(block.fields)
        ? block.fields.map((field: any, fieldIndex: number) =>
            validateAndCleanField(field, `field-${index}-${fieldIndex}`)
          )
        : [],
    }));
  }

  // Validate and clean fields (for backward compatibility)
  if (Array.isArray(schema.fields)) {
    cleanSchema.fields = schema.fields.map((field: any, index: number) =>
      validateAndCleanField(field, `field-${index}`)
    );
  }

  // If no blocks but has fields, create a default block
  if (cleanSchema.blocks.length === 0 && cleanSchema.fields.length > 0) {
    cleanSchema.blocks = [
      {
        id: "default",
        title: "Form Fields",
        description: "",
        fields: cleanSchema.fields,
      },
    ];
    cleanSchema.settings.multiStep = false;
  } else if (cleanSchema.blocks.length > 1) {
    cleanSchema.settings.multiStep = true;
  }

  // Ensure we have at least one block with at least one field
  if (
    cleanSchema.blocks.length === 0 ||
    cleanSchema.blocks.every((b) => b.fields.length === 0)
  ) {
    throw new Error(
      "Form must have at least one block with at least one field"
    );
  }

  return cleanSchema;
}

function validateAndCleanField(field: any, fallbackId: string) {
  const validTypes = AVAILABLE_FIELD_TYPES;

  return {
    id: field.id || fallbackId,
    type: validTypes.includes(field.type) ? field.type : "text",
    label: field.label || "Untitled Field",
    description: field.description || "",
    placeholder: field.placeholder || "",
    required: Boolean(field.required),
    options: Array.isArray(field.options) ? field.options : undefined,
    validation: field.validation || {},
    settings: field.settings || {},
  };
}

// Helper to analyze edit requests and provide context
function analyzeEditRequest(prompt: string, schema: FormSchema) {
  const lowerPrompt = prompt.toLowerCase();

  // Analyze the form structure
  const fieldTypes = new Set<string>();
  let totalFields = 0;

  schema.blocks.forEach((block) => {
    block.fields.forEach((field) => {
      fieldTypes.add(field.type);
      totalFields++;
    });
  });

  // Analyze the edit intent
  const editType =
    lowerPrompt.includes("add") ||
    lowerPrompt.includes("create") ||
    lowerPrompt.includes("insert")
      ? "add"
      : lowerPrompt.includes("remove") || lowerPrompt.includes("delete")
      ? "remove"
      : lowerPrompt.includes("change") ||
        lowerPrompt.includes("modify") ||
        lowerPrompt.includes("update")
      ? "modify"
      : lowerPrompt.includes("combine") ||
        lowerPrompt.includes("split") ||
        lowerPrompt.includes("move")
      ? "restructure"
      : "unknown";

  const isStructuralChange = ["add", "remove", "restructure"].includes(
    editType
  );

  // Find affected parts of the form
  const targetFields: string[] = [];
  const targetBlocks: string[] = [];

  schema.blocks.forEach((block) => {
    if (lowerPrompt.includes(block.title.toLowerCase())) {
      targetBlocks.push(block.title);
    }
    block.fields.forEach((field) => {
      if (lowerPrompt.includes(field.label.toLowerCase())) {
        targetFields.push(field.label);
      }
    });
  });

  // Determine suggested approach
  const suggestedApproach = isStructuralChange
    ? "Carefully preserve existing field configurations while making structural changes"
    : "Focus on updating field properties while maintaining the form structure";

  return {
    analysis: {
      isMultiStep: schema.blocks.length > 1,
      totalFields,
      blockCount: schema.blocks.length,
      fieldTypes,
    },
    editInfo: {
      intent: editType,
      isStructuralChange,
      targetFields,
      targetBlocks,
      suggestedApproach,
    },
  };
}

// Analyze the edit request to provide more context to the AI
function analyzeEditRequestV2(prompt: string, schema: FormSchema) {
  const blockInfo = schema.blocks.map((block) => ({
    id: block.id,
    title: block.title,
    fieldCount: block.fields.length,
    fieldTypes: block.fields.map((f) => f.type),
  }));

  const analysis = {
    totalFields: schema.blocks.reduce(
      (acc, block) => acc + block.fields.length,
      0
    ),
    blockCount: schema.blocks.length,
    isMultiStep: schema.blocks.length > 1,
    blocks: blockInfo,
    containsRequired: schema.blocks.some((block) =>
      block.fields.some((field) => field.required)
    ),
    fieldTypes: new Set(
      schema.blocks.flatMap((block) => block.fields.map((field) => field.type))
    ),
  };

  let editType = "general";
  if (
    prompt.toLowerCase().includes("add") ||
    prompt.toLowerCase().includes("insert")
  ) {
    editType = "add";
  } else if (
    prompt.toLowerCase().includes("remove") ||
    prompt.toLowerCase().includes("delete")
  ) {
    editType = "remove";
  } else if (
    prompt.toLowerCase().includes("change") ||
    prompt.toLowerCase().includes("modify") ||
    prompt.toLowerCase().includes("update")
  ) {
    editType = "modify";
  }

  return {
    editType,
    analysis,
    suggestedApproach: `Based on the request "${prompt}", we should ${editType} content while preserving the form's ${
      analysis.isMultiStep ? "multi-step" : "single-step"
    } structure and existing validation patterns.`,
  };
}

export async function POST(request: NextRequest) {
  try {
    // Get the API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Gemini API key not configured. Please set GEMINI_API_KEY in your environment variables.",
        },
        { status: 500 }
      );
    }

    const body: AIFormBuilderRequest = await request.json();
    const { prompt, existingSchema, mode = "create" } = body;

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Prompt is required",
        },
        { status: 400 }
      );
    }

    const systemPrompt = createSystemPrompt();

    let userPrompt = "";

    if (mode === "create") {
      userPrompt = `Create a form based on this description: "${prompt}"
      
      Consider:
      - What information needs to be collected?
      - Should this be single-step or multi-step?
      - What validation rules make sense?
      - What field types are most appropriate?
      
      Respond with a complete FormSchema JSON object with at least 3-4 relevant fields.`;
    } else if (existingSchema) {
      const editAnalysis = analyzeEditRequest(prompt, existingSchema);

      userPrompt = `Modify the existing form based on this request: "${prompt}"

      Current form schema:
      ${JSON.stringify(existingSchema, null, 2)}

      Form Analysis:
      - Current structure: ${
        editAnalysis.analysis.isMultiStep ? "Multi-step" : "Single-step"
      } form
      - Total fields: ${editAnalysis.analysis.totalFields}
      - Blocks: ${editAnalysis.analysis.blockCount}
      - Field types in use: ${[...editAnalysis.analysis.fieldTypes].join(", ")}

      Edit Context:
      - Edit Type: ${editAnalysis.editInfo.intent}
      - Suggested Approach: ${editAnalysis.editInfo.suggestedApproach}
      ${
        editAnalysis.editInfo.targetBlocks.length > 0
          ? `- Affected blocks: ${editAnalysis.editInfo.targetBlocks.join(
              ", "
            )}`
          : ""
      }
      ${
        editAnalysis.editInfo.targetFields.length > 0
          ? `- Affected fields: ${editAnalysis.editInfo.targetFields.join(
              ", "
            )}`
          : ""
      }

      Instructions for modification:
      1. Keep the existing structure and fields unless specifically asked to change them
      2. If adding new fields, maintain consistent validation patterns
      3. If editing a field, preserve its ID if possible
      4. If removing fields, make sure to update any related fields or blocks
      5. Maintain the multi-step structure if it exists, unless asked to change it
      6. Keep existing validations and enhance them if relevant to the changes
      7. Preserve any custom settings or configurations not mentioned in the edit request

      Make only the requested changes and return the complete updated FormSchema JSON.
      Start your response with a brief message explaining the specific changes made.`;
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Existing schema is required for modification mode",
        },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${systemPrompt}\n\nUser Request: ${userPrompt}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 1,
            topP: 1,
            maxOutputTokens: 4096,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          error: `Gemini API request failed: ${response.status} - ${
            errorData.error?.message || "Unknown error"
          }`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (!data.candidates?.[0]?.content) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid response from Gemini API",
        },
        { status: 500 }
      );
    }

    let currentText = data.candidates[0].content.parts[0].text;
    let jsonMatch = currentText.match(/\{[\s\S]*\}/);

    // If no valid JSON found or empty schema, retry with a more explicit prompt
    if (!jsonMatch || jsonMatch[0].trim() === "{}") {
      console.log("First attempt returned invalid schema, retrying...");

      const retryPrompt = `${systemPrompt}\n\nUser Request: Let's try again. I need a COMPLETE form schema with actual fields and settings. Here's the request:\n\n"${prompt}"\n\nRemember to include:\n1. At least 3-4 relevant fields\n2. Proper field validation rules\n3. Descriptive labels and placeholders\n4. Form title and description\n\nRespond with a complete FormSchema JSON object.`;

      const retryResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: retryPrompt }] }],
            generationConfig: {
              temperature: 0.7,
              topK: 1,
              topP: 1,
              maxOutputTokens: 4096,
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
            ],
          }),
        }
      );

      if (!retryResponse.ok) {
        return NextResponse.json(
          {
            success: false,
            error: "Could not generate a valid form schema, even after retry",
            explanation: currentText,
          },
          { status: 500 }
        );
      }

      const retryData = await retryResponse.json();
      if (!retryData.candidates?.[0]?.content) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid response from retry attempt",
            explanation: currentText,
          },
          { status: 500 }
        );
      }

      currentText = retryData.candidates[0].content.parts[0].text;
      jsonMatch = currentText.match(/\{[\s\S]*\}/);

      if (!jsonMatch || jsonMatch[0].trim() === "{}") {
        return NextResponse.json(
          {
            success: false,
            error:
              "Could not generate a valid form schema after multiple attempts",
            explanation: currentText,
          },
          { status: 500 }
        );
      }
    }

    try {
      const schema = JSON.parse(jsonMatch[0]) as FormSchema;

      // Validate the schema structure and ensure it's not empty
      const validatedSchema = validateAndCleanSchema(schema);

      return NextResponse.json({
        success: true,
        schema: validatedSchema,
        explanation: currentText.replace(jsonMatch[0], "").trim(),
      });
    } catch (parseError) {
      return NextResponse.json(
        {
          success: false,
          error:
            parseError instanceof Error
              ? parseError.message
              : "Failed to parse or validate schema",
          explanation: currentText,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("AI Form Builder API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
