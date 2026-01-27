"use client";

import { Label } from "@/components/ui";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { Form, FormSubmission } from "@/lib/database";
import { formatDate, getFieldLabel } from "../utils";

interface SubmissionDetailsModalProps {
	isOpen: boolean;
	onClose: () => void;
	submission: FormSubmission | null;
	form: Form;
}

export function SubmissionDetailsModal({
	isOpen,
	onClose,
	submission,
	form,
}: SubmissionDetailsModalProps) {
	if (!submission) return null;

	return (
		<Dialog onOpenChange={onClose} open={isOpen}>
			<DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						Submission Details - {submission.id.slice(-8)}
					</DialogTitle>
				</DialogHeader>

				<div className="flex flex-col gap-6">
					<div className="flex flex-col gap-4">
						<div>
							<Label className="font-medium text-muted-foreground text-sm">
								Submission ID
							</Label>
							<p className="font-mono text-sm">{submission.id}</p>
						</div>
						<div className="flex flex-wrap gap-4">
							<div>
								<Label className="font-medium text-muted-foreground text-sm">
									Submitted At
								</Label>
								<p className="text-sm">{formatDate(submission.submitted_at)}</p>
							</div>
							<div>
								<Label className="font-medium text-muted-foreground text-sm">
									IP Address
								</Label>
								<p className="font-mono text-sm">
									{submission.ip_address || "N/A"}
								</p>
							</div>
						</div>
					</div>

					<Separator />

					<div className="flex flex-col gap-4">
						<h3 className="font-semibold text-lg">Form Data</h3>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							{Object.entries(submission.submission_data).map(
								([fieldId, value]) => {
									const fieldLabel = getFieldLabel(form, fieldId);

									return (
										<div className="flex flex-col gap-2" key={fieldId}>
											<Label className="font-medium text-muted-foreground text-sm">
												{fieldLabel}
											</Label>
											<div className="rounded-lg border border-border bg-muted/50 p-2.5">
												<p className="text-sm">
													{Array.isArray(value)
														? value.join(", ")
														: typeof value === "object" && value !== null
															? JSON.stringify(value, null, 2)
															: String(value) || "—"}
												</p>
											</div>
										</div>
									);
								}
							)}
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
