import { AnimatePresence, motion } from "motion/react";
import {
	BarChart3,
	Code,
	EyeOff,
	Globe,
	MoreHorizontal,
	Save,
	Settings as SettingsIcon,
	Share,
	Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type React from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { FORM_BUILDER_CONSTANTS } from "../constants";
import type { FormBuilderHeaderProps } from "../types";

export const FormBuilderHeader: React.FC<FormBuilderHeaderProps> = ({
	formSchema,
	autoSaving,
	saving,
	publishing,
	isPublished,
	formId,
	onModeToggle,
	onJsonView,
	onAnalytics,
	onShare,
	onSettings,
	onPublish,
	onSave,
	onBlockAdd,
}) => {
	const t = useTranslations("product.formBuilder.header");
	const fieldCount = formSchema.fields.length;

	return (
		<header
			className="z-20 shrink-0 border-border border-b bg-card px-4 py-3 md:py-4"
			style={{ minHeight: FORM_BUILDER_CONSTANTS.HEADER_HEIGHT }}
		>
			<div className="flex h-full flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-0">
				<div className="flex items-center gap-3 md:gap-4">
					<h1
						aria-hidden="true"
						className="absolute font-semibold text-foreground text-xl opacity-0"
					>
						{t("title")}
					</h1>
					<div className="flex items-center gap-2 px-2 md:gap-3">
						<Button asChild className="font-medium text-sm" variant="outline">
							<Link className="z-1 flex items-center" href="/dashboard">
								{t("goToDashboard")}
							</Link>
						</Button>
						<div className="text-muted-foreground text-sm">
							{fieldCount === 1
								? t("fieldCount", { count: fieldCount })
								: t("fieldCount_plural", { count: fieldCount })}
						</div>
						{autoSaving && (
							<div
								aria-live="polite"
								className="flex items-center gap-1 text-muted-foreground text-xs"
								role="status"
							>
								<div className="h-1.5 w-1.5 animate-pulse rounded-2xl bg-primary" />
								<span>{t("saving")}</span>
							</div>
						)}
					</div>
				</div>

				<nav
					aria-label="Form builder actions"
					className="relative w-full px-2 md:hidden"
				>
					<ScrollArea className="w-full">
						<div className="flex items-center justify-start gap-2">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										aria-label={t("moreActions")}
										size="icon"
										variant="outline"
									>
										<MoreHorizontal className="size-3" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start" className="shadow-xs">
									<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
										<div className="flex w-full items-center justify-between gap-4">
											<span className="w-full">{t("multiStepForm")}</span>
											<Switch
												aria-label={t("toggleMultiStepMode")}
												checked={formSchema.settings.multiStep}
												onCheckedChange={() => onModeToggle()}
											/>
										</div>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={onJsonView}>
										<Code className="size-4" /> {t("viewJson")}
									</DropdownMenuItem>
									<DropdownMenuItem disabled={!formId} onClick={onAnalytics}>
										<BarChart3 className="size-4" /> {t("analytics")}
									</DropdownMenuItem>
									<DropdownMenuItem disabled={!formId} onClick={onShare}>
										<Share className="size-4" /> {t("share")}
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link href="/ai-builder">
											<Sparkles className="size-4" /> {t("useKiko")}
										</Link>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>

							<Button
								aria-label={t("settings")}
								onClick={onSettings}
								size="icon"
								variant="outline"
							>
								<SettingsIcon className="size-4" />
							</Button>

							<Tooltip>
								<TooltipTrigger asChild>
									<Button
									aria-label={
										isPublished
											? publishing
												? t("unpublishing")
												: t("published")
											: publishing
												? t("publishing")
												: t("publish")
									}
										className="flex items-center justify-center gap-2"
										disabled={!formId || publishing}
										onClick={onPublish}
										variant={isPublished ? "secondary" : "warning"}
									>
										<span
											aria-hidden
											className="relative inline-flex size-4 items-center justify-center"
										>
											<AnimatePresence initial={false} mode="wait">
												{isPublished ? (
													<motion.span
														animate={{ scale: 1, opacity: 1, rotate: 0 }}
														className="absolute inset-0 grid place-items-center"
														exit={{ scale: 0.85, opacity: 0, rotate: 8 }}
														initial={{ scale: 0.85, opacity: 0, rotate: -8 }}
														key="published"
														transition={{ duration: 0.1, ease: "easeOut" }}
													>
														<Globe className="size-4" />
													</motion.span>
												) : (
													<motion.span
														animate={{ scale: 1, opacity: 1, rotate: 0 }}
														className="absolute inset-0 grid place-items-center"
														exit={{ scale: 0.85, opacity: 0, rotate: -8 }}
														initial={{ scale: 0.85, opacity: 0, rotate: 8 }}
														key="unpublished"
														transition={{ duration: 0.1, ease: "easeOut" }}
													>
														<EyeOff className="size-4" />
													</motion.span>
												)}
											</AnimatePresence>
										</span>
										<span>
											{isPublished
												? publishing
													? t("unpublishing")
													: t("published")
												: publishing
													? t("publishing")
													: t("publish")}
										</span>
									</Button>
								</TooltipTrigger>
								<TooltipContent
									align="center"
									className="font-medium"
									side="bottom"
								>
									{publishing
										? isPublished
											? t("unpublishing")
											: t("publishing")
										: isPublished
											? t("unpublishForm")
											: t("publishForm")}
								</TooltipContent>
							</Tooltip>

							<Button disabled={saving} loading={saving} onClick={onSave}>
								{!saving && <Save className="size-4 shrink-0" />}
								{saving ? t("saving") : t("saveForm")}
							</Button>
						</div>
					</ScrollArea>
				</nav>

				<nav
					aria-label="Form builder actions"
					className="hidden items-center gap-2 md:flex"
				>
					<div className="flex items-center gap-2">
						<Button disabled={!formId} onClick={onAnalytics} variant="outline">
							<BarChart3 className="size-4 shrink-0" />
							<span className="text-sm">{t("analytics")}</span>
						</Button>
						<Button disabled={!formId} onClick={onShare} variant="outline">
							<Share className="size-4 shrink-0" />
							<span className="text-sm">{t("share")}</span>
						</Button>
						<Button onClick={onSettings} variant="outline">
							<SettingsIcon className="size-4 shrink-0" />
							<span className="text-sm">{t("settings")}</span>
						</Button>
						<DropdownMenu>
							<Tooltip>
								<TooltipTrigger asChild>
									<DropdownMenuTrigger asChild>
										<Button
											aria-label={t("moreActions")}
											size="icon"
											variant="outline"
										>
											<MoreHorizontal className="size-4" />
										</Button>
									</DropdownMenuTrigger>
								</TooltipTrigger>
								<TooltipContent
									align="center"
									className="font-medium"
									side="bottom"
								>
									{t("moreActions")}
								</TooltipContent>
							</Tooltip>
							<DropdownMenuContent align="end" className={"w-full"}>
								<DropdownMenuItem onClick={onJsonView}>
									<Code className="size-4.5" />
									<span className="text-sm">{t("viewJson")}</span>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
									<div className="flex w-full items-center justify-between gap-4">
										{t("multiStepForm")}
										<Switch
											aria-label={t("toggleMultiStepMode")}
											checked={formSchema.settings.multiStep}
											onCheckedChange={() => onModeToggle()}
										/>
									</div>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								aria-label={
									isPublished
										? publishing
											? t("unpublishing")
											: t("published")
										: publishing
											? t("publishing")
											: t("publish")
								}
								disabled={!formId || publishing}
								onClick={onPublish}
								size={"icon"}
								variant={isPublished ? "secondary" : "warning"}
							>
								<span
									aria-hidden
									className="relative inline-flex size-4 items-center justify-center"
								>
									<AnimatePresence initial={false} mode="wait">
										{isPublished ? (
											<motion.span
												animate={{ scale: 1, opacity: 1, rotate: 0 }}
												className="absolute inset-0 grid place-items-center"
												exit={{ scale: 0.85, opacity: 0, rotate: 8 }}
												initial={{ scale: 0.85, opacity: 0, rotate: -8 }}
												key="published"
												transition={{ duration: 0.1, ease: "easeOut" }}
											>
												<Globe className="size-4" />
											</motion.span>
										) : (
											<motion.span
												animate={{ scale: 1, opacity: 1, rotate: 0 }}
												className="absolute inset-0 grid place-items-center"
												exit={{ scale: 0.85, opacity: 0, rotate: -8 }}
												initial={{ scale: 0.85, opacity: 0, rotate: 8 }}
												key="unpublished"
												transition={{ duration: 0.1, ease: "easeOut" }}
											>
												<EyeOff className="size-4" />
											</motion.span>
										)}
									</AnimatePresence>
								</span>
								<span className="sr-only">
									{isPublished
										? publishing
											? t("unpublishing")
											: t("published")
										: publishing
											? t("publishing")
											: t("publish")}
								</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent
							align="center"
							className="font-medium"
							side="bottom"
						>
							{publishing
								? isPublished
									? t("unpublishing")
									: t("publishing")
								: isPublished
									? t("unpublishForm")
									: t("publishForm")}
						</TooltipContent>
					</Tooltip>

					<Button disabled={saving} loading={saving} onClick={onSave}>
						{!saving && <Save className="size-4" />}
						{t("save")}
					</Button>
				</nav>
			</div>
		</header>
	);
};
