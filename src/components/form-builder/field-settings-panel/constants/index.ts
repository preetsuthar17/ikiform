export const FIELD_TYPES = {
	TEXT_TYPES: ["text", "email", "textarea"],
	OPTION_TYPES: ["radio", "checkbox", "select"],
	NUMBER_TYPE: "number",
	TEXTAREA_TYPE: "textarea",
	SLIDER_TYPE: "slider",
	TAGS_TYPE: "tags",
	SOCIAL_TYPE: "social",
	SELECT_TYPE: "select",
	EMAIL_TYPE: "email",
} as const;

export const FIELD_SIZES = [
	{ value: "sm", label: "Small" },
	{ value: "md", label: "Medium" },
	{ value: "lg", label: "Large" },
] as const;

export const FIELD_WIDTHS = [
	{ value: "full", label: "Full Width" },
	{ value: "half", label: "Half Width" },
	{ value: "third", label: "Third Width" },
	{ value: "quarter", label: "Quarter Width" },
] as const;

export const FIELD_VARIANTS = [
	{ value: "default", label: "Default" },
	{ value: "filled", label: "Filled" },
	{ value: "ghost", label: "Ghost" },
	{ value: "underline", label: "Underline" },
] as const;

export const DEFAULT_VALUES = {
	TEXTAREA_ROWS: 4,
	SLIDER_MIN: 0,
	SLIDER_MAX: 100,
	SLIDER_STEP: 1,
	SLIDER_DEFAULT: 50,
	TAGS_MAX: 10,
	FIELD_SIZE: "md",
	FIELD_WIDTH: "full",
	FIELD_VARIANT: "default",
} as const;

export const FIELD_DESCRIPTIONS = {
	text: "Single line text input for short responses",
	email: "Email address input with built-in validation",
	textarea: "Multi-line text input for longer responses",
	radio: "Radio buttons for selecting one option",
	checkbox: "Checkboxes for selecting multiple options",
	number: "Numeric input with validation",
	select: "Dropdown menu for selecting options",
	slider: "Range slider for numeric values",
	tags: "Input for adding multiple tags",
} as const;
