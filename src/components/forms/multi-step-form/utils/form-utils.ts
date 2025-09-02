import type { FormBlock, FormSchema } from "@/lib/database";

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
  totalSteps: number
): number => {
  return totalSteps > 1 ? ((currentStep + 1) / totalSteps) * 100 : 100;
};

export const submitForm = async (
  formId: string,
  formData: Record<string, any>
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
  timeRemaining?: number;
  attemptsRemaining?: number;
}> => {
  let sessionId: string | undefined;
  try {
    if (typeof window !== "undefined") {
      const sessionKey = `ikiform_session_${formId}`;
      const storedSessionId = localStorage.getItem(sessionKey);
      sessionId = storedSessionId ?? undefined;
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem(sessionKey, sessionId);
      }
    }

    const headers: Record<string, string> = {
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
      body: JSON.stringify({
        submissionData: formData,
        sessionId,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to submit form",
        error: result.error,
        timeRemaining: result.timeRemaining,
        attemptsRemaining: result.attemptsRemaining,
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
