import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
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
	const t = useTranslations("product.formBuilder.formSettings.designSection");

	return (
		<Card aria-labelledby="design-title" className="shadow-none" role="region">
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle
							className="flex items-center gap-2 text-lg tracking-tight"
							id="design-title"
						>
							{t("title")}
						</CardTitle>
						<CardDescription>
							{t("description")}
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent className="flex flex-col gap-6">
				<div className="rounded-lg border bg-muted/40 p-4">
					<div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
						<div className="flex-1">
							<h4 className="font-medium text-sm">{t("advancedTitle")}</h4>
							<p className="mt-1 text-muted-foreground text-xs">
								{t("advancedDescription")}
							</p>
						</div>
						<Button
							aria-label={t("openAria")}
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
								{t("openLabel")}
							</a>
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
