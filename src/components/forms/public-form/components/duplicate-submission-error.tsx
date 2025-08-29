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
    <Alert variant="destructive" className="flex items-start gap-4 bg-red-100/40">
      <div className="flex flex-col gap-2 w-full">
        <span className="font-semibold text-base flex items-center gap-2">  <AlertCircle className="h-5 w-5 text-destructive" aria-hidden /> You’ve already submitted this form</span>
        <span className="text-sm text-destructive">{message}</span>
        {(!!timeRemaining && timeRemaining > 0) && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-4 w-4" aria-hidden />
            <span>Wait {formatTimeRemaining(timeRemaining)} to try again</span>
          </div>
        )}
        {(attemptsRemaining !== undefined && attemptsRemaining > 0) && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <RefreshCw className="h-4 w-4" aria-hidden />
            <span>{attemptsRemaining} more attempt{attemptsRemaining > 1 ? 's' : ''} allowed</span>
          </div>
        )}
        {onRetry && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onRetry}
            className="w-fit"
          >
            Try Again
          </Button>
        )}
      </div>
    </Alert>
  );
}
