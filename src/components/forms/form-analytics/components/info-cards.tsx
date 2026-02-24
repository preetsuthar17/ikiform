"use client";

import { BarChart3, Calendar, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { InfoCardsProps } from "../types";

export const InfoCards: React.FC<InfoCardsProps> = ({
	form,
	data,
	formatDate,
}) => {
	const t = useTranslations("product.analytics.infoCards");
	const commonT = useTranslations("product.common");

	return (
		<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
			<Card className="grow gap-4 border-border bg-card p-4 shadow-none">
				<CardHeader className="flex flex-row items-center gap-4 p-0">
					<div aria-hidden="true" className="rounded-md bg-primary/10 p-3">
						<Calendar className="size-6 text-primary" />
					</div>
					<CardTitle className="font-medium text-base text-muted-foreground">
						{t("lastSubmission")}
					</CardTitle>
				</CardHeader>
				<CardContent className="px-1 py-0">
					{data.lastSubmission ? (
						<div className="flex flex-col gap-2">
							<p className="font-semibold text-foreground">
								{formatDate(data.lastSubmission.submitted_at)}
							</p>
							<p className="text-muted-foreground text-sm">
								{data.lastSubmission.ip_address
									? t("fromIp", { ip: data.lastSubmission.ip_address })
									: ""}
							</p>
						</div>
					) : (
						<p className="text-muted-foreground">{t("noSubmissionsYet")}</p>
					)}
				</CardContent>
			</Card>

			<Card className="grow gap-4 border-border bg-card p-4 shadow-none">
				<CardHeader className="flex flex-row items-center gap-4 p-0">
					<div aria-hidden="true" className="rounded-md bg-primary/10 p-3">
						<BarChart3 className="size-6 text-primary" />
					</div>
					<CardTitle className="font-medium text-base text-muted-foreground">
						{t("formStatus")}
					</CardTitle>
				</CardHeader>
				<CardContent className="px-1 py-0">
					<div className="flex flex-col gap-3">
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground text-sm">{t("published")}</span>
							<Badge variant={form.is_published ? "default" : "secondary"}>
								{form.is_published ? t("yes") : t("no")}
							</Badge>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground text-sm">{t("created")}</span>
							<span className="text-foreground text-sm">
								{formatDate(form.created_at)}
							</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground text-sm">{t("updated")}</span>
							<span className="text-foreground text-sm">
								{formatDate(form.updated_at)}
							</span>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card className="grow gap-4 border-border bg-card p-4 shadow-none">
				<CardHeader className="flex flex-row items-center gap-4 p-0">
					<div aria-hidden="true" className="rounded-md bg-primary/10 p-3">
						<TrendingUp className="size-6 text-primary" />
					</div>
					<CardTitle className="font-medium text-base text-muted-foreground">
						{t("quickStats")}
					</CardTitle>
				</CardHeader>
				<CardContent className="px-1 py-0">
					<div className="flex flex-col gap-3">
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground text-sm">
								{t("avgFieldsCompleted")}
							</span>
							<span className="font-semibold text-foreground text-sm">
								{data.completionRate}%
							</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground text-sm">
								{t("mostActiveDay")}
							</span>
							{data.mostActiveDay ? (
								<div className="flex items-center gap-2">
									<span className="font-semibold text-foreground text-sm">
										{data.mostActiveDay[0]}
									</span>
									<Badge className="text-xs" variant="secondary">
										{t("submissions", { count: data.mostActiveDay[1] })}
									</Badge>
								</div>
							) : (
								<span className="text-muted-foreground text-sm">{commonT("na")}</span>
							)}
						</div>
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground text-sm">{t("formType")}</span>
							<Badge variant="outline">
								{form.schema.settings?.multiStep
									? t("multiStep")
									: t("singlePage")}
							</Badge>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
