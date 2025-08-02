import type { Database, FormSchema } from '@/lib/database';
import { ensureDefaultFormSettings } from '@/lib/forms';
import { createClient } from '@/utils/supabase/client';
import { createClient as createServerClient } from '@/utils/supabase/server';

export type Form = Database['public']['Tables']['forms']['Row'];
export type FormSubmission =
  Database['public']['Tables']['form_submissions']['Row'];
export type User = Database['public']['Tables']['users']['Row'];

// In-memory cache with TTL
const cache = new Map<string, { data: any; expires: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCacheKey(method: string, ...args: any[]): string {
  return `${method}:${JSON.stringify(args)}`;
}

function getFromCache<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, data: any): void {
  cache.set(key, {
    data,
    expires: Date.now() + CACHE_TTL,
  });
}

export const formsDb = {
  async createForm(userId: string, title: string, schema: FormSchema) {
    const supabase = createClient();
    const schemaWithDefaults = ensureDefaultFormSettings(schema);

    const { data, error } = await supabase
      .from('forms')
      .insert({
        user_id: userId,
        title,
        schema: schemaWithDefaults,
        is_published: false,
      })
      .select()
      .single();

    if (error) throw error;

    // Invalidate user forms cache
    const userFormsKey = getCacheKey('getUserForms', userId);
    cache.delete(userFormsKey);

    return data;
  },

  async getUserForms(userId: string) {
    const cacheKey = getCacheKey('getUserForms', userId);
    const cached = getFromCache<Form[]>(cacheKey);
    if (cached) return cached;

    const supabase = createClient();

    // Optimize: Only select necessary fields for list view
    const { data, error } = await supabase
      .from('forms')
      .select(
        'id, title, description, is_published, created_at, updated_at, user_id'
      )
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    const forms = data.map((form) => ({
      ...form,
      schema: {} as FormSchema, // Empty schema object instead of null for type consistency
    }));

    setCache(cacheKey, forms);
    return forms;
  },

  async getUserFormsWithDetails(userId: string) {
    const cacheKey = getCacheKey('getUserFormsWithDetails', userId);
    const cached = getFromCache<Form[]>(cacheKey);
    if (cached) return cached;

    const supabase = createClient();

    const { data, error } = await supabase
      .from('forms')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    const forms = data.map((form) => ({
      ...form,
      schema: ensureDefaultFormSettings(form.schema),
    }));

    setCache(cacheKey, forms);
    return forms;
  },

  async getForm(formId: string) {
    const cacheKey = getCacheKey('getForm', formId);
    const cached = getFromCache<Form>(cacheKey);
    if (cached) return cached;

    const supabase = createClient();

    const { data, error } = await supabase
      .from('forms')
      .select('*')
      .eq('id', formId)
      .single();

    if (error) throw error;

    const form = {
      ...data,
      schema: ensureDefaultFormSettings(data.schema),
    };

    setCache(cacheKey, form);
    return form;
  },

  async getFormBasic(formId: string): Promise<Partial<Form>> {
    const cacheKey = getCacheKey('getFormBasic', formId);
    const cached = getFromCache<Partial<Form>>(cacheKey);
    if (cached) return cached;

    const supabase = createClient();

    // Only fetch essential fields
    const { data, error } = await supabase
      .from('forms')
      .select(
        'id, title, description, is_published, user_id, created_at, updated_at'
      )
      .eq('id', formId)
      .single();

    if (error) throw error;

    setCache(cacheKey, data);
    return data;
  },

  async getMultipleForms(formIds: string[]) {
    if (formIds.length === 0) return [];

    // Check cache for each form
    const cachedForms: Form[] = [];
    const uncachedIds: string[] = [];

    formIds.forEach((id) => {
      const cacheKey = getCacheKey('getForm', id);
      const cached = getFromCache<Form>(cacheKey);
      if (cached) {
        cachedForms.push(cached);
      } else {
        uncachedIds.push(id);
      }
    });

    if (uncachedIds.length === 0) {
      return cachedForms;
    }

    const supabase = createClient();

    // Batch fetch uncached forms
    const { data, error } = await supabase
      .from('forms')
      .select('*')
      .in('id', uncachedIds);

    if (error) throw error;

    const fetchedForms = data.map((form) => {
      const processedForm = {
        ...form,
        schema: ensureDefaultFormSettings(form.schema),
      };

      // Cache each form
      const cacheKey = getCacheKey('getForm', form.id);
      setCache(cacheKey, processedForm);

      return processedForm;
    });

    return [...cachedForms, ...fetchedForms];
  },

  async updateForm(formId: string, updates: Partial<Form>) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('forms')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', formId)
      .select()
      .single();

    if (error) throw error;

    // Invalidate caches
    const formCacheKey = getCacheKey('getForm', formId);
    const basicCacheKey = getCacheKey('getFormBasic', formId);
    cache.delete(formCacheKey);
    cache.delete(basicCacheKey);

    // Also invalidate user forms cache if we have user_id
    if (data.user_id) {
      const userFormsKey = getCacheKey('getUserForms', data.user_id);
      const userFormsDetailKey = getCacheKey(
        'getUserFormsWithDetails',
        data.user_id
      );
      cache.delete(userFormsKey);
      cache.delete(userFormsDetailKey);
    }

    return data;
  },

  async deleteForm(formId: string) {
    const supabase = createClient();

    // Get form first to invalidate user cache
    const form = await this.getFormBasic(formId);

    const { error } = await supabase.from('forms').delete().eq('id', formId);

    if (error) throw error;

    // Invalidate caches
    const formCacheKey = getCacheKey('getForm', formId);
    const basicCacheKey = getCacheKey('getFormBasic', formId);
    cache.delete(formCacheKey);
    cache.delete(basicCacheKey);

    if (form.user_id) {
      const userFormsKey = getCacheKey('getUserForms', form.user_id);
      const userFormsDetailKey = getCacheKey(
        'getUserFormsWithDetails',
        form.user_id
      );
      cache.delete(userFormsKey);
      cache.delete(userFormsDetailKey);
    }
  },

  async togglePublishForm(formId: string, isPublished: boolean) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('forms')
      .update({
        is_published: isPublished,
        updated_at: new Date().toISOString(),
      })
      .eq('id', formId)
      .select()
      .single();

    if (error) throw error;

    // Invalidate caches
    const formCacheKey = getCacheKey('getForm', formId);
    const basicCacheKey = getCacheKey('getFormBasic', formId);
    cache.delete(formCacheKey);
    cache.delete(basicCacheKey);

    if (data.user_id) {
      const userFormsKey = getCacheKey('getUserForms', data.user_id);
      const userFormsDetailKey = getCacheKey(
        'getUserFormsWithDetails',
        data.user_id
      );
      cache.delete(userFormsKey);
      cache.delete(userFormsDetailKey);
    }

    return data;
  },

  async submitForm(
    formId: string,
    submissionData: Record<string, any>,
    ipAddress?: string
  ) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('form_submissions')
      .insert({
        form_id: formId,
        submission_data: submissionData,
        ip_address: ipAddress,
      })
      .select()
      .single();

    if (error) throw error;

    // Invalidate submissions cache
    const submissionsCacheKey = getCacheKey('getFormSubmissions', formId);
    cache.delete(submissionsCacheKey);

    return data;
  },

  async getFormSubmissions(formId: string, limit?: number) {
    const cacheKey = getCacheKey('getFormSubmissions', formId, limit);
    const cached = getFromCache<FormSubmission[]>(cacheKey);
    if (cached) return cached;

    const supabase = createClient();

    let query = supabase
      .from('form_submissions')
      .select('*')
      .eq('form_id', formId)
      .order('submitted_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) throw error;

    setCache(cacheKey, data);
    return data;
  },

  async getFormSubmissionsPaginated(formId: string, page = 1, pageSize = 50) {
    const offset = (page - 1) * pageSize;
    const cacheKey = getCacheKey(
      'getFormSubmissionsPaginated',
      formId,
      page,
      pageSize
    );
    const cached = getFromCache<FormSubmission[]>(cacheKey);
    if (cached) return cached;

    const supabase = createClient();

    const { data, error } = await supabase
      .from('form_submissions')
      .select('*')
      .eq('form_id', formId)
      .order('submitted_at', { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (error) throw error;

    setCache(cacheKey, data);
    return data;
  },

  // AI Builder methods with caching
  async saveAIBuilderMessage(
    userId: string,
    sessionId: string,
    role: 'user' | 'assistant' | 'system',
    content: string,
    metadata: Record<string, any> = {}
  ) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('ai_builder_chat')
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

    // Invalidate chat history cache
    const historyCacheKey = getCacheKey(
      'getAIBuilderChatHistory',
      userId,
      sessionId
    );
    cache.delete(historyCacheKey);

    return data;
  },

  async getAIBuilderChatHistory(userId: string, sessionId: string) {
    const cacheKey = getCacheKey('getAIBuilderChatHistory', userId, sessionId);
    const cached = getFromCache<any[]>(cacheKey);
    if (cached) return cached;

    const supabase = createClient();

    const { data, error } = await supabase
      .from('ai_builder_chat')
      .select('*')
      .eq('user_id', userId)
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    setCache(cacheKey, data);
    return data;
  },

  async getAIBuilderSessions(userId: string, limit = 10) {
    const cacheKey = getCacheKey('getAIBuilderSessions', userId, limit);
    const cached = getFromCache<any[]>(cacheKey);
    if (cached) return cached;

    const supabase = createClient();

    const { data, error } = await supabase
      .from('ai_builder_chat')
      .select('session_id, created_at')
      .eq('user_id', userId)
      .eq('role', 'user')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    const sessions = data.reduce(
      (acc, curr) => {
        if (!acc[curr.session_id]) {
          acc[curr.session_id] = curr.created_at;
        }
        return acc;
      },
      {} as Record<string, string>
    );

    const result = Object.entries(sessions).map(([sessionId, createdAt]) => ({
      session_id: sessionId,
      created_at: createdAt,
    }));

    setCache(cacheKey, result);
    return result;
  },

  // AI Analytics methods with caching
  async saveAIAnalyticsMessage(
    userId: string,
    formId: string,
    sessionId: string,
    role: 'user' | 'assistant' | 'system',
    content: string,
    metadata: Record<string, any> = {}
  ) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('ai_analytics_chat')
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

    // Invalidate chat history cache
    const historyCacheKey = getCacheKey(
      'getAIAnalyticsChatHistory',
      userId,
      formId,
      sessionId
    );
    cache.delete(historyCacheKey);

    return data;
  },

  async getAIAnalyticsChatHistory(
    userId: string,
    formId: string,
    sessionId: string
  ) {
    const cacheKey = getCacheKey(
      'getAIAnalyticsChatHistory',
      userId,
      formId,
      sessionId
    );
    const cached = getFromCache<any[]>(cacheKey);
    if (cached) return cached;

    const supabase = createClient();

    const { data, error } = await supabase
      .from('ai_analytics_chat')
      .select('*')
      .eq('user_id', userId)
      .eq('form_id', formId)
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    setCache(cacheKey, data);
    return data;
  },

  async getAIAnalyticsSessions(userId: string, formId: string, limit = 10) {
    const cacheKey = getCacheKey(
      'getAIAnalyticsSessions',
      userId,
      formId,
      limit
    );
    const cached = getFromCache<any[]>(cacheKey);
    if (cached) return cached;

    const supabase = createClient();

    const { data, error } = await supabase
      .from('ai_analytics_chat')
      .select('session_id, form_id, created_at')
      .eq('user_id', userId)
      .eq('role', 'user')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    const sessions = data.reduce(
      (acc, curr) => {
        if (!acc[curr.session_id]) {
          acc[curr.session_id] = {
            session_id: curr.session_id,
            form_id: curr.form_id,
            created_at: curr.created_at,
          };
        }
        return acc;
      },
      {} as Record<string, any>
    );

    const result = Object.values(sessions);
    setCache(cacheKey, result);
    return result;
  },

  // Cache management utilities
  clearCache() {
    cache.clear();
  },

  clearUserCache(userId: string) {
    const keysToDelete = [];
    for (const key of cache.keys()) {
      if (key.includes(userId)) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach((key) => cache.delete(key));
  },

  clearFormCache(formId: string) {
    const keysToDelete = [];
    for (const key of cache.keys()) {
      if (key.includes(formId)) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach((key) => cache.delete(key));
  },
};

// Server-side database functions (unchanged but can be optimized similarly)
export const formsDbServer = {
  async getPublicForm(formId: string) {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('forms')
      .select('*')
      .eq('id', formId)
      .eq('is_published', true)
      .single();

    if (error) throw error;

    return {
      ...data,
      schema: ensureDefaultFormSettings(data.schema),
    };
  },

  async verifyFormOwnership(formId: string, userId: string) {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('forms')
      .select('id')
      .eq('id', formId)
      .eq('user_id', userId)
      .single();

    if (error) return false;
    return !!data;
  },

  async submitForm(
    formId: string,
    submissionData: Record<string, any>,
    ipAddress?: string
  ) {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('form_submissions')
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

  async saveAIBuilderMessage(
    userId: string,
    sessionId: string,
    role: 'user' | 'assistant' | 'system',
    content: string,
    metadata: Record<string, any> = {}
  ) {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('ai_builder_chat')
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
      .from('ai_builder_chat')
      .select('*')
      .eq('user_id', userId)
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  },

  async getAIBuilderSessions(userId: string, limit = 10) {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('ai_builder_chat')
      .select('session_id, created_at')
      .eq('user_id', userId)
      .eq('role', 'user')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    const sessions = data.reduce(
      (acc, curr) => {
        if (!acc[curr.session_id]) {
          acc[curr.session_id] = curr.created_at;
        }
        return acc;
      },
      {} as Record<string, string>
    );

    return Object.entries(sessions).map(([sessionId, createdAt]) => ({
      session_id: sessionId,
      created_at: createdAt,
    }));
  },

  async saveAIAnalyticsMessage(
    userId: string,
    formId: string,
    sessionId: string,
    role: 'user' | 'assistant' | 'system',
    content: string,
    metadata: Record<string, any> = {}
  ) {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('ai_analytics_chat')
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
      .from('ai_analytics_chat')
      .select('*')
      .eq('user_id', userId)
      .eq('form_id', formId)
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  },

  async getAIAnalyticsSessions(userId: string, formId: string, limit = 10) {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('ai_analytics_chat')
      .select('session_id, form_id, created_at')
      .eq('user_id', userId)
      .eq('role', 'user')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    const sessions = data.reduce(
      (acc, curr) => {
        if (!acc[curr.session_id]) {
          acc[curr.session_id] = {
            session_id: curr.session_id,
            form_id: curr.form_id,
            created_at: curr.created_at,
          };
        }
        return acc;
      },
      {} as Record<string, any>
    );

    return Object.values(sessions);
  },

  async getUser(email: string) {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) throw error;
    return data;
  },

  async createOrUpdateUser(
    uid: string,
    email: string,
    name: string,
    has_premium = false,
    polar_customer_id: string | null = null
  ) {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('users')
      .upsert(
        {
          uid,
          name,
          email,
          has_premium,
          polar_customer_id,
        },
        {
          onConflict: 'email',
        }
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateUserPremiumStatus(email: string, has_premium: boolean) {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('users')
      .update({ has_premium })
      .eq('email', email)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserByEmail(email: string) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) throw error;
    return data;
  },

  async updatePremiumStatus(email: string, hasPremium: boolean) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('users')
      .update({ has_premium: hasPremium })
      .eq('email', email)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updatePolarCustomerId(email: string, polarCustomerId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('users')
      .update({ polar_customer_id: polarCustomerId })
      .eq('email', email)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateUserProfile(email: string, updates: { name?: string }) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('email', email)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async countFormSubmissions(formId: string) {
    const supabase = await createServerClient();
    const { count, error } = await supabase
      .from('form_submissions')
      .select('id', { count: 'exact', head: true })
      .eq('form_id', formId);
    if (error) throw error;
    return count || 0;
  },
};
