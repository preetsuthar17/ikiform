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
import type React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { AnalyticsCardsProps, OverviewStatsProps } from "../types";

export const OverviewStats: React.FC<OverviewStatsProps> = ({ data }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <Card className="border-border bg-card gap-4 p-4 md:p-6 h-fit grow shadow-none">
      <CardHeader className="flex flex-row items-center gap-4 p-0">
        <div className="rounded-2xl bg-blue-500/10 p-3" aria-hidden="true">
          <Users className="size-6 text-blue-600" />
        </div>
        <CardTitle className="text-base font-medium text-muted-foreground">
          Total Submissions
        </CardTitle>
      </CardHeader>
      <CardContent className="py-0 px-1">
        <p className="tabular-nums font-bold text-2xl text-foreground">
          {data.totalSubmissions.toLocaleString()}
        </p>
      </CardContent>
    </Card>

    <Card className="border-border bg-card gap-4 p-4 md:p-6 h-fit grow shadow-none">
      <CardHeader className="flex flex-row items-center gap-4 p-0">
        <div className="rounded-2xl bg-emerald-500/10 p-3" aria-hidden="true">
          <FileText className="size-6 text-emerald-600" />
        </div>
        <CardTitle className="text-base font-medium text-muted-foreground">
          Form Fields
        </CardTitle>
      </CardHeader>
      <CardContent className="py-0 px-1">
        <p className="tabular-nums font-bold text-2xl text-foreground">
          {data.totalFields}
        </p>
      </CardContent>
    </Card>

    <Card className="border-border bg-card gap-4 p-4 md:p-6 h-fit grow shadow-none">
      <CardHeader className="flex flex-row items-center gap-4 p-0">
        <div className="rounded-2xl bg-purple-500/10 p-3" aria-hidden="true">
          <TrendingUp className="size-6 text-purple-600" />
        </div>
        <CardTitle className="text-base font-medium text-muted-foreground">
          Completion Rate
        </CardTitle>
      </CardHeader>
      <CardContent className="py-0 px-1">
        <p className="tabular-nums font-bold text-2xl text-foreground">
          {data.completionRate}%
        </p>
      </CardContent>
    </Card>

    <Card className="border-border bg-card gap-4 p-4 md:p-6 h-fit grow shadow-none">
      <CardHeader className="flex flex-row items-center gap-4 p-0">
        <div className="rounded-2xl bg-orange-500/10 p-3" aria-hidden="true">
          <Clock className="size-6 text-orange-600" />
        </div>
        <CardTitle className="text-base font-medium text-muted-foreground">
          Last 30 Days
        </CardTitle>
      </CardHeader>
      <CardContent className="py-0 px-1">
        <p className="tabular-nums font-bold text-2xl text-foreground">
          {data.recentSubmissions.length}
        </p>
      </CardContent>
    </Card>
  </div>
);

export const AnalyticsCards: React.FC<AnalyticsCardsProps> = ({ data }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <Card className="border-border bg-card gap-4 p-4 md:p-6 h-fit grow shadow-none">
      <CardHeader className="flex flex-row items-center gap-4 p-0">
        <div className="rounded-2xl bg-green-500/10 p-3" aria-hidden="true">
          <Activity className="size-6 text-green-600" />
        </div>
        <CardTitle className="text-base font-medium text-muted-foreground">
          Avg. Daily Submissions
        </CardTitle>
      </CardHeader>
      <CardContent className="py-0 px-1">
        <p className="tabular-nums font-bold text-2xl text-foreground">
          {data.avgSubmissionsPerDay}
        </p>
      </CardContent>
    </Card>

    <Card className="border-border bg-card gap-4 p-4 md:p-6 h-fit grow shadow-none">
      <CardHeader className="flex flex-row items-center gap-4 p-0">
        <div className="rounded-2xl bg-orange-500/10 p-3" aria-hidden="true">
          <Target className="size-6 text-orange-600" />
        </div>
        <CardTitle className="text-base font-medium text-muted-foreground">
          Bounce Rate
        </CardTitle>
      </CardHeader>
      <CardContent className="py-0 px-1">
        <p className="tabular-nums font-bold text-2xl text-foreground">
          {data.bounceRate}%
        </p>
      </CardContent>
    </Card>

    <Card className="border-border bg-card gap-4 p-4 md:p-6 h-fit grow shadow-none">
      <CardHeader className="flex flex-row items-center gap-4 p-0">
        <div className="rounded-2xl bg-blue-500/10 p-3" aria-hidden="true">
          <Zap className="size-6 text-blue-600" />
        </div>
        <CardTitle className="text-base font-medium text-muted-foreground">
          Peak Hour
        </CardTitle>
      </CardHeader>
      <CardContent className="py-0 px-1">
        <p className="tabular-nums font-bold text-2xl text-foreground">
          {data.peakHour ? `${data.peakHour[0]}:00` : "N/A"}
        </p>
      </CardContent>
    </Card>

    <Card className="border-border bg-card gap-4 p-4 md:p-6 h-fit grow shadow-none">
      <CardHeader className="flex flex-row items-center gap-4 p-0">
        <div className="rounded-2xl bg-purple-500/10 p-3" aria-hidden="true">
          <PieChart className="size-6 text-purple-600" />
        </div>
        <CardTitle className="text-base font-medium text-muted-foreground">
          Unique Responses
        </CardTitle>
      </CardHeader>
      <CardContent className="py-0 px-1">
        <p className="tabular-nums font-bold text-2xl text-foreground">
          {Object.values(data.fieldAnalytics).reduce(
            (total, field) => total + field.uniqueValues,
            0
          )}
        </p>
      </CardContent>
    </Card>
  </div>
);

