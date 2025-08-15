import { useEffect } from 'react';

interface UseFormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  isStepDisabled?: boolean;
}

export const useFormNavigation = ({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onSubmit,
  isStepDisabled,
}: UseFormNavigationProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isStepDisabled) return;
      if (event.key === 'ArrowRight') {
        onNext();
      } else if (event.key === 'ArrowLeft') {
        onPrevious();
      } else if (event.key === 'Enter') {
        if (currentStep === totalSteps - 1) {
          onSubmit();
        } else {
          onNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, totalSteps, onNext, onPrevious, onSubmit, isStepDisabled]);
};
