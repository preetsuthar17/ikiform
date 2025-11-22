import type { FormField } from "@/lib/database";

import { FIELD_TYPES } from "../constants";

export const getFieldHelpers = (field: FormField) => ({
	hasOptions: FIELD_TYPES.OPTION_TYPES.includes(field.type as any),
	isTextType: FIELD_TYPES.TEXT_TYPES.includes(field.type as any),
	isNumberType: field.type === FIELD_TYPES.NUMBER_TYPE,
	isTextareaType: field.type === FIELD_TYPES.TEXTAREA_TYPE,
	isSliderType: field.type === FIELD_TYPES.SLIDER_TYPE,
	isTagsType: field.type === FIELD_TYPES.TAGS_TYPE,
	isSocialType: field.type === FIELD_TYPES.SOCIAL_TYPE,
	isSelectType: field.type === FIELD_TYPES.SELECT_TYPE,
});

export const useFieldUpdates = (
	field: FormField | null,
	onFieldUpdate: (field: FormField) => void,
) => {
	if (!field) {
		return {
			updateField: () => {},
			updateValidation: () => {},
			updateSettings: () => {},
		};
	}

	return {
		updateField: (updates: Partial<FormField>) => {
			onFieldUpdate({ ...field, ...updates });
		},

		updateValidation: (validationUpdates: Partial<FormField["validation"]>) => {
			onFieldUpdate({
				...field,
				validation: { ...field.validation, ...validationUpdates },
			});
		},

		updateSettings: (settingsUpdates: Partial<FormField["settings"]>) => {
			onFieldUpdate({
				...field,
				settings: { ...field.settings, ...settingsUpdates },
			});
		},
	};
};

export const createFieldUpdater = (
	field: FormField,
	onFieldUpdate: (field: FormField) => void,
) => ({
	updateField: (updates: Partial<FormField>) => {
		onFieldUpdate({ ...field, ...updates });
	},

	updateValidation: (validationUpdates: Partial<FormField["validation"]>) => {
		onFieldUpdate({
			...field,
			validation: { ...field.validation, ...validationUpdates },
		});
	},

	updateSettings: (settingsUpdates: Partial<FormField["settings"]>) => {
		onFieldUpdate({
			...field,
			settings: { ...field.settings, ...settingsUpdates },
		});
	},
});

export const createOptionHandlers = (
	field: FormField,
	updateField: (updates: Partial<FormField>) => void,
) => ({
	addOption: () => {
		const currentOptions = field.options || [];
		updateField({
			options: [...currentOptions, `Option ${currentOptions.length + 1}`],
		});
	},

	updateOption: (index: number, value: string) => {
		const newOptions = [...(field.options || [])];
		const trimmedValue = value.trim();
		newOptions[index] = trimmedValue || `Option ${index + 1}`;
		updateField({ options: newOptions });
	},

	removeOption: (index: number) => {
		const newOptions = [...(field.options || [])];
		newOptions.splice(index, 1);
		updateField({ options: newOptions });
	},
});

export const formatFieldType = (type: string): string =>
	type.charAt(0).toUpperCase() + type.slice(1);

export const getPlaceholderText = (
	field: FormField,
	validationType: string,
): string => {
	const { validation } = field;

	switch (validationType) {
		case "minLength":
			return `Must be at least ${validation?.minLength} characters`;
		case "maxLength":
			return `Must be no more than ${validation?.maxLength} characters`;
		case "minValue":
			return `Must be at least ${validation?.min}`;
		case "maxValue":
			return `Must be no more than ${validation?.max}`;
		case "email":
			return "Please enter a valid email address";
		case "number":
			return "Please enter a valid number";
		case "pattern":
			return "Please enter a valid format";
		case "required":
			return "This field is required";
		default:
			return "";
	}
};
