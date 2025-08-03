'use client';

import {
  Activity,
  ArrowDown,
  ArrowUp,
  BarChart3,
  Calendar,
  Clock,
  Eye,
  FileText,
  Minus,
  MousePointer,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { useMemo } from 'react';
import { formatDate } from '@/components/dashboard/forms-management/utils';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { DataTable, type DataTableColumn } from '@/components/ui/table';
import { useAdminData } from '../hooks/useAdminData';
import {
  GradientAreaChart,
  GradientBarChart,
  GradientLineChart,
  GradientPieChart,
  MultiAreaChart,
} from './charts';

interface AnalyticsData {
  form_id: string;
  form_title: string;
  total_submissions: number;
  submissions_today: number;
  submissions_this_week: number;
  submissions_this_month: number;
  last_submission: string;
  created_at: string;
  avg_daily_submissions: number;
  growth_rate: number;
  is_published: boolean;
}

interface TimeSeriesData {
  date: string;
  submissions: number;
  forms_created: number;
  new_users: number;
}

export function AdminAnalytics() {
  const { allForms, submissions, users, loading } = useAdminData();

  const analytics = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const totalUsers = users.length;
    const totalForms = allForms.length;
    const totalSubmissions = submissions.length;
    const publishedForms = allForms.filter((f) => f.is_published).length;

    const usersThisWeek = users.filter(
      (u) => new Date(u.created_at) >= weekAgo
    ).length;
    const formsThisWeek = allForms.filter(
      (f) => new Date(f.created_at) >= weekAgo
    ).length;
    const submissionsThisWeek = submissions.filter(
      (s) => new Date(s.submitted_at) >= weekAgo
    ).length;

    const usersToday = users.filter(
      (u) => new Date(u.created_at) >= today
    ).length;
    const formsToday = allForms.filter(
      (f) => new Date(f.created_at) >= today
    ).length;
    const submissionsToday = submissions.filter(
      (s) => new Date(s.submitted_at) >= today
    ).length;

    const premiumUsers = users.filter((u) => u.has_premium).length;
    const premiumRate = totalUsers > 0 ? (premiumUsers / totalUsers) * 100 : 0;

    const avgSubmissionsPerForm =
      totalForms > 0 ? totalSubmissions / totalForms : 0;

    const formAnalytics: AnalyticsData[] = allForms.map((form) => {
      const formSubmissions = submissions.filter((s) => s.form_id === form.id);
      const submissionsToday = formSubmissions.filter(
        (s) => new Date(s.submitted_at) >= today
      ).length;
      const submissionsThisWeek = formSubmissions.filter(
        (s) => new Date(s.submitted_at) >= weekAgo
      ).length;
      const submissionsThisMonth = formSubmissions.filter(
        (s) => new Date(s.submitted_at) >= monthAgo
      ).length;

      const formAge = Math.max(
        1,
        Math.floor(
          (now.getTime() - new Date(form.created_at).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      );
      const avgDaily = formSubmissions.length / formAge;

      const lastWeekSubmissions = formSubmissions.filter((s) => {
        const date = new Date(s.submitted_at);
        return (
          date >= new Date(weekAgo.getTime() - 7 * 24 * 60 * 60 * 1000) &&
          date < weekAgo
        );
      }).length;

      const growthRate =
        lastWeekSubmissions > 0
          ? ((submissionsThisWeek - lastWeekSubmissions) /
              lastWeekSubmissions) *
            100
          : submissionsThisWeek > 0
            ? 100
            : 0;

      return {
        form_id: form.id,
        form_title: form.title,
        total_submissions: formSubmissions.length,
        submissions_today: submissionsToday,
        submissions_this_week: submissionsThisWeek,
        submissions_this_month: submissionsThisMonth,
        last_submission:
          formSubmissions.length > 0
            ? formSubmissions.sort(
                (a, b) =>
                  new Date(b.submitted_at).getTime() -
                  new Date(a.submitted_at).getTime()
              )[0].submitted_at
            : form.created_at,
        created_at: form.created_at,
        avg_daily_submissions: avgDaily,
        growth_rate: growthRate,
        is_published: form.is_published,
      };
    });

    const timeSeries: TimeSeriesData[] = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];

      timeSeries.push({
        date: dateStr,
        submissions: submissions.filter((s) =>
          s.submitted_at.startsWith(dateStr)
        ).length,
        forms_created: allForms.filter((f) => f.created_at.startsWith(dateStr))
          .length,
        new_users: users.filter((u) => u.created_at.startsWith(dateStr)).length,
      });
    }

    return {
      overview: {
        totalUsers,
        totalForms,
        totalSubmissions,
        publishedForms,
        usersThisWeek,
        formsThisWeek,
        submissionsThisWeek,
        usersToday,
        formsToday,
        submissionsToday,
        premiumUsers,
        premiumRate,
        avgSubmissionsPerForm,
      },
      formAnalytics,
      timeSeries,
    };
  }, [allForms, submissions, users]);

  const columns: DataTableColumn<AnalyticsData>[] = [
    {
      key: 'form_title',
      header: 'Form',
      sortable: true,
      filterable: true,
      render: (value, row) => (
        <div>
          <div className="flex items-center gap-2 font-medium">
            {value}
            {!row.is_published && (
              <Badge className="text-xs" variant="secondary">
                Draft
              </Badge>
            )}
          </div>
          <div className="font-mono text-muted-foreground text-xs">
            {row.form_id.slice(0, 8)}...
          </div>
        </div>
      ),
    },
    {
      key: 'total_submissions',
      header: 'Total',
      sortable: true,
      align: 'center',
      render: (value) => (
        <div className="text-center">
          <div className="font-semibold text-lg">{value}</div>
          <div className="text-muted-foreground text-xs">submissions</div>
        </div>
      ),
    },
    {
      key: 'submissions_today',
      header: 'Today',
      sortable: true,
      align: 'center',
      render: (value) => (
        <Badge
          className="font-mono"
          variant={value > 0 ? 'default' : 'secondary'}
        >
          {value}
        </Badge>
      ),
    },
    {
      key: 'submissions_this_week',
      header: 'This Week',
      sortable: true,
      align: 'center',
      render: (value) => (
        <Badge
          className="font-mono"
          variant={value > 0 ? 'default' : 'secondary'}
        >
          {value}
        </Badge>
      ),
    },
    {
      key: 'avg_daily_submissions',
      header: 'Avg/Day',
      sortable: true,
      align: 'center',
      render: (value) => (
        <div className="text-center text-sm">{value.toFixed(1)}</div>
      ),
    },
    {
      key: 'growth_rate',
      header: 'Growth',
      sortable: true,
      align: 'center',
      render: (value) => (
        <div
          className={`flex items-center justify-center gap-1 text-center ${
            value > 0
              ? 'text-green-600'
              : value < 0
                ? 'text-red-600'
                : 'text-gray-500'
          }`}
        >
          {value > 0 ? (
            <ArrowUp className="h-3 w-3" />
          ) : value < 0 ? (
            <ArrowDown className="h-3 w-3" />
          ) : (
            <Minus className="h-3 w-3" />
          )}
          <span className="font-medium text-sm">
            {Math.abs(value).toFixed(0)}%
          </span>
        </div>
      ),
    },
    {
      key: 'last_submission',
      header: 'Last Activity',
      sortable: true,
      render: (value) => (
        <div className="text-muted-foreground text-sm">{formatDate(value)}</div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card className="p-4" key={i}>
              <div className="animate-pulse space-y-2">
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="h-8 w-1/2 rounded bg-muted" />
              </div>
            </Card>
          ))}
        </div>
        <Card className="p-6">
          <div className="h-64 animate-pulse rounded bg-muted" />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-primary/10 p-2">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-xl">Analytics Dashboard</h2>
            <p className="text-muted-foreground text-sm">
              Real-time insights from live Supabase data
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-muted-foreground text-sm">
                Total Users
              </p>
              <p className="font-bold text-2xl">
                {analytics.overview.totalUsers}
              </p>
              <p className="flex items-center gap-1 text-green-600 text-xs">
                <TrendingUp className="h-3 w-3" />+
                {analytics.overview.usersThisWeek} this week
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-muted-foreground text-sm">
                Total Forms
              </p>
              <p className="font-bold text-2xl">
                {analytics.overview.totalForms}
              </p>
              <p className="flex items-center gap-1 text-green-600 text-xs">
                <TrendingUp className="h-3 w-3" />+
                {analytics.overview.formsThisWeek} this week
              </p>
            </div>
            <FileText className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-muted-foreground text-sm">
                Total Submissions
              </p>
              <p className="font-bold text-2xl">
                {analytics.overview.totalSubmissions}
              </p>
              <p className="flex items-center gap-1 text-green-600 text-xs">
                <TrendingUp className="h-3 w-3" />+
                {analytics.overview.submissionsThisWeek} this week
              </p>
            </div>
            <MousePointer className="h-8 w-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-muted-foreground text-sm">
                Premium Users
              </p>
              <p className="font-bold text-2xl">
                {analytics.overview.premiumUsers}
              </p>
              <p className="text-muted-foreground text-xs">
                {analytics.overview.premiumRate.toFixed(1)}% conversion
              </p>
            </div>
            <Target className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-500" />
            <h3 className="font-semibold">Today's Activity</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">New Users</span>
              <Badge variant="outline">{analytics.overview.usersToday}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Forms Created</span>
              <Badge variant="outline">{analytics.overview.formsToday}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Submissions</span>
              <Badge variant="outline">
                {analytics.overview.submissionsToday}
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold">Performance</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Published Forms</span>
              <Badge variant="outline">
                {analytics.overview.publishedForms}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Avg Submissions/Form</span>
              <Badge variant="outline">
                {analytics.overview.avgSubmissionsPerForm.toFixed(1)}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Active Forms</span>
              <Badge variant="outline">
                {
                  analytics.formAnalytics.filter(
                    (f) => f.submissions_this_week > 0
                  ).length
                }
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold">Growth Metrics</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Weekly User Growth</span>
              <Badge className="text-green-600" variant="outline">
                +
                {(
                  (analytics.overview.usersThisWeek /
                    Math.max(
                      analytics.overview.totalUsers -
                        analytics.overview.usersThisWeek,
                      1
                    )) *
                  100
                ).toFixed(1)}
                %
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Form Creation Rate</span>
              <Badge className="text-green-600" variant="outline">
                +{analytics.overview.formsThisWeek}/week
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Submission Growth</span>
              <Badge className="text-green-600" variant="outline">
                +{analytics.overview.submissionsThisWeek}/week
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-lg">Form Performance Analytics</h3>
          <Badge variant="secondary">
            {analytics.formAnalytics.length} forms
          </Badge>
        </div>
        <DataTable
          columns={columns}
          data={analytics.formAnalytics}
          itemsPerPage={10}
          searchPlaceholder="Search forms..."
        />
      </Card>
    </div>
  );
}
