import React from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import type { WebhookConfig } from "../hooks/useWebhookManagement";
import { WebhookListItem } from "./webhook-list-item";

interface WebhookListProps {
	webhooks: WebhookConfig[];
	loading: boolean;
	onEdit: (webhook: WebhookConfig) => void;
	onDelete: (id: string) => void;
	onToggleEnabled?: (webhook: WebhookConfig) => void;
	onTest?: (webhook: WebhookConfig) => void;
	onViewLogs?: (webhook: WebhookConfig) => void;
}

export function WebhookList({
	webhooks,
	loading,
	onEdit,
	onDelete,
	onToggleEnabled,
	onTest,
	onViewLogs,
}: WebhookListProps) {
	const t = useTranslations("product.formBuilder.formSettings.webhooks.list");
	const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);

	if (loading)
		return (
			<div className="py-4 text-center">
				<Loader />
			</div>
		);

	if (!webhooks.length)
		return (
			<div className="rounded-lg border border-muted-foreground/25 border-dashed p-6 text-center">
				<p className="text-muted-foreground text-sm">
					{t("emptyState")}
				</p>
			</div>
		);

	return (
		<div className="relative flex flex-col">
			{webhooks.map((webhook, idx) => {
				let cardClass =
					"group flex cursor-pointer flex-col gap-4 shadow-none p-6 hover:bg-accent/50 relative";

				if (webhooks.length === 1) {
					cardClass += " rounded-xl";
				} else if (idx === 0) {
					cardClass += " rounded-t-xl rounded-b-none border-b-0";
				} else if (idx === webhooks.length - 1) {
					cardClass += " rounded-b-xl rounded-t-none border-b";
				} else {
					cardClass += " rounded-none border-b-0";
				}

				let dynamicClasses = "";
				const nextCardShouldRemoveBorderT =
					hoveredIdx !== null && idx > 0 && hoveredIdx === idx - 1;
				const isHovered = hoveredIdx === idx;

				if (webhooks.length > 1 && idx === webhooks.length - 1 && isHovered) {
					dynamicClasses +=
						" border border-primary/30 z-10 rounded-b-xl rounded-t-none";
				} else if (isHovered && idx !== webhooks.length - 1) {
					dynamicClasses += " border-b border-primary/30 z-10";
				}

				if (
					hoveredIdx !== null &&
					idx === webhooks.length - 2 &&
					hoveredIdx === webhooks.length - 1
				) {
					dynamicClasses += " !border-b-0";
				}

				if (nextCardShouldRemoveBorderT) {
					dynamicClasses += " !border-t-0";
				}

				return (
					<Card
						className={`${cardClass}${dynamicClasses ? " " + dynamicClasses : ""}`}
						key={webhook.id}
						onBlur={() => setHoveredIdx(null)}
						onClick={() => onViewLogs?.(webhook)}
						onFocus={() => setHoveredIdx(idx)}
						onMouseEnter={() => setHoveredIdx(idx)}
						onMouseLeave={() => setHoveredIdx(null)}
						tabIndex={0}
					>
						<WebhookListItem
							onDelete={() => onDelete(webhook.id)}
							onEdit={() => onEdit(webhook)}
							onTest={() => onTest?.(webhook)}
							onToggleEnabled={() => onToggleEnabled?.(webhook)}
							onViewLogs={() => onViewLogs?.(webhook)}
							webhook={webhook}
						/>
					</Card>
				);
			})}
		</div>
	);
}
