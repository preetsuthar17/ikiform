import { Edit, Eye, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { memo, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { FormStatsProps } from "../types";

export const FormStats = memo(function FormStats({
	forms,
	loading,
}: FormStatsProps) {
	const t = useTranslations("dashboard.formsManagement.stats");

	const skeletonCards = useMemo(
		() =>
			Array.from({ length: 3 }).map((_, i) => (
				<Skeleton
					aria-hidden="true"
					className="rounded-xl p-6 py-7 shadow-none"
					key={i}
					role="article"
				>
					<div className="flex items-center gap-4">
						<Skeleton aria-hidden="true" className="size-12 rounded-md" />
						<div className="flex flex-col gap-1">
							<Skeleton aria-hidden="true" className="h-7 w-8" />
							<Skeleton aria-hidden="true" className="h-4 w-16" />
						</div>
					</div>
				</Skeleton>
			)),
		[]
	);

	const stats = useMemo(() => {
		if (forms.length === 0) return [];

		const totalForms = forms.length;
		const publishedForms = forms.filter((f) => f.is_published).length;
		const draftForms = forms.filter((f) => !f.is_published).length;

		return [
			{
				label: t("totalForms"),
				value: totalForms,
				icon: Plus,
				color: "text-primary",
				bgColor: "bg-primary/10",
			},
			{
				label: t("published"),
				value: publishedForms,
				icon: Eye,
				color: "text-green-600",
				bgColor: "bg-green-600/10",
			},
			{
				label: t("drafts"),
				value: draftForms,
				icon: Edit,
				color: "text-yellow-600",
				bgColor: "bg-yellow-600/10",
			},
		];
	}, [forms, t]);

	if (loading) {
		return (
			<div
				aria-label={t("loadingAria")}
				className="grid grid-cols-1 gap-4"
				role="status"
			>
				{skeletonCards}
			</div>
		);
	}

	if (forms.length === 0) return null;

	return (
		<div
			aria-label={t("aria")}
			className="grid grid-cols-1 gap-4"
			role="region"
		>
			{stats.map((stat) => {
				const Icon = stat.icon;
				return (
					<Card
						aria-label={`${stat.label}: ${stat.value}`}
						className="p-6 shadow-none"
						key={stat.label}
						role="article"
					>
						<div className="flex items-center gap-4">
							<div
								aria-hidden="true"
								className={`flex size-12 items-center justify-center rounded-md ${stat.bgColor}`}
							>
								<Icon aria-hidden="true" className={`size-6 ${stat.color}`} />
							</div>
							<div className="flex flex-col gap-1">
								<p className="font-semibold text-2xl text-foreground tabular-nums">
									{stat.value}
								</p>
								<p className="font-medium text-muted-foreground text-sm">
									{stat.label}
								</p>
							</div>
						</div>
					</Card>
				);
			})}
		</div>
	);
});
