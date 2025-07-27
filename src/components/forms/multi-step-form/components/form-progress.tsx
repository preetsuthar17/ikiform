// Libraries
import type React from 'react';

// UI Components
import { Progress } from '@/components/ui/progress';

interface FormProgressProps {
  progress: number;
  totalSteps: number;
  showProgress: boolean;
}

export const FormProgress: React.FC<FormProgressProps> = ({
  progress,
  totalSteps,
  showProgress,
}) => {
  if (totalSteps <= 1 || !showProgress) return null;

  return (
    <div className="flex flex-col gap-2">
      <Progress className="h-2" showValue={false} value={progress} />
    </div>
  );
};
