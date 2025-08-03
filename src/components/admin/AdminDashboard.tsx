'use client';

import {
  BarChart3,
  Database,
  FileText,
  RefreshCw,
  Shield,
  Trash2,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { AdminAnalytics } from './components/AdminAnalytics';
import { AdminDatabase } from './components/AdminDatabase';
import { AdminForms } from './components/AdminForms';
import { AdminUsers } from './components/AdminUsers';
import { GradientAreaChart } from './components/charts';
import { useAdminData } from './hooks/useAdminData';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('analytics');
  const { refreshData, clearCache, loading, users, allForms, submissions } =
    useAdminData();

  const systemOverview = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0];

    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      activity:
        users.filter(
          (u) =>
            u.created_at.startsWith(dateStr) || u.updated_at.startsWith(dateStr)
        ).length +
        allForms.filter((f) => f.created_at.startsWith(dateStr)).length +
        submissions.filter((s) => s.submitted_at.startsWith(dateStr)).length,
    };
  });

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            className="gap-2"
            disabled={loading}
            onClick={clearCache}
            size="sm"
            variant="outline"
          >
            <Trash2 className="h-4 w-4" />
            Clear Cache
          </Button>
          <Button
            className="gap-2"
            disabled={loading}
            onClick={refreshData}
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </div>
      </div>

      <Tabs
        className="mb-6"
        items={[
          { id: 'analytics', label: 'Analytics', icon: <BarChart3 /> },
          { id: 'users', label: 'Users', icon: <Users /> },
          { id: 'forms', label: 'Forms', icon: <FileText /> },
          { id: 'database', label: 'Database', icon: <Database /> },
        ]}
        onValueChange={setActiveTab}
        value={activeTab}
      />

      <TabsContent activeValue={activeTab} value="analytics">
        <AdminAnalytics />
      </TabsContent>

      <TabsContent activeValue={activeTab} value="users">
        <AdminUsers />
      </TabsContent>

      <TabsContent activeValue={activeTab} value="forms">
        <AdminForms />
      </TabsContent>

      <TabsContent activeValue={activeTab} value="database">
        <AdminDatabase />
      </TabsContent>
    </div>
  );
}
