import { AlertCircle, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatTimeRemaining } from "@/lib/forms/duplicate-prevention";

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
	const hasTimeRestriction = !!timeRemaining && timeRemaining > 0;
	const hasAttemptRestriction =
		attemptsRemaining !== undefined && attemptsRemaining > 0;
	const canRetry = onRetry && (!hasTimeRestriction || timeRemaining === 0);

	return (
		<div className="rounded-md border-l-2 border-l-destructive/10 bg-destructive/2 p-4">
			<div className="flex items-start gap-3">
				<AlertCircle
					aria-hidden="true"
					className="mt-0.5 size-5 text-destructive"
				/>

				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-2">
						<p className="font-semibold text-lg">
							Duplicate Submission Detected
						</p>
						<p className="text-muted-foreground text-sm">{message}</p>
					</div>

					{(hasTimeRestriction || hasAttemptRestriction) && (
						<div className="flex flex-wrap gap-2">
							{hasTimeRestriction && (
								<div className="flex items-center gap-1.5 rounded-md bg-destructive/10 px-2 py-1">
									<Clock
										aria-hidden="true"
										className="size-3 text-destructive"
									/>
									<span className="font-medium text-destructive text-xs">
										Wait {formatTimeRemaining(timeRemaining)}
									</span>
								</div>
							)}

							{hasAttemptRestriction && (
								<div className="flex items-center gap-1.5 rounded-md bg-destructive/10 px-2 py-1">
									<RefreshCw
										aria-hidden="true"
										className="size-3 text-destructive"
									/>
									<span className="font-medium text-destructive text-xs">
										{attemptsRemaining} attempt
										{attemptsRemaining > 1 ? "s" : ""} left
									</span>
								</div>
							)}
						</div>
					)}

					{canRetry && (
						<Button className="w-fit" onClick={onRetry} variant="destructive">
							<RefreshCw className="size-4 shrink-0" />
							Try Again
						</Button>
					)}

					{!canRetry && hasTimeRestriction && (
						<div className="text-muted-foreground text-xs">
							Please wait before attempting to submit again.
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
