"use client";

import {
	Activity,
	Clock,
	FileText,
	PieChart,
	Target,
	TrendingUp,
	Users,
	Zap,
} from "lucide-react";
import { useTranslations } from "next-intl";
import type React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { AnalyticsCardsProps, OverviewStatsProps } from "../types";

export const OverviewStats: React.FC<OverviewStatsProps> = ({ data }) => (
	<OverviewStatsContent data={data} />
);

const OverviewStatsContent: React.FC<OverviewStatsProps> = ({ data }) => {
	const t = useTranslations("product.analytics.statsCards");

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<Card className="h-fit grow gap-4 border-border bg-card p-4 shadow-none md:p-6">
				<CardHeader className="flex flex-row items-center gap-4 p-0">
					<div aria-hidden="true" className="rounded-md bg-blue-500/10 p-3">
						<Users className="size-6 text-blue-600" />
					</div>
					<CardTitle className="font-medium text-base text-muted-foreground">
						{t("totalSubmissions")}
					</CardTitle>
				</CardHeader>
				<CardContent className="px-1 py-0">
					<p className="font-bold text-2xl text-foreground tabular-nums">
						{data.totalSubmissions.toLocaleString()}
					</p>
				</CardContent>
			</Card>

			<Card className="h-fit grow gap-4 border-border bg-card p-4 shadow-none md:p-6">
				<CardHeader className="flex flex-row items-center gap-4 p-0">
					<div aria-hidden="true" className="rounded-md bg-emerald-500/10 p-3">
						<FileText className="size-6 text-emerald-600" />
					</div>
					<CardTitle className="font-medium text-base text-muted-foreground">
						{t("formFields")}
					</CardTitle>
				</CardHeader>
				<CardContent className="px-1 py-0">
					<p className="font-bold text-2xl text-foreground tabular-nums">
						{data.totalFields}
					</p>
				</CardContent>
			</Card>

			<Card className="h-fit grow gap-4 border-border bg-card p-4 shadow-none md:p-6">
				<CardHeader className="flex flex-row items-center gap-4 p-0">
					<div aria-hidden="true" className="rounded-md bg-purple-500/10 p-3">
						<TrendingUp className="size-6 text-purple-600" />
					</div>
					<CardTitle className="font-medium text-base text-muted-foreground">
						{t("completionRate")}
					</CardTitle>
				</CardHeader>
				<CardContent className="px-1 py-0">
					<p className="font-bold text-2xl text-foreground tabular-nums">
						{data.completionRate}%
					</p>
				</CardContent>
			</Card>

			<Card className="h-fit grow gap-4 border-border bg-card p-4 shadow-none md:p-6">
				<CardHeader className="flex flex-row items-center gap-4 p-0">
					<div aria-hidden="true" className="rounded-md bg-orange-500/10 p-3">
						<Clock className="size-6 text-orange-600" />
					</div>
					<CardTitle className="font-medium text-base text-muted-foreground">
						{t("last30Days")}
					</CardTitle>
				</CardHeader>
				<CardContent className="px-1 py-0">
					<p className="font-bold text-2xl text-foreground tabular-nums">
						{data.recentSubmissions.length}
					</p>
				</CardContent>
			</Card>
		</div>
	);
};

export const AnalyticsCards: React.FC<AnalyticsCardsProps> = ({ data }) => (
	<AnalyticsCardsContent data={data} />
);

const AnalyticsCardsContent: React.FC<AnalyticsCardsProps> = ({ data }) => {
	const t = useTranslations("product.analytics.statsCards");
	const commonT = useTranslations("product.common");

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<Card className="h-fit grow gap-4 border-border bg-card p-4 shadow-none md:p-6">
				<CardHeader className="flex flex-row items-center gap-4 p-0">
					<div aria-hidden="true" className="rounded-md bg-green-500/10 p-3">
						<Activity className="size-6 text-green-600" />
					</div>
					<CardTitle className="font-medium text-base text-muted-foreground">
						{t("avgDailySubmissions")}
					</CardTitle>
				</CardHeader>
				<CardContent className="px-1 py-0">
					<p className="font-bold text-2xl text-foreground tabular-nums">
						{data.avgSubmissionsPerDay}
					</p>
				</CardContent>
			</Card>

			<Card className="h-fit grow gap-4 border-border bg-card p-4 shadow-none md:p-6">
				<CardHeader className="flex flex-row items-center gap-4 p-0">
					<div aria-hidden="true" className="rounded-md bg-orange-500/10 p-3">
						<Target className="size-6 text-orange-600" />
					</div>
					<CardTitle className="font-medium text-base text-muted-foreground">
						{t("bounceRate")}
					</CardTitle>
				</CardHeader>
				<CardContent className="px-1 py-0">
					<p className="font-bold text-2xl text-foreground tabular-nums">
						{data.bounceRate}%
					</p>
				</CardContent>
			</Card>

			<Card className="h-fit grow gap-4 border-border bg-card p-4 shadow-none md:p-6">
				<CardHeader className="flex flex-row items-center gap-4 p-0">
					<div aria-hidden="true" className="rounded-md bg-blue-500/10 p-3">
						<Zap className="size-6 text-blue-600" />
					</div>
					<CardTitle className="font-medium text-base text-muted-foreground">
						{t("peakHour")}
					</CardTitle>
				</CardHeader>
				<CardContent className="px-1 py-0">
					<p className="font-bold text-2xl text-foreground tabular-nums">
						{data.peakHour ? `${data.peakHour[0]}:00` : commonT("na")}
					</p>
				</CardContent>
			</Card>

			<Card className="h-fit grow gap-4 border-border bg-card p-4 shadow-none md:p-6">
				<CardHeader className="flex flex-row items-center gap-4 p-0">
					<div aria-hidden="true" className="rounded-md bg-purple-500/10 p-3">
						<PieChart className="size-6 text-purple-600" />
					</div>
					<CardTitle className="font-medium text-base text-muted-foreground">
						{t("uniqueResponses")}
					</CardTitle>
				</CardHeader>
				<CardContent className="px-1 py-0">
					<p className="font-bold text-2xl text-foreground tabular-nums">
						{Object.values(data.fieldAnalytics).reduce(
							(total, field) => total + field.uniqueValues,
							0
						)}
					</p>
				</CardContent>
			</Card>
		</div>
	);
};
