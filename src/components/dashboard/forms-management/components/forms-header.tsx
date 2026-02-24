import { ArrowRight, Plus, Sparkles, Upload, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { memo, useCallback, useState } from "react";
import { Card, Separator } from "@/components/ui";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FormHeaderProps } from "../types";

interface FormsHeaderProps extends FormHeaderProps {
	onCreateManually: () => void;
	onCreateWithAI: () => void;
}

interface CreateOptionCardProps {
	description: string;
	disabled?: boolean;
	icon: LucideIcon;
	onClick: () => void;
	title: string;
	badge?: string;
	ctaLabel?: string;
	featured?: boolean;
}

function CreateOptionCard({
	description,
	disabled,
	icon: Icon,
	onClick,
	title,
	badge,
	ctaLabel = "Continue",
	featured = false,
}: CreateOptionCardProps) {
	return (
		<button
			className={cn(
				"group flex w-full flex-col rounded-xl border px-4 py-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
				featured
					? "min-h-40 border-primary/50 bg-gradient-to-br from-primary/15 via-background to-emerald-500/10 ring-1 ring-primary/20 hover:border-primary/70 hover:from-primary/20 hover:to-emerald-500/15"
					: "min-h-36 bg-card hover:bg-muted/40"
			)}
			disabled={disabled}
			onClick={onClick}
			type="button"
		>
			<div className="mb-3 flex items-start justify-between gap-3">
				<div
					className={cn(
						"inline-flex size-9 items-center justify-center rounded-lg border",
						featured
							? "border-primary/40 bg-primary/15 text-primary"
							: "bg-background text-foreground"
					)}
				>
					<Icon className="size-4" />
				</div>
				{badge && (
					<span
						className={cn(
							"rounded-full px-2 py-0.5 font-medium text-xs",
							featured
								? "bg-primary text-primary-foreground"
								: "bg-primary/10 text-primary"
						)}
					>
						{badge}
					</span>
				)}
			</div>

			<div className="flex-1">
				<div className={cn("font-medium text-sm", featured && "text-foreground")}>
					{title}
				</div>
				<p
					className={cn(
						"mt-1 text-xs leading-relaxed",
						featured ? "text-foreground/75" : "text-muted-foreground"
					)}
				>
					{description}
				</p>
			</div>

			<div
				className={cn(
					"mt-4 flex items-center text-xs transition-colors",
					featured
						? "text-primary group-hover:text-primary/80"
						: "text-muted-foreground group-hover:text-foreground"
				)}
			>
				{ctaLabel}
				<ArrowRight className="ml-1 size-3.5" />
			</div>
		</button>
	);
}

export const FormsHeader = memo(function FormsHeader({
	onCreateWithAI,
	onCreateManually,
	onImportSecure,
}: FormsHeaderProps) {
	const t = useTranslations("dashboard.formsManagement");
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

	const handleCreateWithAI = useCallback(() => {
		setIsCreateDialogOpen(false);
		onCreateWithAI();
	}, [onCreateWithAI]);

	const handleCreateManually = useCallback(() => {
		setIsCreateDialogOpen(false);
		onCreateManually();
	}, [onCreateManually]);

	const handleImportFromFile = useCallback(() => {
		setIsCreateDialogOpen(false);
		onImportSecure?.();
	}, [onImportSecure]);

	return (
		<Card className="flex flex-col justify-between gap-4 p-6 shadow-none sm:flex-row sm:items-center md:p-8">
			<div className="flex flex-col gap-1">
				<h2 className="font-semibold text-2xl text-foreground tracking-tight">
					{t("header.title")}
				</h2>
				<p className="text-muted-foreground">
					{t("header.subtitle")}
				</p>
			</div>

			<Dialog onOpenChange={setIsCreateDialogOpen} open={isCreateDialogOpen}>
				<DialogTrigger asChild>
					<Button
						aria-label={t("header.createNewForm")}
						className="flex h-10 w-fit items-center gap-2 whitespace-nowrap font-medium"
						variant="default"
					>
						<Plus aria-hidden="true" className="size-5" />
						{t("header.createNewForm")}
					</Button>
				</DialogTrigger>

				<DialogContent className="max-h-[90vh] overflow-hidden sm:p-6 p-4 sm:gap-6 gap-4 sm:max-w-2xl">
					<DialogHeader className="shrink-0">
						<DialogTitle className={"text-xl font-mediumt tracking-tight"}>
							{t("header.createDialogTitle")}
						</DialogTitle>
						<DialogDescription>
							{t("header.createDialogDescription")}
						</DialogDescription>
          </DialogHeader>

					<div className="flex flex-col gap-3">
						<CreateOptionCard
							badge={t("createOptions.aiBadge")}
							ctaLabel={t("createOptions.aiCta")}
							description={t("createOptions.aiDescription")}
							featured
							icon={Sparkles}
							onClick={handleCreateWithAI}
							title={t("createOptions.aiTitle")}
						/>

						<div className="grid gap-3 sm:grid-cols-2">
							<CreateOptionCard
								ctaLabel={t("createOptions.manualCta")}
								description={t("createOptions.manualDescription")}
								icon={Plus}
								onClick={handleCreateManually}
								title={t("createOptions.manualTitle")}
							/>
							{onImportSecure && (
								<CreateOptionCard
									ctaLabel={t("createOptions.importCta")}
									description={t("createOptions.importDescription")}
									icon={Upload}
									onClick={handleImportFromFile}
									title={t("createOptions.importTitle")}
								/>
							)}
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</Card>
	);
});
