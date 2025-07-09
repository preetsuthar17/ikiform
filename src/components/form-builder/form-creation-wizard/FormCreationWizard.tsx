"use client";

// External imports
import React, { useState } from "react";

// Component imports
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import {
  FormTypeCard,
  WizardActions,
  StepIndicator,
  FormConfigurationStep,
  FormReviewStep,
} from "./components";

// Hook imports
import { useFormCreationWizard } from "./hooks/useFormCreationWizard";

// Utility imports
import { createDefaultFormSchema } from "@/lib/forms";

// Type imports
import type {
  FormCreationWizardProps,
  WizardStep,
  FormConfiguration,
} from "./types";

// Constant imports
import { FORM_TYPES } from "./constants";

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
      title: configuration.title || "Untitled Form",
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
            <div className="grid sm:grid-cols-2 gap-6">
              {FORM_TYPES.map((type) => (
                <FormTypeCard
                  key={type.id}
                  type={type}
                  isSelected={selectedType === type.id}
                  onSelect={selectType}
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

  const renderActions = () => {
    return (
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={currentStep === "type" ? handleClose : handleBack}
        >
          {currentStep === "type" ? "Cancel" : "Back"}
        </Button>

        <div className="flex items-center gap-2">
          {currentStep === "review" ? (
            <Button onClick={handleFinish} className="min-w-[100px]">
              Create Form
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!canContinue()}
              className="min-w-[100px]"
            >
              {currentStep === "configure" ? "Review" : "Next"}
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <Modal open={isOpen} onOpenChange={handleClose}>
      <ModalContent className="max-w-4xl flex flex-col gap-6">
        <ModalHeader>
          <ModalTitle className="text-left w-fit">Create a New Form</ModalTitle>
        </ModalHeader>

        <div className="p-3 flex flex-col gap-6">
          <StepIndicator
            currentStep={currentStep}
            completedSteps={completedSteps}
          />

          {renderStepContent()}

          {renderActions()}
        </div>
      </ModalContent>
    </Modal>
  );
};
