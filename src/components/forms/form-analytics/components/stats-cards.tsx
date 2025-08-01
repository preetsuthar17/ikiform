import {
  Activity,
  Clock,
  FileText,
  PieChart,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import type React from 'react';

import { Card } from '@/components/ui/card';

import type { AnalyticsCardsProps, OverviewStatsProps } from '../types';

export const OverviewStats: React.FC<OverviewStatsProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="flex items-center gap-4 border-border bg-card p-6">
        <div className="rounded-card bg-blue-500/10 p-3">
          <Users className="h-6 w-6 text-blue-600" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-medium text-muted-foreground text-sm">
            Total Submissions
          </p>
          <p className="font-bold text-2xl text-foreground">
            {data.totalSubmissions.toLocaleString()}
          </p>
        </div>
      </Card>
      <Card className="flex items-center gap-4 border-border bg-card p-6">
        <div className="rounded-card bg-emerald-500/10 p-3">
          <FileText className="h-6 w-6 text-emerald-600" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-medium text-muted-foreground text-sm">
            Form Fields
          </p>
          <p className="font-bold text-2xl text-foreground">
            {data.totalFields}
          </p>
        </div>
      </Card>
      <Card className="flex items-center gap-4 border-border bg-card p-6">
        <div className="rounded-card bg-purple-500/10 p-3">
          <TrendingUp className="h-6 w-6 text-purple-600" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-medium text-muted-foreground text-sm">
            Completion Rate
          </p>
          <p className="font-bold text-2xl text-foreground">
            {data.completionRate}%
          </p>
        </div>
      </Card>
      <Card className="flex items-center gap-4 border-border bg-card p-6">
        <div className="rounded-card bg-orange-500/10 p-3">
          <Clock className="h-6 w-6 text-orange-600" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-medium text-muted-foreground text-sm">
            Last 30 Days
          </p>
          <p className="font-bold text-2xl text-foreground">
            {data.recentSubmissions.length}
          </p>
        </div>
      </Card>
    </div>
  );
};

export const AnalyticsCards: React.FC<AnalyticsCardsProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="flex items-center gap-4 border-border bg-card p-6">
        <div className="rounded-card bg-green-500/10 p-3">
          <Activity className="h-6 w-6 text-green-600" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-medium text-muted-foreground text-sm">
            Avg. Daily Submissions
          </p>
          <p className="font-bold text-2xl text-foreground">
            {data.avgSubmissionsPerDay}
          </p>
        </div>
      </Card>
      <Card className="flex items-center gap-4 border-border bg-card p-6">
        <div className="rounded-card bg-orange-500/10 p-3">
          <Target className="h-6 w-6 text-orange-600" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-medium text-muted-foreground text-sm">
            Bounce Rate
          </p>
          <p className="font-bold text-2xl text-foreground">
            {data.bounceRate}%
          </p>
        </div>
      </Card>
      <Card className="flex items-center gap-4 border-border bg-card p-6">
        <div className="rounded-card bg-blue-500/10 p-3">
          <Zap className="h-6 w-6 text-blue-600" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-medium text-muted-foreground text-sm">Peak Hour</p>
          <p className="font-bold text-2xl text-foreground">
            {data.peakHour ? `${data.peakHour[0]}:00` : 'N/A'}
          </p>
        </div>
      </Card>
      <Card className="flex items-center gap-4 border-border bg-card p-6">
        <div className="rounded-card bg-purple-500/10 p-3">
          <PieChart className="h-6 w-6 text-purple-600" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-medium text-muted-foreground text-sm">
            Unique Responses
          </p>
          <p className="font-bold text-2xl text-foreground">
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
