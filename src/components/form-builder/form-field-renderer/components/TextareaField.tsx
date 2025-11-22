import type React from "react";

import { Textarea } from "@/components/ui/textarea";

import type { BaseFieldProps } from "../types";

import { applyBuilderMode, getBaseClasses, getBuilderMode } from "../utils";

export function TextareaField(props: BaseFieldProps) {
	const { field, value, onChange, error, fieldRef, disabled } = props;
	const baseClasses = getBaseClasses(field, error);
	const builderMode = getBuilderMode(props);

	const handleValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		onChange(e.target.value);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Escape") {
			e.currentTarget.blur();
		}
		if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
			e.preventDefault();
			e.currentTarget.blur();
		}
	};

	const textareaProps = applyBuilderMode(
		{
			className: baseClasses,
			disabled,
			id: field.id,
			name: field.id,
			autoComplete: "off",
			onChange: handleValueChange,
			onKeyDown: handleKeyDown,
			placeholder: field.placeholder,
			ref: fieldRef,
			rows: field.settings?.rows || 4,
			value: value || "",
		},
		builderMode,
	);

	return (
		<div className="flex flex-col gap-2">
			<Textarea {...textareaProps} />
		</div>
	);
}
