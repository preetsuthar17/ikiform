import type { FormSchema } from "@/lib/database/database.types";

export function getFormTitle(
	schema: FormSchema | null | undefined,
	isPublic = false,
): string {
	if (!(schema && schema.settings)) {
		return "Untitled Form";
	}

	if (isPublic && schema.settings.publicTitle) {
		return schema.settings.publicTitle;
	}
	return schema.settings.title || "Untitled Form";
}

export function getPublicFormTitle(
	schema: FormSchema | null | undefined,
): string {
	return getFormTitle(schema, true);
}

export function getInternalFormTitle(
	schema: FormSchema | null | undefined,
): string {
	return getFormTitle(schema, false);
}
