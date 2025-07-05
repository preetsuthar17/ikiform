import { useEffect } from "react";

interface UseFormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
}

export const useFormNavigation = ({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onSubmit,
}: UseFormNavigationProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        onNext();
      } else if (event.key === "ArrowLeft") {
        onPrevious();
      } else if (event.key === "Enter") {
        if (currentStep === totalSteps - 1) {
          onSubmit();
        } else {
          onNext();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep, totalSteps, onNext, onPrevious, onSubmit]);
};
