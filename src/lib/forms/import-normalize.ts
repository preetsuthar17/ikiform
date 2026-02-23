import type { FormSchema } from "@/lib/database";
import { sanitizeString } from "@/lib/utils/sanitize";
import { ensureDefaultFormSettings } from "./form-defaults";
import type { DecryptedFormPayloadV1 } from "./secure-transfer";

export interface SensitiveImportOptions {
	preserveApiSettings: boolean;
	preserveNotificationEmail: boolean;
	preservePasswordProtection: boolean;
}

export interface NormalizedImportedFormData {
	description: string | null;
	schema: FormSchema;
	title: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return !!value && typeof value === "object" && !Array.isArray(value);
}

function sanitizeTitle(value: string): string {
	const cleaned = sanitizeString(value).trim();
	return cleaned || "Imported Form";
}

export function validateDecryptedPayload(
	payload: unknown
): DecryptedFormPayloadV1 {
	if (!isRecord(payload)) {
		throw new Error("Imported payload is invalid.");
	}

	const allowedKeys = new Set([
		"payloadVersion",
		"exportedAt",
		"title",
		"description",
		"schema",
	]);
	for (const key of Object.keys(payload)) {
		if (!allowedKeys.has(key)) {
			throw new Error("Imported payload contains unsupported fields.");
		}
	}

	if (payload.payloadVersion !== 1) {
		throw new Error("Unsupported payload version.");
	}

	if (typeof payload.exportedAt !== "string") {
		throw new Error("Imported payload is missing export metadata.");
	}

	if (typeof payload.title !== "string") {
		throw new Error("Imported payload title is invalid.");
	}

	if (
		!(payload.description === null || typeof payload.description === "string")
	) {
		throw new Error("Imported payload description is invalid.");
	}

	if (!isRecord(payload.schema)) {
		throw new Error("Imported schema is invalid.");
	}

	return {
		payloadVersion: 1,
		exportedAt: payload.exportedAt as string,
		title: payload.title as string,
		description: (payload.description as string | null) ?? null,
		schema: payload.schema as unknown as FormSchema,
	};
}

export function normalizeImportedFormPayload(
	payload: unknown
): NormalizedImportedFormData {
	const validatedPayload = validateDecryptedPayload(payload);

	const schema = ensureDefaultFormSettings(
		validatedPayload.schema as FormSchema
	);

	const schemaTitle =
		typeof schema.settings?.title === "string" ? schema.settings.title : "";
	const title = sanitizeTitle(validatedPayload.title || schemaTitle);

	const descriptionText =
		typeof validatedPayload.description === "string"
			? sanitizeString(validatedPayload.description).trim()
			: "";

	return {
		title,
		description: descriptionText || null,
		schema,
	};
}

export function applySensitiveImportPolicy(
	schema: FormSchema,
	options: SensitiveImportOptions
): FormSchema {
	const nextSchema: FormSchema = {
		...schema,
		settings: {
			...schema.settings,
		},
	};

	if (!options.preserveApiSettings) {
		nextSchema.settings.api = {
			...(nextSchema.settings.api || {}),
			enabled: false,
			apiKey: undefined,
			allowExternalSubmissions: false,
		};
	}

	if (!options.preservePasswordProtection) {
		nextSchema.settings.passwordProtection = {
			...(nextSchema.settings.passwordProtection || {}),
			enabled: false,
			password: "",
		};
	}

	if (!options.preserveNotificationEmail) {
		nextSchema.settings.notifications = {
			...(nextSchema.settings.notifications || {}),
			enabled: false,
			email: "",
		};
	}

	return ensureDefaultFormSettings(nextSchema);
}
