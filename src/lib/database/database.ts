import type { Database, FormSchema } from "@/lib/database";
import { ensureDefaultFormSettings } from "@/lib/forms";
import { createClient } from "@/utils/supabase/client";
import { createClient as createServerClient } from "@/utils/supabase/server";

export type Form = Database["public"]["Tables"]["forms"]["Row"];
export type FormSubmission =
	Database["public"]["Tables"]["form_submissions"]["Row"];
export type User = Database["public"]["Tables"]["users"]["Row"];

const cache = new Map<string, { data: any; expires: number }>();
const CACHE_TTL = 5 * 60 * 1000;

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
		const { generateUniqueSlug } = await import("@/lib/utils/slug");

		const slug = generateUniqueSlug(title);

		const { data, error } = await supabase
			.from("forms")
			.insert({
				user_id: userId,
				title,
				slug,
				schema: schemaWithDefaults,
				is_published: false,
			})
			.select()
			.single();

		if (error) throw error;

		const userFormsKey = getCacheKey("getUserForms", userId);
		cache.delete(userFormsKey);

		return data;
	},

	async duplicateForm(formId: string, userId: string) {
		const original = await this.getForm(formId, userId);
		const title = `${original.title || original.schema?.settings?.title || "Untitled Form"} (Copy)`;
		const duplicated = await this.createForm(
			original.user_id,
			title,
			original.schema,
		);
		return duplicated;
	},

	async getUserForms(userId: string) {
		const cacheKey = getCacheKey("getUserForms", userId);
		const cached = getFromCache<Form[]>(cacheKey);
		if (cached) return cached;

		const supabase = createClient();

		const { data, error } = await supabase
			.from("forms")
			.select(
				"id, title, description, is_published, created_at, updated_at, user_id, schema",
			)
			.eq("user_id", userId)
			.order("updated_at", { ascending: false });

		if (error) throw error;

		const forms = data.map((form) => ({
			...form,
			schema: ensureDefaultFormSettings(form.schema || {}),
		}));

		setCache(cacheKey, forms);
		return forms;
	},

	async getUserFormsWithDetails(userId: string) {
		const cacheKey = getCacheKey("getUserFormsWithDetails", userId);
		const cached = getFromCache<Form[]>(cacheKey);
		if (cached) return cached;

		const supabase = createClient();

		const { data, error } = await supabase
			.from("forms")
			.select("*")
			.eq("user_id", userId)
			.order("updated_at", { ascending: false });

		if (error) throw error;

		const forms = data.map((form) => ({
			...form,
			schema: ensureDefaultFormSettings(form.schema),
		}));

		setCache(cacheKey, forms);
		return forms;
	},

	async getForm(formId: string, userId: string) {
		const cacheKey = getCacheKey("getForm", formId, userId);
		const cached = getFromCache<Form>(cacheKey);
		if (cached) return cached;

		const supabase = createClient();

		const { data, error } = await supabase
			.from("forms")
			.select("*")
			.eq("id", formId)
			.eq("user_id", userId)
			.single();

		if (error) throw error;

		const form = {
			...data,
			schema: ensureDefaultFormSettings(data.schema),
		};

		setCache(cacheKey, form);
		return form;
	},

	async getFormBasic(formId: string, userId: string): Promise<Partial<Form>> {
		const cacheKey = getCacheKey("getFormBasic", formId, userId);
		const cached = getFromCache<Partial<Form>>(cacheKey);
		if (cached) return cached;

		const supabase = createClient();

		const { data, error } = await supabase
			.from("forms")
			.select(
				"id, title, description, is_published, user_id, created_at, updated_at",
			)
			.eq("id", formId)
			.eq("user_id", userId)
			.single();

		if (error) throw error;

		setCache(cacheKey, data);
		return data;
	},

	async getMultipleForms(formIds: string[], userId: string) {
		if (formIds.length === 0) return [];

		const cachedForms: Form[] = [];
		const uncachedIds: string[] = [];

		formIds.forEach((id) => {
			const cacheKey = getCacheKey("getForm", id, userId);
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

		const { data, error } = await supabase
			.from("forms")
			.select("*")
			.in("id", uncachedIds)
			.eq("user_id", userId);

		if (error) throw error;

		const fetchedForms = data.map((form) => {
			const processedForm = {
				...form,
				schema: ensureDefaultFormSettings(form.schema),
			};

			const cacheKey = getCacheKey("getForm", form.id, userId);
			setCache(cacheKey, processedForm);

			return processedForm;
		});

		return [...cachedForms, ...fetchedForms];
	},

	async updateForm(formId: string, userId: string, updates: Partial<Form>) {
		const supabase = createClient();

		// Verify ownership before updating
		const { data: formCheck, error: checkError } = await supabase
			.from("forms")
			.select("id")
			.eq("id", formId)
			.eq("user_id", userId)
			.single();

		if (checkError || !formCheck) {
			throw new Error("Form not found or access denied");
		}

		if (updates.title && !updates.slug) {
			const { generateUniqueSlug } = await import("@/lib/utils/slug");
			updates.slug = generateUniqueSlug(updates.title);
		}

		const { data, error } = await supabase
			.from("forms")
			.update({
				...updates,
				updated_at: new Date().toISOString(),
			})
			.eq("id", formId)
			.eq("user_id", userId)
			.select()
			.single();

		if (error) throw error;

		const formCacheKey = getCacheKey("getForm", formId, userId);
		const basicCacheKey = getCacheKey("getFormBasic", formId, userId);
		cache.delete(formCacheKey);
		cache.delete(basicCacheKey);

		if (data.user_id) {
			const userFormsKey = getCacheKey("getUserForms", data.user_id);
			const userFormsDetailKey = getCacheKey(
				"getUserFormsWithDetails",
				data.user_id,
			);
			cache.delete(userFormsKey);
			cache.delete(userFormsDetailKey);
		}

		return data;
	},

	async deleteForm(formId: string, userId: string) {
		const supabase = createClient();

		const form = await this.getFormBasic(formId, userId);

		const { error } = await supabase
			.from("forms")
			.delete()
			.eq("id", formId)
			.eq("user_id", userId);

		if (error) throw error;

		const formCacheKey = getCacheKey("getForm", formId, userId);
		const basicCacheKey = getCacheKey("getFormBasic", formId, userId);
		cache.delete(formCacheKey);
		cache.delete(basicCacheKey);

		if (form.user_id) {
			const userFormsKey = getCacheKey("getUserForms", form.user_id);
			const userFormsDetailKey = getCacheKey(
				"getUserFormsWithDetails",
				form.user_id,
			);
			cache.delete(userFormsKey);
			cache.delete(userFormsDetailKey);
		}
	},

	async togglePublishForm(
		formId: string,
		userId: string,
		isPublished: boolean,
	) {
		const supabase = createClient();

		const { data, error } = await supabase
			.from("forms")
			.update({
				is_published: isPublished,
				updated_at: new Date().toISOString(),
			})
			.eq("id", formId)
			.eq("user_id", userId)
			.select()
			.single();

		if (error) throw error;

		const formCacheKey = getCacheKey("getForm", formId, userId);
		const basicCacheKey = getCacheKey("getFormBasic", formId, userId);
		cache.delete(formCacheKey);
		cache.delete(basicCacheKey);

		if (data.user_id) {
			const userFormsKey = getCacheKey("getUserForms", data.user_id);
			const userFormsDetailKey = getCacheKey(
				"getUserFormsWithDetails",
				data.user_id,
			);
			cache.delete(userFormsKey);
			cache.delete(userFormsDetailKey);
		}

		return data;
	},

	async submitForm(
		formId: string,
		submissionData: Record<string, any>,
		ipAddress?: string,
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

		const submissionsCacheKey = getCacheKey("getFormSubmissions", formId);
		cache.delete(submissionsCacheKey);

		return data;
	},

	async getFormSubmissions(formId: string, userId: string, limit?: number) {
		// Verify form ownership first
		const supabase = createClient();
		const { data: form, error: formError } = await supabase
			.from("forms")
			.select("id")
			.eq("id", formId)
			.eq("user_id", userId)
			.single();

		if (formError || !form) {
			throw new Error("Form not found or access denied");
		}

		const cacheKey = getCacheKey("getFormSubmissions", formId, userId, limit);
		const cached = getFromCache<FormSubmission[]>(cacheKey);
		if (cached) return cached;

		let query = supabase
			.from("form_submissions")
			.select("*")
			.eq("form_id", formId)
			.order("submitted_at", { ascending: false });

		if (limit) {
			query = query.limit(limit);
		}

		const { data, error } = await query;

		if (error) throw error;

		setCache(cacheKey, data);
		return data;
	},

	async getFormSubmissionsPaginated(
		formId: string,
		userId: string,
		page = 1,
		pageSize = 50,
	) {
		// Verify form ownership first
		const supabase = createClient();
		const { data: form, error: formError } = await supabase
			.from("forms")
			.select("id")
			.eq("id", formId)
			.eq("user_id", userId)
			.single();

		if (formError || !form) {
			throw new Error("Form not found or access denied");
		}

		const offset = (page - 1) * pageSize;
		const cacheKey = getCacheKey(
			"getFormSubmissionsPaginated",
			formId,
			userId,
			page,
			pageSize,
		);
		const cached = getFromCache<FormSubmission[]>(cacheKey);
		if (cached) return cached;

		const { data, error } = await supabase
			.from("form_submissions")
			.select("*")
			.eq("form_id", formId)
			.order("submitted_at", { ascending: false })
			.range(offset, offset + pageSize - 1);

		if (error) throw error;

		setCache(cacheKey, data);
		return data;
	},

	async saveAIBuilderMessage(
		userId: string,
		sessionId: string,
		role: "user" | "assistant" | "system",
		content: string,
		metadata: Record<string, any> = {},
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

		const historyCacheKey = getCacheKey(
			"getAIBuilderChatHistory",
			userId,
			sessionId,
		);
		cache.delete(historyCacheKey);

		return data;
	},

	async getAIBuilderChatHistory(userId: string, sessionId: string) {
		const cacheKey = getCacheKey("getAIBuilderChatHistory", userId, sessionId);
		const cached = getFromCache<any[]>(cacheKey);
		if (cached) return cached;

		const supabase = createClient();

		const { data, error } = await supabase
			.from("ai_builder_chat")
			.select("*")
			.eq("user_id", userId)
			.eq("session_id", sessionId)
			.order("created_at", { ascending: true });

		if (error) throw error;

		setCache(cacheKey, data);
		return data;
	},

	async getAIBuilderSessions(userId: string, limit = 10) {
		const cacheKey = getCacheKey("getAIBuilderSessions", userId, limit);
		const cached = getFromCache<any[]>(cacheKey);
		if (cached) return cached;

		const supabase = createClient();

		const { data, error } = await supabase
			.from("ai_builder_chat")
			.select("session_id, created_at")
			.eq("user_id", userId)
			.eq("role", "user")
			.order("created_at", { ascending: false })
			.limit(limit);

		if (error) throw error;

		const sessions = data.reduce(
			(acc, curr) => {
				if (!acc[curr.session_id]) {
					acc[curr.session_id] = curr.created_at;
				}
				return acc;
			},
			{} as Record<string, string>,
		);

		const result = Object.entries(sessions).map(([sessionId, createdAt]) => ({
			session_id: sessionId,
			created_at: createdAt,
		}));

		setCache(cacheKey, result);
		return result;
	},

	async saveAIAnalyticsMessage(
		userId: string,
		formId: string,
		sessionId: string,
		role: "user" | "assistant" | "system",
		content: string,
		metadata: Record<string, any> = {},
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

		const historyCacheKey = getCacheKey(
			"getAIAnalyticsChatHistory",
			userId,
			formId,
			sessionId,
		);
		cache.delete(historyCacheKey);

		return data;
	},

	async getAIAnalyticsChatHistory(
		userId: string,
		formId: string,
		sessionId: string,
	) {
		const cacheKey = getCacheKey(
			"getAIAnalyticsChatHistory",
			userId,
			formId,
			sessionId,
		);
		const cached = getFromCache<any[]>(cacheKey);
		if (cached) return cached;

		const supabase = createClient();

		const { data, error } = await supabase
			.from("ai_analytics_chat")
			.select("*")
			.eq("user_id", userId)
			.eq("form_id", formId)
			.eq("session_id", sessionId)
			.order("created_at", { ascending: true });

		if (error) throw error;

		setCache(cacheKey, data);
		return data;
	},

	async getAIAnalyticsSessions(userId: string, formId: string, limit = 10) {
		const cacheKey = getCacheKey(
			"getAIAnalyticsSessions",
			userId,
			formId,
			limit,
		);
		const cached = getFromCache<any[]>(cacheKey);
		if (cached) return cached;

		const supabase = createClient();

		const { data, error } = await supabase
			.from("ai_analytics_chat")
			.select("session_id, form_id, created_at")
			.eq("user_id", userId)
			.eq("role", "user")
			.order("created_at", { ascending: false })
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
			{} as Record<string, any>,
		);

		const result = Object.values(sessions);
		setCache(cacheKey, result);
		return result;
	},

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

export const formsDbServer = {
	async getPublicForm(identifier: string) {
		const supabase = await createServerClient();
		const { isUUID } = await import("@/lib/utils/slug");

		let query = supabase.from("forms").select("*").eq("is_published", true);

		if (isUUID(identifier)) {
			query = query.eq("id", identifier);
		} else {
			query = query.eq("slug", identifier);
		}

		const { data, error } = await query.single();

		if (error) throw error;

		return {
			...data,
			schema: ensureDefaultFormSettings(data.schema),
		};
	},

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

	async submitForm(
		formId: string,
		submissionData: Record<string, any>,
		ipAddress?: string,
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

	async saveAIBuilderMessage(
		userId: string,
		sessionId: string,
		role: "user" | "assistant" | "system",
		content: string,
		metadata: Record<string, any> = {},
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

	async getAIBuilderSessions(userId: string, limit = 10) {
		const supabase = await createServerClient();

		const { data, error } = await supabase
			.from("ai_builder_chat")
			.select("session_id, created_at")
			.eq("user_id", userId)
			.eq("role", "user")
			.order("created_at", { ascending: false })
			.limit(limit);

		if (error) throw error;

		const sessions = data.reduce(
			(acc, curr) => {
				if (!acc[curr.session_id]) {
					acc[curr.session_id] = curr.created_at;
				}
				return acc;
			},
			{} as Record<string, string>,
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
		role: "user" | "assistant" | "system",
		content: string,
		metadata: Record<string, any> = {},
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
		sessionId: string,
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

	async getAIAnalyticsSessions(userId: string, formId: string, limit = 10) {
		const supabase = await createServerClient();

		const { data, error } = await supabase
			.from("ai_analytics_chat")
			.select("session_id, form_id, created_at")
			.eq("user_id", userId)
			.eq("role", "user")
			.order("created_at", { ascending: false })
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
			{} as Record<string, any>,
		);

		return Object.values(sessions);
	},

	async getUser(email: string) {
		const supabase = await createServerClient();

		const { data, error } = await supabase
			.from("users")
			.select("*")
			.eq("email", email)
			.single();

		if (error) throw error;
		return data;
	},

	async createOrUpdateUser(
		uid: string,
		email: string,
		name: string,
		hasPremium?: boolean,
		polarCustomerId?: string | null,
	) {
		const supabase = await createServerClient();

		const { data: existingUser } = await supabase
			.from("users")
			.select("has_premium, polar_customer_id")
			.eq("email", email)
			.single();

		const { data, error } = await supabase
			.from("users")
			.upsert(
				{
					uid,
					name,
					email,
					has_premium: hasPremium ?? existingUser?.has_premium ?? false,
					polar_customer_id:
						polarCustomerId ?? existingUser?.polar_customer_id ?? null,
				},
				{
					onConflict: "email",
				},
			)
			.select()
			.single();

		if (error) throw error;
		return data;
	},

	async updateUserPremiumStatus(email: string, hasPremium: boolean) {
		const supabase = await createServerClient();

		const { data, error } = await supabase
			.from("users")
			.update({ has_premium: hasPremium })
			.eq("email", email)
			.select()
			.single();

		if (error) throw error;
		return data;
	},

	async getUserByEmail(email: string) {
		const supabase = createClient();

		const { data, error } = await supabase
			.from("users")
			.select("*")
			.eq("email", email)
			.single();

		if (error) throw error;
		return data;
	},

	async updatePremiumStatus(email: string, hasPremium: boolean) {
		const supabase = createClient();

		const { data, error } = await supabase
			.from("users")
			.update({ has_premium: hasPremium })
			.eq("email", email)
			.select()
			.single();

		if (error) throw error;
		return data;
	},

	async updatePolarCustomerId(email: string, polarCustomerId: string) {
		const supabase = createClient();

		const { data, error } = await supabase
			.from("users")
			.update({ polar_customer_id: polarCustomerId })
			.eq("email", email)
			.select()
			.single();

		if (error) throw error;
		return data;
	},

	async updateUserProfile(email: string, updates: { name?: string }) {
		const supabase = createClient();

		const { data, error } = await supabase
			.from("users")
			.update(updates)
			.eq("email", email)
			.select()
			.single();

		if (error) throw error;
		return data;
	},

	async countFormSubmissions(formId: string) {
		const supabase = await createServerClient();
		const { count, error } = await supabase
			.from("form_submissions")
			.select("id", { count: "exact", head: true })
			.eq("form_id", formId);
		if (error) throw error;
		return count || 0;
	},
};
