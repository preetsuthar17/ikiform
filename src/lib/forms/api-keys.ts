import { createClient } from "@/utils/supabase/client";
import { createClient as createServerClient } from "@/utils/supabase/server";

export function generateApiKey(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  const randomPart2 = Math.random().toString(36).substring(2, 15);
  return `ikiform_${timestamp}_${randomPart}${randomPart2}`;
}

export function isValidApiKeyFormat(apiKey: string): boolean {
  return /^ikiform_[a-z0-9]+_[a-z0-9]+$/.test(apiKey);
}

export async function generateFormApiKey(formId: string): Promise<{
  success: boolean;
  apiKey?: string;
  error?: string;
}> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Authentication required" };
    }

    const apiKey = generateApiKey();

    const { error } = await supabase
      .from("forms")
      .update({
        api_key: apiKey,
        api_enabled: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", formId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error generating API key:", error);
      return { success: false, error: "Failed to generate API key" };
    }

    return { success: true, apiKey };
  } catch (error) {
    console.error("Error generating API key:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function revokeFormApiKey(formId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Authentication required" };
    }

    const { error } = await supabase
      .from("forms")
      .update({
        api_key: null,
        api_enabled: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", formId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error revoking API key:", error);
      return { success: false, error: "Failed to revoke API key" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error revoking API key:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function toggleFormApiEnabled(
  formId: string,
  enabled: boolean
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Authentication required" };
    }

    const { error } = await supabase
      .from("forms")
      .update({
        api_enabled: enabled,
        updated_at: new Date().toISOString(),
      })
      .eq("id", formId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error toggling API status:", error);
      return { success: false, error: "Failed to update API status" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error toggling API status:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getFormByApiKey(apiKey: string): Promise<{
  success: boolean;
  form?: any;
  error?: string;
}> {
  try {
    if (!isValidApiKeyFormat(apiKey)) {
      return { success: false, error: "Invalid API key format" };
    }

    const supabase = await createServerClient();

    const { data: form, error } = await supabase
      .from("forms")
      .select("*")
      .eq("api_key", apiKey)
      .eq("api_enabled", true)
      .single();

    if (error || !form) {
      return { success: false, error: "Invalid API key or form not found" };
    }

    return { success: true, form };
  } catch (error) {
    console.error("Error getting form by API key:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function validateFormApiAccess(
  apiKey: string,
  formId: string
): Promise<{
  success: boolean;
  form?: any;
  error?: string;
}> {
  try {
    if (!isValidApiKeyFormat(apiKey)) {
      return { success: false, error: "Invalid API key format" };
    }

    const supabase = await createServerClient();

    const { data: form, error } = await supabase
      .from("forms")
      .select("*")
      .eq("id", formId)
      .eq("api_key", apiKey)
      .eq("api_enabled", true)
      .single();

    if (error || !form) {
      return {
        success: false,
        error: "Invalid API key or form not accessible",
      };
    }

    return { success: true, form };
  } catch (error) {
    console.error("Error validating form API access:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
