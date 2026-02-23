import { Layers, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import type { BlockManagerHeaderProps } from "../types";

export function BlockManagerHeader({
	blocksCount,
	onBlockAdd,
}: BlockManagerHeaderProps) {
	const t = useTranslations("product.formBuilder.blockManager.header");

	const handleAddBlock = () => {
		onBlockAdd();
	};

	const handleAddBlockKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			handleAddBlock();
		}
	};

	return (
		<Card className="p-0 shadow-none">
			<CardContent className="p-4">
				<div className="flex flex-wrap gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex min-w-0 flex-1 items-center gap-3">
						<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
							<Layers className="size-5 text-primary" />
						</div>
						<div className="flex min-w-0 flex-wrap gap-1">
							<h3 className="flex flex-wrap items-center gap-1 truncate font-semibold text-base text-foreground sm:text-lg">
								{t("title")}
								<Badge
									className="mb-0.5 xs:mb-0 w-fit text-xs"
									variant="secondary"
								>
									{t("stepsCount", { count: blocksCount })}
								</Badge>
							</h3>
							<div className="flex xs:flex-row flex-col xs:items-center gap-0.5 xs:gap-2">
								<p className="max-w-xs truncate text-muted-foreground text-sm sm:max-w-full">
									{t("description")}
								</p>
							</div>
						</div>
					</div>

					<Button
						aria-label={t("addStepAria")}
						className="w-full gap-2 sm:w-auto"
						onClick={handleAddBlock}
						onKeyDown={handleAddBlockKeyDown}
						size="sm"
						variant="default"
					>
						<Plus className="size-4" />
						{t("addStep")}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
