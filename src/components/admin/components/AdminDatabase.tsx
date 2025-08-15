'use client';

import {
  Activity,
  Calendar,
  Database,
  FileText,
  HardDrive,
  RefreshCw,
  Send,
  Server,
  Trash2,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { formatDate } from '@/components/dashboard/forms-management/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DataTable, type DataTableColumn } from '@/components/ui/table';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useAdminData } from '../hooks/useAdminData';
import {
  GradientAreaChart,
  GradientBarChart,
  GradientPieChart,
  MultiAreaChart,
} from './charts';

export function AdminDatabase() {
  const { users, allForms, submissions, loading, deleteSubmission } =
    useAdminData();
  const [activeTab, setActiveTab] = useState('overview');

  const handleDeleteSubmission = async (submissionId: string) => {
    if (
      confirm(
        '⚠️ DELETE SUBMISSION\n\nThis will permanently delete this submission. This action cannot be undone!\n\nContinue?'
      )
    ) {
      await deleteSubmission(submissionId);
    }
  };

  const submissionsColumns: DataTableColumn<any>[] = [
    {
      key: 'id',
      header: 'Submission ID',
      sortable: true,
      render: (value) => (
        <div className="font-mono text-sm">{value.slice(0, 8)}...</div>
      ),
    },
    {
      key: 'form_id',
      header: 'Form',
      sortable: true,
      filterable: true,
      render: (value) => {
        const form = allForms.find((f) => f.id === value);
        return (
          <div>
            <div className="font-medium">{form?.title || 'Unknown Form'}</div>
            <div className="font-mono text-muted-foreground text-xs">
              {value.slice(0, 8)}...
            </div>
          </div>
        );
      },
    },
    {
      key: 'user_id',
      header: 'User',
      sortable: true,
      render: (value) => (
        <div className="font-mono text-sm">
          {value ? `${value.slice(0, 8)}...` : 'Anonymous'}
        </div>
      ),
    },
    {
      key: 'submitted_at',
      header: 'Submitted',
      sortable: true,
      render: (value) => <div className="text-sm">{formatDate(value)}</div>,
    },
    {
      key: 'id',
      header: 'Actions',
      align: 'right',
      render: (value) => (
        <Button
          className="text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={() => handleDeleteSubmission(value)}
          size="sm"
          title="Delete Submission"
          variant="ghost"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex animate-pulse flex-col gap-4">
          <div className="h-8 w-1/4 rounded bg-muted" />
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div className="h-24 rounded bg-muted" key={i} />
            ))}
          </div>
          <div className="h-64 rounded bg-muted" />
        </div>
      </Card>
    );
  }

  const tabItems = [
    { id: 'overview', label: 'Overview', icon: <Database /> },
    { id: 'users', label: 'Users Table', icon: <Users /> },
    { id: 'forms', label: 'Forms Table', icon: <FileText /> },
    { id: 'submissions', label: 'Submissions', icon: <Send /> },
  ];

  // Database statistics
  const dbStats = {
    totalUsers: users.length,
    totalForms: allForms.length,
    totalSubmissions: submissions.length,
    storageUsed:
      Math.round(
        (users.length * 0.5 +
          allForms.length * 2.1 +
          submissions.length * 1.3) *
          100
      ) / 100, // Mock calculation
    lastBackup: new Date(Date.now() - Math.random() * 86_400_000 * 7), // Random date in last week
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-primary/10 p-2">
              <Database className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-xl">Database Overview</h2>
              <p className="text-muted-foreground text-sm">
                System data and statistics
              </p>
            </div>
          </div>
          <Button className="gap-2" size="sm" variant="outline">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium text-sm">Total Users</p>
                <p className="font-bold text-2xl text-blue-600">
                  {dbStats.totalUsers}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium text-sm">Total Forms</p>
                <p className="font-bold text-2xl text-green-600">
                  {dbStats.totalForms}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Send className="h-5 w-5 text-purple-500" />
              <div>
                <p className="font-medium text-sm">Submissions</p>
                <p className="font-bold text-2xl text-purple-600">
                  {dbStats.totalSubmissions}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-orange-500" />
              <div>
                <p className="font-medium text-sm">Storage Used</p>
                <p className="font-bold text-2xl text-orange-600">
                  {dbStats.storageUsed} MB
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-red-500" />
              <div>
                <p className="font-medium text-sm">Last Backup</p>
                <p className="font-bold text-red-600 text-sm">
                  {formatDate(dbStats.lastBackup.toISOString())}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </Card>

      <Card className="p-6">
        <Tabs
          className="mb-6"
          items={tabItems}
          onValueChange={setActiveTab}
          value={activeTab}
        />

        <TabsContent activeValue={activeTab} value="overview">
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <Card className="p-4">
                <div className="mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-500" />
                  <h3 className="font-semibold">Recent Activity</h3>
                </div>
                <div className="flex flex-col gap-3">
                  {submissions.slice(0, 5).map((submission, index) => (
                    <div
                      className="flex items-center justify-between text-sm"
                      key={submission.id}
                    >
                      <div>
                        <span className="font-medium">New submission</span>
                        <span className="ml-2 text-muted-foreground">
                          {allForms.find((f) => f.id === submission.form_id)
                            ?.title || 'Unknown Form'}
                        </span>
                      </div>
                      <span className="text-muted-foreground">
                        {formatDate(submission.submitted_at)}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-4">
                <div className="mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <h3 className="font-semibold">Growth Metrics</h3>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Users this week</span>
                    <Badge variant="secondary">
                      {
                        users.filter((u) => {
                          const weekAgo = new Date();
                          weekAgo.setDate(weekAgo.getDate() - 7);
                          return new Date(u.created_at) > weekAgo;
                        }).length
                      }
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Forms this week</span>
                    <Badge variant="secondary">
                      {
                        allForms.filter((f) => {
                          const weekAgo = new Date();
                          weekAgo.setDate(weekAgo.getDate() - 7);
                          return new Date(f.created_at) > weekAgo;
                        }).length
                      }
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Submissions this week</span>
                    <Badge variant="secondary">
                      {
                        submissions.filter((s) => {
                          const weekAgo = new Date();
                          weekAgo.setDate(weekAgo.getDate() - 7);
                          return new Date(s.submitted_at) > weekAgo;
                        }).length
                      }
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent activeValue={activeTab} value="users">
          <div className="mb-4 text-muted-foreground text-sm">
            Direct access to users table ({users.length} records)
          </div>
          <DataTable
            columns={[
              { key: 'uid', header: 'UID', sortable: true },
              {
                key: 'email',
                header: 'Email',
                sortable: true,
                filterable: true,
              },
              { key: 'name', header: 'Name', sortable: true, filterable: true },
              {
                key: 'has_premium',
                header: 'Premium',
                sortable: true,
                render: (value) => (value ? 'Yes' : 'No'),
              },
              {
                key: 'created_at',
                header: 'Created',
                sortable: true,
                render: (value) => formatDate(value),
              },
            ]}
            data={users}
            itemsPerPage={15}
            searchPlaceholder="Search users..."
            size="sm"
          />
        </TabsContent>

        <TabsContent activeValue={activeTab} value="forms">
          <div className="mb-4 text-muted-foreground text-sm">
            Direct access to forms table ({allForms.length} records)
          </div>
          <DataTable
            columns={[
              {
                key: 'id',
                header: 'Form ID',
                sortable: true,
                render: (value) => `${value.slice(0, 8)}...`,
              },
              {
                key: 'title',
                header: 'Title',
                sortable: true,
                filterable: true,
              },
              {
                key: 'user_id',
                header: 'Owner',
                sortable: true,
                render: (value) => `${value.slice(0, 8)}...`,
              },
              {
                key: 'is_published',
                header: 'Published',
                sortable: true,
                render: (value) => (value ? 'Yes' : 'No'),
              },
              {
                key: 'created_at',
                header: 'Created',
                sortable: true,
                render: (value) => formatDate(value),
              },
            ]}
            data={allForms}
            itemsPerPage={15}
            searchPlaceholder="Search forms..."
            size="sm"
          />
        </TabsContent>

        <TabsContent activeValue={activeTab} value="submissions">
          <div className="mb-4 text-muted-foreground text-sm">
            Direct access to submissions table ({submissions.length} records)
          </div>
          <DataTable
            columns={submissionsColumns}
            data={submissions}
            itemsPerPage={15}
            searchPlaceholder="Search submissions..."
            size="sm"
          />
        </TabsContent>
      </Card>
    </div>
  );
}
