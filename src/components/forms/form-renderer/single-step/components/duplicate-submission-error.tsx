import { AlertCircle, Clock, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

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
	const t = useTranslations(
		"product.formBuilder.formRenderer.duplicateSubmission"
	);
	const hasTimeRestriction = !!timeRemaining && timeRemaining > 0;
	const hasAttemptRestriction =
		attemptsRemaining !== undefined && attemptsRemaining > 0;
	const canRetry = onRetry && (!hasTimeRestriction || timeRemaining === 0);
	const formatTimeRemainingLocalized = (seconds: number) => {
		if (seconds < 60) {
			return t("units.seconds", { count: seconds });
		}
		if (seconds < 3600) {
			const minutes = Math.ceil(seconds / 60);
			return t("units.minutes", { count: minutes });
		}
		if (seconds < 86_400) {
			const hours = Math.ceil(seconds / 3600);
			return t("units.hours", { count: hours });
		}
		const days = Math.ceil(seconds / 86_400);
		return t("units.days", { count: days });
	};

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
							{t("title")}
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
										{t("wait", {
											time: formatTimeRemainingLocalized(timeRemaining),
										})}
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
										{t("attemptsLeft", { count: attemptsRemaining })}
									</span>
								</div>
							)}
						</div>
					)}

					{canRetry && (
						<Button className="w-fit" onClick={onRetry} variant="destructive">
							<RefreshCw className="size-4 shrink-0" />
							{t("tryAgain")}
						</Button>
					)}

					{!canRetry && hasTimeRestriction && (
						<div className="text-muted-foreground text-xs">
							{t("waitBeforeRetry")}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
