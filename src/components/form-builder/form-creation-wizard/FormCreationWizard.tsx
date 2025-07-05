"use client";

// External imports
import React from "react";

// Component imports
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { FormTypeCard } from "./components/FormTypeCard";
import { WizardActions } from "./components/WizardActions";

// Hook imports
import { useFormCreationWizard } from "./hooks/useFormCreationWizard";

// Utility imports
import { createDefaultFormSchema } from "@/lib/forms";

// Type imports
import type { FormCreationWizardProps } from "./types";

// Constant imports
import { FORM_TYPES } from "./constants";

export const FormCreationWizard: React.FC<FormCreationWizardProps> = ({
  isOpen,
  onClose,
  onFormTypeSelect,
}) => {
  const { selectedType, selectType, resetSelection } = useFormCreationWizard();

  const handleContinue = () => {
    if (!selectedType) return;

    const baseSchema = createDefaultFormSchema({
      title: "Untitled Form",
      description: "",
      multiStep: selectedType === "multi",
    });

    onFormTypeSelect(baseSchema);
    onClose();
    resetSelection();
  };

  const handleClose = () => {
    onClose();
    resetSelection();
  };

  return (
    <Modal open={isOpen} onOpenChange={handleClose}>
      <ModalContent className="max-w-4xl flex flex-col gap-6">
        <ModalHeader>
          <ModalTitle className="text-left w-fit">Create a New Form</ModalTitle>
        </ModalHeader>

        <div className="p-3 flex flex-col gap-6">
          <p className="text-muted-foreground">
            Choose the type of form you'd like to create. You can always change
            this later.
          </p>

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

          <WizardActions
            onCancel={handleClose}
            onContinue={handleContinue}
            canContinue={!!selectedType}
          />
        </div>
      </ModalContent>
    </Modal>
  );
};
