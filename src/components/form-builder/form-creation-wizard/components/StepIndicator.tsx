import { Check, Eye, FileText, Settings } from "lucide-react";
import type React from "react";

import { cn } from "@/lib/utils";

import type { WizardStep } from "../types";

interface StepIndicatorProps {
  currentStep: WizardStep;
  completedSteps: WizardStep[];
}

const steps = [
  {
    id: "type" as WizardStep,
    title: "Choose Type",
    icon: FileText,
    description: "Select form type",
  },
  {
    id: "configure" as WizardStep,
    title: "Configure",
    icon: Settings,
    description: "Set up form details",
  },
  {
    id: "review" as WizardStep,
    title: "Review",
    icon: Eye,
    description: "Review and create",
  },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  completedSteps,
}) => {
  const getCurrentStepIndex = () =>
    steps.findIndex((step) => step.id === currentStep);

  const isStepCompleted = (stepId: WizardStep) =>
    completedSteps.includes(stepId);

  const isStepCurrent = (stepId: WizardStep) => currentStep === stepId;

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex w-full items-center justify-between gap-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = isStepCompleted(step.id);
          const isCurrent = isStepCurrent(step.id);
          const isActive = isCompleted || isCurrent;

          return (
            <div className="flex items-center" key={step.id}>
              {}
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-card border-2 transition-all",
                  isCompleted
                    ? "border-primary bg-primary text-primary-foreground"
                    : isCurrent
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-muted-foreground/30 bg-background text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>

              {}
              <div className="ml-3 hidden sm:block">
                <p
                  className={cn(
                    "font-medium text-sm",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </p>
                <p
                  className={cn(
                    "text-xs",
                    isActive
                      ? "text-muted-foreground"
                      : "text-muted-foreground/60"
                  )}
                >
                  {step.description}
                </p>
              </div>

              {}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-4 h-px w-32",
                    isCompleted || getCurrentStepIndex() > index
                      ? "bg-primary"
                      : "bg-muted-foreground"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
