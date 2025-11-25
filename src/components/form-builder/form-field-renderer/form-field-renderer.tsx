import { FieldWrapper } from "./components";

import type { FormFieldRendererProps } from "./types";

import { createFieldComponent } from "./utils";

export function FormFieldRenderer({
	field,
	value,
	onChange,
	error,
	fieldRef,
	disabled,
	formId,
	builderMode = false,
}: FormFieldRendererProps) {
	return (
		<FieldWrapper builderMode={builderMode} error={error} field={field}>
			<div
				aria-hidden={builderMode ? true : undefined}
				className={builderMode ? "pointer-events-none select-none" : undefined}
				data-builder-mode={builderMode ? "true" : undefined}
				tabIndex={builderMode ? -1 : undefined}
			>
				{createFieldComponent(
					field,
					value,
					onChange,
					error,
					fieldRef,
					disabled,
					formId,
					builderMode,
				)}
			</div>
		</FieldWrapper>
	);
}
