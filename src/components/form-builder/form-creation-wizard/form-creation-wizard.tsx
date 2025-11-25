"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

import { createDefaultFormSchema } from "@/lib/forms";
import {
	FormConfigurationStep,
	FormReviewStep,
	FormTypeCard,
	StepIndicator,
} from "./components";

import { FORM_TYPES } from "./constants";

import { useFormCreationWizard } from "./hooks/useFormCreationWizard";

import type {
	FormConfiguration,
	FormCreationWizardProps,
	WizardStep,
} from "./types";

export const FormCreationWizard: React.FC<FormCreationWizardProps> = ({
	isOpen,
	onClose,
	onFormTypeSelect,
}) => {
	const { selectedType, selectType, resetSelection } = useFormCreationWizard();
	const [currentStep, setCurrentStep] = useState<WizardStep>("type");
	const [completedSteps, setCompletedSteps] = useState<WizardStep[]>([]);
	const [configuration, setConfiguration] = useState<FormConfiguration>({
		title: "",
		description: "",
		type: "single",
	});

	const handleConfigurationChange = (updates: Partial<FormConfiguration>) => {
		setConfiguration((prev) => ({ ...prev, ...updates }));
	};

	const handleNext = () => {
		if (currentStep === "type" && selectedType) {
			setConfiguration((prev) => ({ ...prev, type: selectedType }));
			setCompletedSteps((prev) => [...prev, "type"]);
			setCurrentStep("configure");
		} else if (currentStep === "configure") {
			setCompletedSteps((prev) => [...prev, "configure"]);
			setCurrentStep("review");
		}
	};

	const handleBack = () => {
		if (currentStep === "configure") {
			setCurrentStep("type");
		} else if (currentStep === "review") {
			setCurrentStep("configure");
		}
	};

	const handleEditStep = (step: WizardStep) => {
		setCurrentStep(step);
	};

	const handleFinish = () => {
		if (!configuration.type) return;

		const baseSchema = createDefaultFormSchema({
			title: configuration.title || "",
			publicTitle: configuration.publicTitle || "",
			description: configuration.description || "",
			multiStep: configuration.type === "multi",
		});

		onFormTypeSelect(baseSchema);
		onClose();
		resetWizard();
	};

	const handleClose = () => {
		onClose();
		resetWizard();
	};

	const resetWizard = () => {
		resetSelection();
		setCurrentStep("type");
		setCompletedSteps([]);
		setConfiguration({
			title: "",
			description: "",
			type: "single",
		});
	};

	const canContinue = () => {
		if (currentStep === "type") return !!selectedType;
		if (currentStep === "configure") return !!configuration.title.trim();
		return true;
	};

	const renderStepContent = () => {
		switch (currentStep) {
			case "type":
				return (
					<div className="flex flex-col gap-6">
						<div className="grid gap-6 sm:grid-cols-2">
							{FORM_TYPES.map((type) => (
								<FormTypeCard
									isSelected={selectedType === type.id}
									key={type.id}
									onSelect={selectType}
									type={type}
								/>
							))}
						</div>
					</div>
				);
			case "configure":
				return (
					<FormConfigurationStep
						configuration={configuration}
						onConfigurationChange={handleConfigurationChange}
					/>
				);
			case "review":
				return (
					<FormReviewStep
						configuration={configuration}
						onEditStep={handleEditStep}
					/>
				);
			default:
				return null;
		}
	};

	const renderActions = () => (
		<div className="flex items-center justify-between">
			<Button
				onClick={currentStep === "type" ? handleClose : handleBack}
				variant="outline"
			>
				{currentStep === "type" ? "Cancel" : "Back"}
			</Button>

			<div className="flex items-center gap-2">
				{currentStep === "review" ? (
					<Button className="min-w-[100px]" onClick={handleFinish}>
						Create Form
					</Button>
				) : (
					<Button
						className="min-w-[100px]"
						disabled={!canContinue()}
						onClick={handleNext}
					>
						{currentStep === "configure" ? "Review" : "Next"}
					</Button>
				)}
			</div>
		</div>
	);

	return (
		<Dialog onOpenChange={handleClose} open={isOpen}>
			<DialogContent className="flex w-[95%] max-w-6xl flex-col gap-6">
				<DialogHeader>
					<DialogTitle className="w-fit text-left">
						Create a New Form
					</DialogTitle>
				</DialogHeader>

				<div className="flex flex-col gap-6 p-3">
					<StepIndicator
						completedSteps={completedSteps}
						currentStep={currentStep}
					/>

					{renderStepContent()}

					{renderActions()}
				</div>
			</DialogContent>
		</Dialog>
	);
};
