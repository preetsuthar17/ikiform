'use client';

import {
  AlertTriangle,
  Calendar,
  Crown,
  Mail,
  Settings,
  Shield,
  Trash2,
  User,
  UserCheck,
  UserX,
} from 'lucide-react';
import { formatDate } from '@/components/dashboard/forms-management/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DataTable, type DataTableColumn } from '@/components/ui/table';
import { useAdminData } from '../hooks/useAdminData';
import {
  GradientAreaChart,
  GradientBarChart,
  GradientPieChart,
} from './charts';

interface AdminUser {
  uid: string;
  email: string;
  name: string;
  has_premium: boolean;
  created_at: string;
  updated_at: string;
  polar_customer_id: string | null;
  form_count?: number;
  submission_count?: number;
}

const FOUNDER_USER_ID = '2be7479a-bf3c-4951-ab71-65bb148b235c';

export function AdminUsers() {
  const { users, loading, toggleUserPremium, deleteUser } = useAdminData();

  const handleTogglePremium = async (user: AdminUser) => {
    if (
      confirm(
        `${user.has_premium ? 'Remove' : 'Grant'} premium access for ${user.email}?`
      )
    ) {
      await toggleUserPremium(user.email, !user.has_premium);
    }
  };

  const handleDeleteUser = async (user: AdminUser) => {
    if (user.uid === FOUNDER_USER_ID) {
      alert('Cannot delete the founder account!');
      return;
    }

    if (
      confirm(
        `⚠️ DELETE USER: ${user.email}\n\nThis will permanently delete:\n- The user account\n- All their forms\n- All submissions to their forms\n- All AI chat data\n\nThis action cannot be undone!\n\nType "DELETE" to confirm:`
      )
    ) {
      const confirmation = prompt('Type "DELETE" to confirm this action:');
      if (confirmation === 'DELETE') {
        await deleteUser(user.uid);
      }
    }
  };

  const columns: DataTableColumn<AdminUser>[] = [
    {
      key: 'email',
      header: 'User',
      sortable: true,
      filterable: true,
      render: (value, row) => (
        <div className="flex items-start gap-3">
          <div
            className={`mt-1 rounded-md p-2 ${
              row.uid === FOUNDER_USER_ID
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-primary/10'
            }`}
          >
            {row.uid === FOUNDER_USER_ID ? (
              <Crown className="h-4 w-4" />
            ) : (
              <User className="h-4 w-4 text-primary" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-foreground">{row.name}</div>
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <Mail className="h-3 w-3" />
              {value}
            </div>
            {row.uid === FOUNDER_USER_ID && (
              <Badge
                className="mt-1 border-yellow-200 bg-yellow-50 text-xs text-yellow-700"
                variant="outline"
              >
                <Shield className="mr-1 h-3 w-3" />
                Founder
              </Badge>
            )}
            <div className="mt-1 flex items-center gap-2">
              <div className="text-muted-foreground text-xs">
                Forms: {row.form_count || 0}
              </div>
              <div className="text-muted-foreground text-xs">
                Submissions: {row.submission_count || 0}
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'has_premium',
      header: 'Plan',
      sortable: true,
      filterable: true,
      align: 'center',
      render: (value, row) => (
        <Badge className="gap-1" variant={value ? 'default' : 'secondary'}>
          {value ? (
            <Crown className="h-3 w-3" />
          ) : (
            <UserCheck className="h-3 w-3" />
          )}
          {value ? 'Premium' : 'Free'}
        </Badge>
      ),
    },
    {
      key: 'updated_at',
      header: 'Last Updated',
      sortable: true,
      render: (value) => (
        <div className="text-muted-foreground text-sm">{formatDate(value)}</div>
      ),
    },
    {
      key: 'created_at',
      header: 'Joined',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div>
            <div>{formatDate(value)}</div>
            <div className="text-muted-foreground text-xs">
              {new Date(value).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'uid',
      header: 'Actions',
      align: 'center',
      render: (value, row) => (
        <div className="flex items-center gap-1">
          {row.uid !== FOUNDER_USER_ID && (
            <>
              <Button
                className={
                  row.has_premium ? 'text-orange-600' : 'text-green-600'
                }
                onClick={(e) => {
                  e.stopPropagation();
                  handleTogglePremium(row);
                }}
                size="sm"
                title={row.has_premium ? 'Remove Premium' : 'Grant Premium'}
                variant="ghost"
              >
                <Crown className="h-4 w-4" />
              </Button>
              <Button
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteUser(row);
                }}
                size="sm"
                title="Delete User (Dangerous!)"
                variant="ghost"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <Card className="p-6">
        <DataTable
          columns={columns}
          data={[]}
          loading={true}
          searchPlaceholder="Search users..."
        />
      </Card>
    );
  }

  const chartData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const dateStr = date.toISOString().split('T')[0];

    return {
      date: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      users: users.filter((u) => u.created_at.startsWith(dateStr)).length,
      premium_signups: users.filter(
        (u) => u.created_at.startsWith(dateStr) && u.has_premium
      ).length,
    };
  });

  const userTypeData = [
    { name: 'Premium Users', value: users.filter((u) => u.has_premium).length },
    { name: 'Free Users', value: users.filter((u) => !u.has_premium).length },
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-primary/10 p-2">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-xl">Users Management</h2>
              <p className="text-muted-foreground text-sm">
                {users.length} users total •{' '}
                {users.filter((u) => u.has_premium).length} premium
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium text-sm">Total Users</p>
                <p className="font-bold text-2xl text-blue-600">
                  {users.length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="font-medium text-sm">Premium Users</p>
                <p className="font-bold text-2xl text-yellow-600">
                  {users.filter((u) => u.has_premium).length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium text-sm">Active Users</p>
                <p className="font-bold text-2xl text-green-600">
                  {users.filter((u) => u.updated_at).length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              <div>
                <p className="font-medium text-sm">This Week</p>
                <p className="font-bold text-2xl text-purple-600">
                  {
                    users.filter((u) => {
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return new Date(u.created_at) > weekAgo;
                    }).length
                  }
                </p>
              </div>
            </div>
          </Card>
        </div>

        <DataTable
          columns={columns}
          data={users}
          emptyIcon="👥"
          emptyMessage="No users found"
          hoverable
          itemsPerPage={10}
          searchPlaceholder="Search users by name or email..."
          striped
        />
      </Card>
    </div>
  );
}
