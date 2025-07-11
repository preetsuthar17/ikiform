// External imports
import React from "react";

// UI imports
import { cn } from "@/lib/utils";

// Icon imports
import { Check, FileText, Settings, Eye } from "lucide-react";

// Type imports
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
  const getCurrentStepIndex = () => {
    return steps.findIndex((step) => step.id === currentStep);
  };

  const isStepCompleted = (stepId: WizardStep) => {
    return completedSteps.includes(stepId);
  };

  const isStepCurrent = (stepId: WizardStep) => {
    return currentStep === stepId;
  };

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center w-full justify-between space-x-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = isStepCompleted(step.id);
          const isCurrent = isStepCurrent(step.id);
          const isActive = isCompleted || isCurrent;

          return (
            <div key={step.id} className="flex items-center">
              {/* Step Circle */}
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-card border-2 transition-all",
                  isCompleted
                    ? "bg-primary border-primary text-primary-foreground"
                    : isCurrent
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-muted-foreground/30 bg-background text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>

              {/* Step Details */}
              <div className="ml-3 hidden sm:block">
                <p
                  className={cn(
                    "text-sm font-medium",
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

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-32 h-px mx-4",
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
