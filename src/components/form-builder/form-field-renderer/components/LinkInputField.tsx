import type React from "react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { validateUrl } from "@/lib/validation/url-validation";
import type { BaseFieldProps } from "../types";
import { applyBuilderMode, getBaseClasses, getBuilderMode } from "../utils";

export function LinkInputField(props: BaseFieldProps) {
	const { field, value, onChange, error, disabled } = props;
	const builderMode = getBuilderMode(props);
	const baseClasses = getBaseClasses(field, error);
	const [inputValue, setInputValue] = useState(value || "");
	const [isValidating, setIsValidating] = useState(false);

	useEffect(() => {
		setInputValue(value || "");
	}, [value]);

	const getUrlValidation = () => validateUrl(inputValue);

	const getErrorMessage = () => {
		const validation = getUrlValidation();
		return (
			error || (isValidating && !validation.isValid ? validation.message : "")
		);
	};

	const getLinkPlaceholder = () => field.placeholder || "https://";

	const handleLinkInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;
		const trimmed = newValue.trim();
		setInputValue(newValue);
		onChange(trimmed);
	};

	const handleLinkInputBlur = () => {
		setIsValidating(true);
	};

	const handleLinkInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
			autoComplete: "url",
			inputMode: "url" as const,
			onBlur: handleLinkInputBlur,
			onChange: handleLinkInputChange,
			onKeyDown: handleLinkInputKeyDown,
			placeholder: getLinkPlaceholder(),
			type: "url",
			value: inputValue,
		},
		builderMode,
	);

	return (
		<div className="flex flex-col gap-3">
			<div className={builderMode ? "pointer-events-none" : ""}>
				<Card className="border-0 p-0 shadow-none">
					<CardContent className="p-0">
						<Input
							{...inputProps}
							aria-invalid={!!getErrorMessage() || undefined}
						/>
					</CardContent>
				</Card>
			</div>
			{getErrorMessage() && (
				<div
					aria-live="polite"
					className="rounded-md bg-destructive/10 p-3 text-destructive text-sm"
					role="alert"
				>
					{getErrorMessage()}
				</div>
			)}
		</div>
	);
}
