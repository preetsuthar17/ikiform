import { AlertCircle, Clock, RefreshCw } from 'lucide-react';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { formatTimeRemaining } from '@/lib/forms/duplicate-prevention';

interface DuplicateSubmissionErrorProps {
  message: string;
  timeRemaining?: number;
  attemptsRemaining?: number;
  onRetry?: () => void;
}

export function DuplicateSubmissionError({
  message,
  timeRemaining,
  attemptsRemaining,
  onRetry,
}: DuplicateSubmissionErrorProps) {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <p className="flex flex-col gap-3">
        <p>Duplicate Submission Detected</p>
        <p>{message}</p>
        

        {timeRemaining && timeRemaining > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            <span>
              Time remaining: {formatTimeRemaining(timeRemaining)}
            </span>
          </div>
        )}
        
        {attemptsRemaining !== undefined && attemptsRemaining > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <RefreshCw className="h-4 w-4" />
            <span>
              Attempts remaining: {attemptsRemaining}
            </span>
          </div>
        )}
        
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="mt-2"
          >
            Try Again
          </Button>
        )}
      </p>
    </Alert>
  );
}
