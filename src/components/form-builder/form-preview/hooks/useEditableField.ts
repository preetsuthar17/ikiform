import { useEffect, useRef, useState } from "react";

export function useEditableField(
	initialValue: string,
	onSave: (value: string) => void
) {
	const [isEditing, setIsEditing] = useState(false);
	const [tempValue, setTempValue] = useState(initialValue);
	const inputRef = useRef<HTMLInputElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		setTempValue(initialValue);
	}, [initialValue]);

	useEffect(() => {
		if (isEditing) {
			const activeRef = inputRef.current || textareaRef.current;
			activeRef?.focus();
			activeRef?.select();
		}
	}, [isEditing]);

	const handleSave = () => {
		const trimmedValue = tempValue.trim();
		if (trimmedValue !== initialValue) {
			onSave(trimmedValue);
		}
		setIsEditing(false);
	};

	const handleCancel = () => {
		setTempValue(initialValue);
		setIsEditing(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent, isTextarea = false) => {
		const isEnter = e.key === "Enter";
		const isEscape = e.key === "Escape";

		if (isTextarea && isEnter && (e.ctrlKey || e.metaKey)) {
			e.preventDefault();
			handleSave();
		} else if (isTextarea && isEscape) {
			handleCancel();
		} else if (!isTextarea && isEnter) {
			e.preventDefault();
			handleSave();
		} else if (!isTextarea && isEscape) {
			handleCancel();
		}
	};

	return {
		isEditing,
		tempValue,
		inputRef,
		textareaRef,
		setIsEditing,
		setTempValue,
		handleSave,
		handleCancel,
		handleKeyDown,
	};
}
