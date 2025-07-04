import { createClient } from "@/utils/supabase/client";
import { createClient as createServerClient } from "@/utils/supabase/server";
import type { Database, FormSchema } from "./database.types";
import { ensureDefaultRateLimitSettings } from "./form-defaults";

export type Form = Database["public"]["Tables"]["forms"]["Row"];
export type FormSubmission =
  Database["public"]["Tables"]["form_submissions"]["Row"];

// Client-side database operations
export const formsDb = {
  // Create a new form
  async createForm(userId: string, title: string, schema: FormSchema) {
    const supabase = createClient();

    // Ensure the schema has default rate limiting settings
    const schemaWithDefaults = ensureDefaultRateLimitSettings(schema);

    const { data, error } = await supabase
      .from("forms")
      .insert({
        user_id: userId,
        title,
        schema: schemaWithDefaults,
        is_published: false,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get all forms for a user
  async getUserForms(userId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("forms")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) throw error;

    // Ensure all forms have default rate limiting settings for legacy forms
    return data.map((form) => ({
      ...form,
      schema: ensureDefaultRateLimitSettings(form.schema),
    }));
  },

  // Get a specific form
  async getForm(formId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("forms")
      .select("*")
      .eq("id", formId)
      .single();

    if (error) throw error;

    // Ensure the schema has default rate limiting settings for legacy forms
    return {
      ...data,
      schema: ensureDefaultRateLimitSettings(data.schema),
    };
  },

  // Update a form
  async updateForm(formId: string, updates: Partial<Form>) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("forms")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", formId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a form
  async deleteForm(formId: string) {
    const supabase = createClient();

    const { error } = await supabase.from("forms").delete().eq("id", formId);

    if (error) throw error;
  },

  // Publish/unpublish a form
  async togglePublishForm(formId: string, isPublished: boolean) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("forms")
      .update({
        is_published: isPublished,
        updated_at: new Date().toISOString(),
      })
      .eq("id", formId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Submit form data
  async submitForm(
    formId: string,
    submissionData: Record<string, any>,
    ipAddress?: string
  ) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("form_submissions")
      .insert({
        form_id: formId,
        submission_data: submissionData,
        ip_address: ipAddress,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get form submissions
  async getFormSubmissions(formId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("form_submissions")
      .select("*")
      .eq("form_id", formId)
      .order("submitted_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // AI Builder Chat Operations
  async saveAIBuilderMessage(
    userId: string,
    sessionId: string,
    role: "user" | "assistant" | "system",
    content: string,
    metadata: Record<string, any> = {}
  ) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("ai_builder_chat")
      .insert({
        user_id: userId,
        session_id: sessionId,
        role,
        content,
        metadata,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAIBuilderChatHistory(userId: string, sessionId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("ai_builder_chat")
      .select("*")
      .eq("user_id", userId)
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data;
  },

  async getAIBuilderSessions(userId: string, limit: number = 10) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("ai_builder_chat")
      .select("session_id, created_at")
      .eq("user_id", userId)
      .eq("role", "user") // Only get user messages to identify sessions
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    // Group by session_id and get the latest message per session
    const sessions = data.reduce((acc, curr) => {
      if (!acc[curr.session_id]) {
        acc[curr.session_id] = curr.created_at;
      }
      return acc;
    }, {} as Record<string, string>);

    return Object.entries(sessions).map(([sessionId, createdAt]) => ({
      session_id: sessionId,
      created_at: createdAt,
    }));
  },

  // AI Analytics Chat Operations
  async saveAIAnalyticsMessage(
    userId: string,
    formId: string,
    sessionId: string,
    role: "user" | "assistant" | "system",
    content: string,
    metadata: Record<string, any> = {}
  ) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("ai_analytics_chat")
      .insert({
        user_id: userId,
        form_id: formId,
        session_id: sessionId,
        role,
        content,
        metadata,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAIAnalyticsChatHistory(
    userId: string,
    formId: string,
    sessionId: string
  ) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("ai_analytics_chat")
      .select("*")
      .eq("user_id", userId)
      .eq("form_id", formId)
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data;
  },

  async getAIAnalyticsSessions(
    userId: string,
    formId: string,
    limit: number = 10
  ) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("ai_analytics_chat")
      .select("session_id, form_id, created_at")
      .eq("user_id", userId)
      .eq("role", "user") // Only get user messages to identify sessions
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    // Group by session_id and get the latest message per session
    const sessions = data.reduce((acc, curr) => {
      if (!acc[curr.session_id]) {
        acc[curr.session_id] = {
          session_id: curr.session_id,
          form_id: curr.form_id,
          created_at: curr.created_at,
        };
      }
      return acc;
    }, {} as Record<string, any>);

    return Object.values(sessions);
  },
};

// Server-side database operations
export const formsDbServer = {
  // Get a public form (for viewing/submitting)
  async getPublicForm(formId: string) {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from("forms")
      .select("*")
      .eq("id", formId)
      .eq("is_published", true)
      .single();

    if (error) throw error;

    // Ensure the schema has default rate limiting settings for legacy forms
    return {
      ...data,
      schema: ensureDefaultRateLimitSettings(data.schema),
    };
  },

  // Verify form ownership
  async verifyFormOwnership(formId: string, userId: string) {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from("forms")
      .select("id")
      .eq("id", formId)
      .eq("user_id", userId)
      .single();

    if (error) return false;
    return !!data;
  },

  // Submit form data (server-side)
  async submitForm(
    formId: string,
    submissionData: Record<string, any>,
    ipAddress?: string
  ) {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from("form_submissions")
      .insert({
        form_id: formId,
        submission_data: submissionData,
        ip_address: ipAddress,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // AI Builder Chat Operations (Server-side)
  async saveAIBuilderMessage(
    userId: string,
    sessionId: string,
    role: "user" | "assistant" | "system",
    content: string,
    metadata: Record<string, any> = {}
  ) {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from("ai_builder_chat")
      .insert({
        user_id: userId,
        session_id: sessionId,
        role,
        content,
        metadata,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAIBuilderChatHistory(userId: string, sessionId: string) {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from("ai_builder_chat")
      .select("*")
      .eq("user_id", userId)
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data;
  },

  async getAIBuilderSessions(userId: string, limit: number = 10) {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from("ai_builder_chat")
      .select("session_id, created_at")
      .eq("user_id", userId)
      .eq("role", "user") // Only get user messages to identify sessions
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    // Group by session_id and get the latest message per session
    const sessions = data.reduce((acc, curr) => {
      if (!acc[curr.session_id]) {
        acc[curr.session_id] = curr.created_at;
      }
      return acc;
    }, {} as Record<string, string>);

    return Object.entries(sessions).map(([sessionId, createdAt]) => ({
      session_id: sessionId,
      created_at: createdAt,
    }));
  },

  // AI Analytics Chat Operations (Server-side)
  async saveAIAnalyticsMessage(
    userId: string,
    formId: string,
    sessionId: string,
    role: "user" | "assistant" | "system",
    content: string,
    metadata: Record<string, any> = {}
  ) {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from("ai_analytics_chat")
      .insert({
        user_id: userId,
        form_id: formId,
        session_id: sessionId,
        role,
        content,
        metadata,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAIAnalyticsChatHistory(
    userId: string,
    formId: string,
    sessionId: string
  ) {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from("ai_analytics_chat")
      .select("*")
      .eq("user_id", userId)
      .eq("form_id", formId)
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data;
  },

  async getAIAnalyticsSessions(
    userId: string,
    formId: string,
    limit: number = 10
  ) {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from("ai_analytics_chat")
      .select("session_id, form_id, created_at")
      .eq("user_id", userId)
      .eq("role", "user") // Only get user messages to identify sessions
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    // Group by session_id and get the latest message per session
    const sessions = data.reduce((acc, curr) => {
      if (!acc[curr.session_id]) {
        acc[curr.session_id] = {
          session_id: curr.session_id,
          form_id: curr.form_id,
          created_at: curr.created_at,
        };
      }
      return acc;
    }, {} as Record<string, any>);

    return Object.values(sessions);
  },
};
