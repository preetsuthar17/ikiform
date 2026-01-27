import type React from "react";

import { Input } from "@/components/ui/input";

import type { BaseFieldProps } from "../types";

import { applyBuilderMode, getBaseClasses, getBuilderMode } from "../utils";

export function NumberInputField(props: BaseFieldProps) {
	const { field, value, onChange, error, disabled } = props;
	const baseClasses = getBaseClasses(field, error);
	const builderMode = getBuilderMode(props);

	const getNumberPlaceholder = () => field.placeholder || "Enter number";

	const getNumberMaxValue = () => field.validation?.max;

	const getNumberMinValue = () => field.validation?.min;

	const getNumberStepValue = () => field.settings?.step || 1;

	const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;
		onChange(newValue);
	};

	const handleNumberInputKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>
	) => {
		if (e.key === "Escape") {
			e.currentTarget.blur();
		}
	};

	const inputProps = applyBuilderMode(
		{
			className: `flex gap-2 ${baseClasses}`,
			disabled,
			id: field.id,
			name: field.id,
			autoComplete: "off",
			inputMode: "numeric" as const,
			max: getNumberMaxValue(),
			min: getNumberMinValue(),
			step: getNumberStepValue(),
			onChange: handleNumberInputChange,
			onKeyDown: handleNumberInputKeyDown,
			placeholder: getNumberPlaceholder(),
			type: "number",
			value: value || "",
		},
		builderMode
	);

	return (
		<div className="flex flex-col gap-2">
			<Input {...inputProps} />
		</div>
	);
}
