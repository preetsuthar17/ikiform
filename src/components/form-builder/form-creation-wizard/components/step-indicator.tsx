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
		<nav aria-label="Progress" className="w-full">
			<ol className="flex w-full items-center gap-2 sm:gap-4">
				{steps.map((step, idx) => {
					const completed =
						completedSteps.includes(step.id) || idx < currentStepIdx;
					const current = idx === currentStepIdx;
					return (
						<li
							className="flex min-w-0 flex-1 flex-col items-center"
							key={step.id}
						>
							<div
								aria-current={current ? "step" : undefined}
								aria-label={
									completed
										? `Step ${idx + 1} completed`
										: current
											? `Step ${idx + 1} current`
											: `Step ${idx + 1}`
								}
								className={cn(
									"h-2 w-full min-w-[48px] rounded transition-colors sm:min-w-[80px]",
									completed
										? "bg-primary"
										: current
											? "bg-primary/50"
											: "bg-muted-foreground/30"
								)}
								role="progressbar"
								style={{
									outlineOffset: current ? 2 : undefined,
								}}
								tabIndex={0}
							/>
						</li>
					);
				})}
			</ol>
		</nav>
	);
};
