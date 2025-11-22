import {
	BarChart3,
	Code2,
	Copy,
	Edit,
	Eye,
	MoreHorizontal,
	Share,
	Trash2,
} from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";
import { ShareFormModal } from "@/components/form-builder/share-form-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { FormCardProps } from "../types";
import { formatDate } from "../utils";

export const FormCard = memo(function FormCard({
	form,
	onEdit,
	onDuplicate,
	onViewForm,
	onViewAnalytics,
	onShare,
	onDelete,
}: FormCardProps) {
	const [isShareModalOpen, setIsShareModalOpen] = useState(false);
	const [modalJustClosed, setModalJustClosed] = useState(false);

	const formattedDate = useMemo(
		() => formatDate(form.updated_at),
		[form.updated_at],
	);

	const internalTitle = useMemo(
		() => form.schema?.settings?.title || form.title || "Untitled Form",
		[form.schema?.settings?.title, form.title],
	);

	const hasPublicTitle = useMemo(
		() =>
			form.schema?.settings?.publicTitle &&
			form.schema.settings.publicTitle !== form.schema?.settings?.title,
		[form.schema?.settings?.publicTitle, form.schema?.settings?.title],
	);

	const handleShare = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();
			setIsShareModalOpen(true);
			if (onShare) onShare(form);
		},
		[onShare, form],
	);

	const handleCardClick = useCallback(
		(e: React.MouseEvent) => {
			if (
				isShareModalOpen ||
				modalJustClosed ||
				(e.target as HTMLElement).closest('[role="dialog"]')
			) {
				return;
			}
			onViewAnalytics(form.id);
		},
		[isShareModalOpen, modalJustClosed, onViewAnalytics, form.id],
	);

	const handleButtonClick = useCallback((e: React.MouseEvent) => {
		e.stopPropagation();
	}, []);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				onViewAnalytics(form.id);
			}
		},
		[onViewAnalytics, form.id],
	);

	const handleEdit = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();
			onEdit(form.id);
		},
		[onEdit, form.id],
	);

	const handleDuplicate = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();
			onDuplicate(form.id);
		},
		[onDuplicate, form.id],
	);

	const handleViewForm = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();
			onViewForm(form);
		},
		[onViewForm, form],
	);

	const handleViewAnalytics = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();
			onViewAnalytics(form.id);
		},
		[onViewAnalytics, form.id],
	);

	const handleEmbed = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();
			window.open(`/embed?formid=${form.id}`, "_blank");
		},
		[form.id],
	);

	const handleDelete = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();
			onDelete(form.id, form.title);
		},
		[onDelete, form.id, form.title],
	);

	const handleModalClose = useCallback(() => {
		setIsShareModalOpen(false);
		setModalJustClosed(true);
		setTimeout(() => setModalJustClosed(false), 100);
	}, []);

	const handleModalPublish = useCallback(async () => {
		if (onShare) onShare(form);
	}, [onShare, form]);

	return (
		<>
			<Card
				aria-label={`Form: ${internalTitle}`}
				className="group flex cursor-pointer flex-col gap-4 p-6 shadow-none transition-all duration-200 hover:border-primary/30"
				onClick={handleCardClick}
				onKeyDown={handleKeyDown}
				role="article"
				tabIndex={0}
			>
				<div className="flex items-start justify-between gap-6">
					<div className="flex min-w-0 flex-1 flex-col gap-2">
						<h3 className="line-clamp-2 font-semibold text-foreground text-md leading-tight">
							{internalTitle}
						</h3>
						{hasPublicTitle && (
							<p className="line-clamp-1 text-muted-foreground text-sm">
								Public: "{form.schema?.settings?.publicTitle}"
							</p>
						)}
						{form.description && (
							<p className="line-clamp-2 text-muted-foreground text-sm leading-relaxed">
								{form.description}
							</p>
						)}
					</div>
					<div className="flex items-center gap-2">
						<Badge
							aria-label={`Form status: ${form.is_published ? "Published" : "Draft"}`}
							className="flex-shrink-0 rounded-lg font-medium"
							variant={form.is_published ? "default" : "secondary"}
						>
							{form.is_published ? "Published" : "Draft"}
						</Badge>
						<TooltipProvider delayDuration={200}>
							<DropdownMenu>
								<Tooltip>
									<TooltipTrigger asChild>
										<DropdownMenuTrigger asChild>
											<Button
												aria-label={`Actions for ${internalTitle}`}
												className="size-8 p-0 transition-all duration-200 hover:scale-105 hover:bg-muted/80 focus:ring-2 focus:ring-ring focus:ring-offset-2"
												onClick={handleButtonClick}
												size="sm"
												variant="outline"
											>
												<MoreHorizontal aria-hidden="true" className="size-4" />
											</Button>
										</DropdownMenuTrigger>
									</TooltipTrigger>
									<TooltipContent side="top" sideOffset={8}>
										<p>Form actions</p>
									</TooltipContent>
								</Tooltip>
								<DropdownMenuContent align="end" className="w-48 shadow-xs">
									<DropdownMenuItem
										className="h-9 cursor-pointer opacity-80 hover:opacity-100"
										onClick={handleEdit}
									>
										<Edit aria-hidden="true" className="size-4" />
										Edit form
									</DropdownMenuItem>
									<DropdownMenuItem
										className="h-9 cursor-pointer opacity-80 hover:opacity-100"
										onClick={handleShare}
									>
										<Share aria-hidden="true" className="size-4" />
										Share form
									</DropdownMenuItem>
									<DropdownMenuItem
										className="h-9 cursor-pointer opacity-80 hover:opacity-100"
										onClick={handleDuplicate}
									>
										<Copy aria-hidden="true" className="size-4" />
										Duplicate
									</DropdownMenuItem>
									<DropdownMenuItem
										className="h-9 cursor-pointer opacity-80 hover:opacity-100"
										onClick={handleViewForm}
									>
										<Eye aria-hidden="true" className="size-4" />
										View form
									</DropdownMenuItem>
									<DropdownMenuItem
										className="h-9 cursor-pointer opacity-80 hover:opacity-100"
										onClick={handleViewAnalytics}
									>
										<BarChart3 aria-hidden="true" className="size-4" />
										View analytics
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										className="h-9 cursor-pointer opacity-80 hover:opacity-100"
										onClick={handleEmbed}
									>
										<Code2 aria-hidden="true" className="size-4" />
										Embed
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										className="h-9 cursor-pointer text-destructive opacity-80 hover:opacity-100 focus:text-destructive"
										onClick={handleDelete}
										variant="destructive"
									>
										<Trash2
											aria-hidden="true"
											className="size-4 text-destructive focus:text-destructive"
										/>
										Delete form
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</TooltipProvider>
					</div>
				</div>

				<div className="flex items-center justify-start text-muted-foreground text-sm">
					<span>Updated {formattedDate}</span>
				</div>
			</Card>

			<ShareFormModal
				formId={form?.id || null}
				formSlug={form?.slug || null}
				isOpen={isShareModalOpen}
				isPublished={!!form?.is_published}
				onClose={handleModalClose}
				onPublish={handleModalPublish}
			/>
		</>
	);
});
