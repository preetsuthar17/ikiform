import type React from "react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { validatePhoneNumber } from "@/lib/validation/phone-validation";
import type { BaseFieldProps } from "../types";
import { getBaseClasses } from "../utils";

export function PhoneInputField({
	field,
	value,
	onChange,
	error,
	disabled,
}: BaseFieldProps) {
	const baseClasses = getBaseClasses(field, error);
	const [inputValue, setInputValue] = useState(value || "");
	const [isValidating, setIsValidating] = useState(false);

	useEffect(() => {
		setInputValue(value || "");
	}, [value]);

	const getPhoneValidation = () => validatePhoneNumber(inputValue);

	const getErrorMessage = () => {
		const validation = getPhoneValidation();
		return (
			error || (isValidating && !validation.isValid ? validation.message : "")
		);
	};

	const getPhonePlaceholder = () => field.placeholder || "Enter phone number";

	const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;
		setInputValue(newValue);
		onChange(newValue);
	};

	const handlePhoneInputBlur = () => {
		setIsValidating(true);
	};

	const handlePhoneInputKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>,
	) => {
		if (e.key === "Escape") {
			e.currentTarget.blur();
		}
	};

	return (
		<div className="flex flex-col gap-2">
			<Input
				autoComplete="tel"
				className={`flex gap-2 ${baseClasses}`}
				disabled={disabled}
				id={field.id}
				inputMode="tel"
				name={field.id}
				onBlur={handlePhoneInputBlur}
				onChange={handlePhoneInputChange}
				onKeyDown={handlePhoneInputKeyDown}
				placeholder={getPhonePlaceholder()}
				type="tel"
				value={inputValue}
			/>
			{getErrorMessage() && (
				<span
					aria-live="polite"
					className="text-destructive text-xs"
					role="alert"
				>
					{getErrorMessage()}
				</span>
			)}
		</div>
	);
}
