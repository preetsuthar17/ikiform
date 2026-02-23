import { ArrowRight, Plus, Sparkles, Upload, type LucideIcon } from "lucide-react";
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
					Your Forms
				</h2>
				<p className="text-muted-foreground">
					Create, manage, and analyze your forms with ease
				</p>
			</div>

			<Dialog onOpenChange={setIsCreateDialogOpen} open={isCreateDialogOpen}>
				<DialogTrigger asChild>
					<Button
						aria-label="Create new form"
						className="flex h-10 w-fit items-center gap-2 whitespace-nowrap font-medium"
						variant="default"
					>
						<Plus aria-hidden="true" className="size-5" />
						Create New Form
					</Button>
				</DialogTrigger>

				<DialogContent className="max-h-[90vh] overflow-hidden sm:p-6 p-4 sm:gap-6 gap-4 sm:max-w-2xl">
					<DialogHeader className="shrink-0">
						<DialogTitle className={"text-xl font-mediumt tracking-tight"}>Create a New Form</DialogTitle>
						<DialogDescription>
							Choose how you want to start. You can generate with AI, build
							manually, or import an encrypted file.
						</DialogDescription>
          </DialogHeader>

					<div className="flex flex-col gap-3">
						<CreateOptionCard
							badge="Most Recommended"
							ctaLabel="Start with AI"
							description="Describe your form and let Kiko AI generate a complete first draft with fields, logic, and structure."
							featured
							icon={Sparkles}
							onClick={handleCreateWithAI}
							title="Use Kiko AI"
						/>

						<div className="grid gap-3 sm:grid-cols-2">
							<CreateOptionCard
								ctaLabel="Build manually"
								description="Start from a blank form and configure fields manually."
								icon={Plus}
								onClick={handleCreateManually}
								title="Create Manually"
							/>
							{onImportSecure && (
								<CreateOptionCard
									ctaLabel="Import file"
									description="Import a passphrase-protected .ikiform file into a new draft form."
									icon={Upload}
									onClick={handleImportFromFile}
									title="Import from File"
								/>
							)}
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</Card>
	);
});
