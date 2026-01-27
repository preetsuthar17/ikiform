import { useEffect, useRef, useState } from "react";
import { useFormProgress } from "@/hooks/form-progress";
import { usePrepopulation } from "@/hooks/prepopulation/usePrepopulation";
import { toast } from "@/hooks/use-toast";

import type { FormBlock, FormField, FormSchema } from "@/lib/database";

import type { FormActions, FormState } from "../types";
import { submitForm } from "../utils/form-utils";

import { validateStep } from "../utils/validation";

const getDefaultValueForField = (field: FormField): any => {
	switch (field.type) {
		case "tags":
			return [];
		case "checkbox":
			return [];
		case "radio":
			return "";
		case "select":
			return "";
		case "slider":
			return field.settings?.defaultValue || 50;
		case "rating":
			return null;
		case "number":
			return "";
		case "text":
		case "email":
		case "textarea":
		default:
			return "";
	}
};

const initializeFormData = (blocks: FormBlock[]): Record<string, any> => {
	const formData: Record<string, any> = {};

	blocks.forEach((block) => {
		block.fields?.forEach((field) => {
			formData[field.id] = getDefaultValueForField(field);
		});
	});

	return formData;
};

export const useFormState = (
	formId: string,
	schema: FormSchema,
	blocks: FormBlock[]
): FormState &
	FormActions & {
		fieldVisibility: Record<string, { visible: boolean; disabled: boolean }>;
		logicMessages: string[];
	} => {
	const [currentStep, setCurrentStep] = useState(0);
	const [formData, setFormData] = useState<Record<string, any>>({});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [submitting, setSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [isLoadingProgress, setIsLoadingProgress] = useState(true);
	const [duplicateError, setDuplicateError] = useState<{
		message: string;
		timeRemaining?: number;
		attemptsRemaining?: number;
	} | null>(null);
	const initializedFieldsRef = useRef<Set<string>>(new Set());

	const totalSteps = blocks.length;

	const allFields = blocks.flatMap((block) => block.fields || []);

	const {
		progress,
		loading: progressLoading,
		saving: progressSaving,
		error: progressError,
		saveProgress,
		loadProgress,
		clearProgress,
	} = useFormProgress(formId, allFields.length, {
		enabled: true,
		storage: "localStorage",
		autoSaveInterval: 3000,
		retentionDays: 7,
	});

	const {
		prepopulatedData,
		loading: prepopLoading,
		errors: prepopErrors,
	} = usePrepopulation(allFields);

	useEffect(() => {
		if (formId) {
			loadProgress();
		}
	}, [formId, loadProgress]);

	useEffect(() => {
		const allFieldIds = new Set<string>();
		blocks.forEach((block) => {
			block.fields?.forEach((field) => {
				allFieldIds.add(field.id);
			});
		});

		const newFieldIds = [...allFieldIds].filter(
			(id) => !initializedFieldsRef.current.has(id)
		);

		if (newFieldIds.length > 0) {
			const newFormData = { ...formData };
			blocks.forEach((block) => {
				block.fields?.forEach((field) => {
					if (newFieldIds.includes(field.id)) {
						const prepopValue = prepopulatedData[field.id];
						newFormData[field.id] =
							prepopValue !== undefined
								? prepopValue
								: getDefaultValueForField(field);
					}
				});
			});
			setFormData(newFormData);
			newFieldIds.forEach((id) => initializedFieldsRef.current.add(id));
		}
	}, [blocks.length, prepopulatedData, formData]);

	useEffect(() => {
		if (Object.keys(prepopulatedData).length > 0) {
			setFormData((prevFormData) => {
				const updatedFormData = { ...prevFormData };
				let hasChanges = false;

				Object.entries(prepopulatedData).forEach(([fieldId, value]) => {
					if (
						fieldId in updatedFormData &&
						(updatedFormData[fieldId] === "" ||
							updatedFormData[fieldId] ===
								getDefaultValueForField(
									allFields.find((f) => f.id === fieldId)!
								))
					) {
						updatedFormData[fieldId] = value;
						hasChanges = true;
					}
				});

				return hasChanges ? updatedFormData : prevFormData;
			});
		}
	}, [prepopulatedData, allFields]);

	useEffect(() => {
		Object.entries(prepopErrors).forEach(([fieldId, error]) => {
			const field = allFields.find((f) => f.id === fieldId);
			const fieldLabel = field?.label || "Field";
		});
	}, [prepopErrors, allFields]);

	useEffect(() => {
		if (isLoadingProgress) {
			if (progress && Object.keys(progress.formData).length > 0) {
				setFormData((prevFormData) => {
					const hasUserInput = Object.entries(prevFormData).some(
						([fieldId, value]) => {
							const field = allFields.find((f) => f.id === fieldId);
							if (!field) return false;

							const defaultValue = getDefaultValueForField(field);

							if (Array.isArray(value) && Array.isArray(defaultValue)) {
								return value.length > 0;
							}

							return (
								value !== defaultValue &&
								value !== "" &&
								value !== null &&
								value !== undefined
							);
						}
					);

					if (!hasUserInput) {
						return { ...prevFormData, ...progress.formData };
					}
					return prevFormData;
				});

				if (progress.currentStep >= 0 && progress.currentStep < totalSteps) {
					setCurrentStep(progress.currentStep);
				}
			}

			setIsLoadingProgress(false);
		}
	}, [progress, totalSteps, allFields, isLoadingProgress]);

	useEffect(() => {
		if (Object.keys(formData).length > 0) {
			const filledFields = Object.values(formData).filter(
				(value) =>
					value !== "" &&
					value !== null &&
					value !== undefined &&
					!(Array.isArray(value) && value.length === 0)
			).length;

			if (filledFields > 0) {
				saveProgress(formData, currentStep);
			}
		}
	}, [formData, currentStep, saveProgress]);

	const logicActions: any[] = [];

	const fieldVisibility: Record<
		string,
		{ visible: boolean; disabled: boolean }
	> = {};
	blocks.forEach((block) => {
		block.fields.forEach((field) => {
			fieldVisibility[field.id] = { visible: true, disabled: false };
		});
	});
	const logicMessages: string[] = [];

	const actionsByField: Record<string, any[]> = {};
	logicActions.forEach((action) => {
		if (action.target) {
			if (!actionsByField[action.target]) actionsByField[action.target] = [];
			actionsByField[action.target].push(action);
		}
	});

	Object.entries(fieldVisibility).forEach(([fieldId, vis]) => {
		const actions = actionsByField[fieldId] || [];
		if (actions.some((a) => a.type === "hide")) {
			vis.visible = false;
		} else if (actions.some((a) => a.type === "show")) {
			vis.visible = true;
		}
		if (actions.some((a) => a.type === "disable")) {
			vis.disabled = true;
		} else if (actions.some((a) => a.type === "enable")) {
			vis.disabled = false;
		}
	});

	logicActions.forEach((action) => {
		if (
			action.target &&
			fieldVisibility[action.target] &&
			action.type === "set_value" &&
			typeof action.target === "string" &&
			Object.hasOwn(formData, action.target) &&
			formData[action.target] !== action.value
		)
			setFormData((prev) => ({
				...prev,
				[action.target as string]: action.value,
			}));
		if (action.type === "show_message" && action.value) {
			logicMessages.push(String(action.value));
		}
	});

	const handleFieldValueChange = (fieldId: string, value: any) => {
		setFormData((prev) => ({ ...prev, [fieldId]: value }));
		if (errors[fieldId]) {
			setErrors((prev) => ({ ...prev, [fieldId]: "" }));
		}
	};

	const handleNext = () => {
		const { errors: validationErrors, isValid } = validateStep(
			currentStep,
			blocks,
			formData,
			fieldVisibility
		);

		if (!isValid) {
			setErrors(validationErrors);
			return;
		}

		setErrors({});

		if (currentStep < totalSteps - 1) {
			setCurrentStep(currentStep + 1);
		} else {
			handleSubmit();
		}
	};

	const handlePrevious = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	};

	const handleSubmit = async () => {
		let allValid = true;
		const allErrors: Record<string, string> = {};

		for (let stepIndex = 0; stepIndex < blocks.length; stepIndex++) {
			const { errors: stepErrors, isValid } = validateStep(
				stepIndex,
				blocks,
				formData,
				fieldVisibility
			);

			if (!isValid) {
				allValid = false;
				Object.assign(allErrors, stepErrors);
			}
		}

		if (!allValid) {
			setErrors(allErrors);
			return;
		}

		setSubmitting(true);
		setDuplicateError(null);

		try {
			const result = await submitForm(formId, formData);

			if (result.success) {
				setSubmitted(true);
				clearProgress();
				toast.success("Form submitted successfully!");

				if (schema.settings.redirectUrl) {
					setTimeout(() => {
						window.location.href = schema.settings.redirectUrl!;
					}, 2000);
				}
			} else if (result.error === "Duplicate submission detected") {
				setDuplicateError({
					message: result.message || "You have already submitted this form.",
					timeRemaining: result.timeRemaining,
					attemptsRemaining: result.attemptsRemaining,
				});
			} else {
				toast.error(result.message || "Failed to submit form");
			}
		} catch (error: any) {
			if (error?.error === "Duplicate submission detected") {
				setDuplicateError({
					message: error.message || "You have already submitted this form.",
					timeRemaining: error.timeRemaining,
					attemptsRemaining: error.attemptsRemaining,
				});
			} else {
				toast.error("Failed to submit form. Please try again.");
			}
		} finally {
			setSubmitting(false);
		}
	};

	return {
		currentStep,
		formData,
		errors,
		submitting,
		submitted,
		duplicateError,
		progress,
		progressLoading,
		progressSaving,
		progressError,
		setCurrentStep,
		setFormData,
		setErrors,
		setSubmitting,
		setSubmitted,
		handleFieldValueChange,
		handleNext,
		handlePrevious,
		handleSubmit,
		clearProgress,
		fieldVisibility,
		logicMessages,
	};
};
