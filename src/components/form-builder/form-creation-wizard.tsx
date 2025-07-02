"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight, BarChart3, Layers, FileText } from "lucide-react";
import type { FormSchema } from "@/lib/database.types";

interface FormCreationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onFormTypeSelect: (schema: FormSchema) => void;
}

type FormType = "single" | "multi";

export function FormCreationWizard({
  isOpen,
  onClose,
  onFormTypeSelect,
}: FormCreationWizardProps) {
  const [selectedType, setSelectedType] = useState<FormType | null>(null);

  const formTypes = [
    {
      id: "single" as FormType,
      title: "Single Page Form",
      description: "Traditional form with all fields on one page",
      icon: FileText,
      features: [
        "All fields visible at once",
        "Simple submission flow",
        "Best for short forms",
        "Quick to fill out",
      ],
      preview: (
        <div className="space-y-3 p-4 bg-muted/20 rounded-lg">
          <div className="h-3 bg-muted rounded w-3/4"></div>
          <div className="h-8 bg-muted/60 rounded"></div>
          <div className="h-8 bg-muted/60 rounded"></div>
          <div className="h-8 bg-muted/60 rounded"></div>
          <div className="h-10 bg-primary/20 rounded w-24"></div>
        </div>
      ),
    },
    {
      id: "multi" as FormType,
      title: "Multi-Step Form",
      description: "Guided form experience with multiple steps",
      icon: Layers,
      features: [
        "Step-by-step guidance",
        "Progress tracking",
        "Better user experience",
        "Ideal for longer forms",
      ],
      preview: (
        <div className="space-y-3 p-4 bg-muted/20 rounded-lg">
          <div className="h-2 bg-primary rounded-full w-1/3"></div>
          <div className="text-xs text-muted-foreground">Step 1 of 3</div>
          <div className="h-3 bg-muted rounded w-2/3"></div>
          <div className="h-8 bg-muted/60 rounded"></div>
          <div className="h-8 bg-muted/60 rounded"></div>
          <div className="flex justify-between">
            <div className="h-8 bg-muted/40 rounded w-16"></div>
            <div className="h-8 bg-primary/20 rounded w-16"></div>
          </div>
        </div>
      ),
    },
  ];

  const handleTypeSelect = (type: FormType) => {
    setSelectedType(type);
  };

  const handleContinue = () => {
    if (!selectedType) return;

    const baseSchema: FormSchema = {
      blocks: [],
      fields: [],
      settings: {
        title: "Untitled Form",
        description: "",
        submitText: "Submit",
        successMessage: "Thank you for your submission!",
        redirectUrl: "",
        multiStep: selectedType === "multi",
        showProgress: selectedType === "multi",
      },
    };

    if (selectedType === "single") {
      // Single page form with one default block
      baseSchema.blocks = [
        {
          id: "default",
          title: "Form Fields",
          description: "",
          fields: [],
        },
      ];
    } else {
      // Multi-step form starts with first step
      baseSchema.blocks = [
        {
          id: "step-1",
          title: "Step 1",
          description: "First step of your form",
          fields: [],
        },
      ];
    }

    onFormTypeSelect(baseSchema);
    onClose();
    setSelectedType(null);
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
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
            {formTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;

              return (
                <Card
                  key={type.id}
                  className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-md w-full  ${
                    isSelected
                      ? "ring-2 ring-primary bg-primary/5"
                      : "hover:bg-muted/30"
                  }`}
                  onClick={() => handleTypeSelect(type.id)}
                >
                  <div className="flex items-start justify-between grow w-full">
                    <div className="flex items-center gap-3 max-sm:flex-col max-sm:justify-center max-sm:text-center w-full">
                      <div
                        className={`p-2 rounded-lg ${
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{type.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {type.description}
                        </p>
                      </div>
                    </div>
                    {/* {isSelected && (
                      <div className="p-1 bg-primary rounded-full">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )} */}
                  </div>

                  <div className="mb-4 max-sm:hidden">
                    <h4 className="font-medium mb-2 text-sm">Features:</h4>
                    <ul className="space-y-1">
                      {type.features.map((feature, index) => (
                        <li
                          key={index}
                          className="text-sm text-muted-foreground flex items-center gap-2"
                        >
                          <div className="w-1 h-1 bg-primary rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className=" max-sm:hidden">{type.preview}</div>
                </Card>
              );
            })}
          </div>

          <div className="flex justify-end gap-3 max-sm:justify-center">
            <Button
              variant="outline"
              onClick={onClose}
              className="max-sm:w-full grow"
            >
              Cancel
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!selectedType}
              className="gap-2 max-sm:w-full grow"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}
