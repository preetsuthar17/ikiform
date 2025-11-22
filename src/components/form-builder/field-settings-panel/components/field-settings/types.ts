import type { FormField } from "@/lib/database";

export interface FieldSettingsProps {
	field: FormField;
	onUpdateSettings: (updates: Partial<FormField["settings"]>) => void;
	onFieldUpdate: (field: FormField) => void;
}
