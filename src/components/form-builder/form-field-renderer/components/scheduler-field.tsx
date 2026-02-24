import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

import type { BaseFieldProps } from "../types";

import { getBaseClasses } from "../utils";

export function SchedulerField({ field, error, disabled }: BaseFieldProps) {
	const t = useTranslations("product.formBuilder.fieldRenderer.scheduler");
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const baseClasses = getBaseClasses(field, error);

	const getSchedulerProvider = () => field.settings?.schedulerProvider;

	const getSchedulerLink = () => {
		const provider = getSchedulerProvider();
		return provider ? field.settings?.schedulerLinks?.[provider] : "";
	};

	const getButtonText = () =>
		field.settings?.schedulerButtonText || t("openScheduler");

	const handleOpenScheduler = () => {
		setIsDialogOpen(true);
	};

	const handleCloseScheduler = () => {
		setIsDialogOpen(false);
	};

	const isSchedulerConfigured = () => {
		const provider = getSchedulerProvider();
		const link = getSchedulerLink();
		return provider && link;
	};

	const renderSchedulerContent = () => {
		if (isSchedulerConfigured()) {
			return (
				<iframe
					allow="camera; microphone; fullscreen"
					className="h-full w-full rounded-xl border-none"
					src={getSchedulerLink()}
					title={t("embedTitle")}
				/>
			);
		}

		return (
			<div className="flex h-full items-center justify-center text-muted-foreground text-sm">
				{t("notConfigured")}
			</div>
		);
	};

	const renderSchedulerButton = () => (
		<Card className="border-0 p-0 shadow-none">
			<CardContent className="p-0">
				<Button
					className={`${baseClasses} flex w-fit items-center justify-center font-medium`}
					disabled={disabled || !getSchedulerProvider()}
					onClick={handleOpenScheduler}
					type="button"
					variant={"secondary"}
				>
					{getButtonText()}
				</Button>
			</CardContent>
		</Card>
	);

	return (
		<div className="flex flex-col gap-3">
			{renderSchedulerButton()}

			<Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
				<DialogContent className="flex h-[95vh] w-full flex-col gap-4 sm:max-w-[95vw]">
					<DialogHeader>
						<DialogTitle>{t("title")}</DialogTitle>
					</DialogHeader>
					<div className="h-full">{renderSchedulerContent()}</div>
					<DialogFooter>
						<Button onClick={handleCloseScheduler} variant="outline">
							{t("close")}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
