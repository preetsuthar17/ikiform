// Types
import type { FormSchema, FormBlock } from "@/lib/database";

export const processFormBlocks = (schema: FormSchema): FormBlock[] => {
  return schema.blocks?.length
    ? schema.blocks
    : schema.fields?.length
      ? [
          {
            id: "default",
            title: "Form",
            description: "",
            fields: schema.fields,
          },
        ]
      : [];
};

export const calculateProgress = (
  currentStep: number,
  totalSteps: number,
): number => {
  return totalSteps > 1 ? ((currentStep + 1) / totalSteps) * 100 : 100;
};

export const submitForm = async (
  formId: string,
  formData: Record<string, any>,
): Promise<{ success: boolean; message?: string }> => {
  try {
    let headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }
    const response = await fetch(`/api/forms/${formId}/submit`, {
      method: "POST",
      headers,
      body: JSON.stringify({ submissionData: formData }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to submit form",
      };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      message: "Failed to submit form. Please try again.",
    };
  }
};
