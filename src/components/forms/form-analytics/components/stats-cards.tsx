import React from "react";

// UI Components
import { Card } from "@/components/ui/card";

// Icons
import {
  Users,
  FileText,
  TrendingUp,
  Clock,
  Activity,
  Target,
  Zap,
  PieChart,
} from "lucide-react";

// Types
import type { OverviewStatsProps, AnalyticsCardsProps } from "../types";

export const OverviewStats: React.FC<OverviewStatsProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="flex items-center gap-4 p-6 bg-card border-border">
        <div className="p-3 bg-blue-500/10 rounded-card">
          <Users className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-muted-foreground">
            Total Submissions
          </p>
          <p className="text-2xl font-bold text-foreground">
            {data.totalSubmissions.toLocaleString()}
          </p>
        </div>
      </Card>
      <Card className="flex items-center gap-4 p-6 bg-card border-border">
        <div className="p-3 bg-emerald-500/10 rounded-card">
          <FileText className="w-6 h-6 text-emerald-600" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-muted-foreground">
            Form Fields
          </p>
          <p className="text-2xl font-bold text-foreground">
            {data.totalFields}
          </p>
        </div>
      </Card>
      <Card className="flex items-center gap-4 p-6 bg-card border-border">
        <div className="p-3 bg-purple-500/10 rounded-card">
          <TrendingUp className="w-6 h-6 text-purple-600" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-muted-foreground">
            Completion Rate
          </p>
          <p className="text-2xl font-bold text-foreground">
            {data.completionRate}%
          </p>
        </div>
      </Card>
      <Card className="flex items-center gap-4 p-6 bg-card border-border">
        <div className="p-3 bg-orange-500/10 rounded-card">
          <Clock className="w-6 h-6 text-orange-600" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-muted-foreground">
            Last 30 Days
          </p>
          <p className="text-2xl font-bold text-foreground">
            {data.recentSubmissions.length}
          </p>
        </div>
      </Card>
    </div>
  );
};

export const AnalyticsCards: React.FC<AnalyticsCardsProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="flex items-center gap-4 p-6 bg-card border-border">
        <div className="p-3 bg-green-500/10 rounded-card">
          <Activity className="w-6 h-6 text-green-600" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-muted-foreground">
            Avg. Daily Submissions
          </p>
          <p className="text-2xl font-bold text-foreground">
            {data.avgSubmissionsPerDay}
          </p>
        </div>
      </Card>
      <Card className="flex items-center gap-4 p-6 bg-card border-border">
        <div className="p-3 bg-orange-500/10 rounded-card">
          <Target className="w-6 h-6 text-orange-600" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-muted-foreground">
            Bounce Rate
          </p>
          <p className="text-2xl font-bold text-foreground">
            {data.bounceRate}%
          </p>
        </div>
      </Card>
      <Card className="flex items-center gap-4 p-6 bg-card border-border">
        <div className="p-3 bg-blue-500/10 rounded-card">
          <Zap className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-muted-foreground">Peak Hour</p>
          <p className="text-2xl font-bold text-foreground">
            {data.peakHour ? `${data.peakHour[0]}:00` : "N/A"}
          </p>
        </div>
      </Card>
      <Card className="flex items-center gap-4 p-6 bg-card border-border">
        <div className="p-3 bg-purple-500/10 rounded-card">
          <PieChart className="w-6 h-6 text-purple-600" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-muted-foreground">
            Unique Responses
          </p>
          <p className="text-2xl font-bold text-foreground">
            {Object.values(data.fieldAnalytics).reduce(
              (total, field) => total + field.uniqueValues,
              0
            )}
          </p>
        </div>
      </Card>
    </div>
  );
};
