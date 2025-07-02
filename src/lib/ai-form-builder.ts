"use client";

import type { FormSchema } from "./database.types";

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

export async function generateFormWithAI({
  prompt,
  existingSchema,
  mode = "create",
}: AIFormBuilderRequest): Promise<AIFormBuilderResponse> {
  try {
    if (!prompt.trim()) {
      return {
        success: false,
        error:
          "Prompt is required. Please describe what kind of form you want to create.",
      };
    }

    const response = await fetch("/api/ai-form-builder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt.trim(),
        existingSchema,
        mode,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error || `Server error: ${response.status}`,
      };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error occurred",
    };
  }
}

// Helper function to get example prompts
export function getExamplePrompts(): string[] {
  return [
    "Create a job application form with personal details, experience, and skills",
    "Build a customer feedback survey with ratings and comments",
    "Design a multi-step registration form for an event",
    "Create a contact form with inquiry type and message",
    "Build a product feedback form with multiple choice questions",
    "Design a medical intake form with patient information",
    "Create a restaurant reservation form with date, time, and preferences",
    "Build a newsletter signup form with preferences",
    "Design a bug report form for software issues",
    "Create a wedding RSVP form with meal preferences",
  ];
}
