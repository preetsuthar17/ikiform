import type React from "react";
import { cn } from "@/lib/utils";
import type { WizardStep } from "../types";

interface StepIndicatorProps {
  currentStep: WizardStep;
  completedSteps: WizardStep[];
}

const steps: { id: WizardStep }[] = [
  { id: "type" },
  { id: "configure" },
  { id: "review" },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  completedSteps,
}) => {
  const currentStepIdx = steps.findIndex((s) => s.id === currentStep);

  return (
    <nav
      aria-label="Progress"
      className="w-full"
    >
      <ol className="flex items-center w-full gap-2 sm:gap-4">
        {steps.map((step, idx) => {
          const completed =
            completedSteps.includes(step.id) || idx < currentStepIdx;
          const current = idx === currentStepIdx;
          return (
            <li key={step.id} className="flex-1 flex flex-col items-center min-w-0">
              <div
                className={cn(
                  "h-2 w-full rounded transition-colors min-w-[48px] sm:min-w-[80px]",
                  completed
                    ? "bg-primary"
                    : current
                    ? "bg-primary/50"
                    : "bg-muted-foreground/30"
                )}
                aria-current={current ? "step" : undefined}
                tabIndex={0}
                aria-label={
                  completed
                    ? `Step ${idx + 1} completed`
                    : current
                    ? `Step ${idx + 1} current`
                    : `Step ${idx + 1}`
                }
                role="progressbar"
                style={{
                
                  outlineOffset: current ? 2 : undefined,
                }}
              />
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
