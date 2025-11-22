import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface DesignSectionProps {
	formId?: string;
}

export function DesignSection({ formId }: DesignSectionProps) {
	return (
		<Card aria-labelledby="design-title" className="shadow-none" role="region">
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle
							className="flex items-center gap-2 text-lg tracking-tight"
							id="design-title"
						>
							Design
						</CardTitle>
						<CardDescription>
							Control appearance and customization
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent className="flex flex-col gap-6">
				<div className="rounded-lg border bg-muted/40 p-4">
					<div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
						<div className="flex-1">
							<h4 className="font-medium text-sm">Advanced customization</h4>
							<p className="mt-1 text-muted-foreground text-xs">
								Fine-tune colors, typography, spacing, and more in a focused
								panel.
							</p>
						</div>
						<Button
							aria-label="Open customization panel in a new tab"
							asChild
							size="sm"
							variant="outline"
						>
							<a
								href={formId ? `/form-builder/${formId}/customize` : undefined}
								rel="noreferrer noopener"
								role="link"
								target="_blank"
							>
								<ExternalLink className="size-4" />
								Open customization panel…
							</a>
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
