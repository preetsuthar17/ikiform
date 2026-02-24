import { Plus, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import type { EmptyStateProps } from "../types";

interface EmptyStateExtendedProps extends EmptyStateProps {
	onCreateWithAI: () => void;
	onCreateManually: () => void;
}

export const EmptyState = memo(function EmptyState({
	onCreateForm,
	onCreateWithAI,
	onCreateManually,
}: EmptyStateExtendedProps) {
	const t = useTranslations("dashboard.formsManagement.emptyState");

	const handleCreateWithAI = useCallback(() => {
		onCreateWithAI();
	}, [onCreateWithAI]);

	const handleCreateManually = useCallback(() => {
		onCreateManually();
	}, [onCreateManually]);

	return (
		<Card
			aria-label={t("aria")}
			className="p-16 text-center shadow-none"
			role="region"
		>
			<div className="mx-auto flex max-w-md flex-col gap-6">
				<div
					aria-hidden="true"
					className="mx-auto flex size-20 items-center justify-center rounded-2xl bg-accent"
				>
					<Plus aria-hidden="true" className="size-10 text-accent-foreground" />
				</div>
				<div className="flex flex-col gap-2">
					<h3 className="font-semibold text-foreground text-xl">
						{t("title")}
					</h3>
					<p className="text-muted-foreground leading-relaxed">
						{t("description")}
					</p>
				</div>
				<Dialog>
					<DialogTrigger asChild>
						<Button
							aria-label={t("createFirstForm")}
							className="flex h-10 w-full items-center gap-2 whitespace-nowrap font-medium"
							onClick={onCreateForm}
						>
							<Plus aria-hidden="true" className="size-5" />
							{t("createFirstForm")}
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-md">
						<DialogHeader>
							<DialogTitle>{t("dialog.title")}</DialogTitle>
							<DialogDescription>
								{t("dialog.description")}
							</DialogDescription>
						</DialogHeader>
						<div className="flex w-full flex-col gap-3 sm:flex-row">
							<Button
								aria-label={t("dialog.createWithAI")}
								className="flex-1"
								onClick={handleCreateWithAI}
								size="lg"
								variant="default"
							>
								<Sparkles aria-hidden="true" className="size-4" />
								{t("dialog.createWithAI")}
							</Button>
							<Button
								aria-label={t("dialog.createManually")}
								className="flex-1"
								onClick={handleCreateManually}
								size="lg"
								variant="secondary"
							>
								{t("dialog.createManually")}
							</Button>
						</div>
					</DialogContent>
				</Dialog>
			</div>
		</Card>
	);
});
