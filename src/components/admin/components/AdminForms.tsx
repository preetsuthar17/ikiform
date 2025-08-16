'use client';

import {
  Calendar,
  CheckCircle,
  Edit,
  ExternalLink,
  Eye,
  FileText,
  Trash2,
  User,
  XCircle,
} from 'lucide-react';
import { formatDate } from '@/components/dashboard/forms-management/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DataTable, type DataTableColumn } from '@/components/ui/table';
import { useAdminData } from '../hooks/useAdminData';

interface AdminForm {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  slug?: string | null;
  submission_count?: number;
}

export function AdminForms() {
  const { allForms, submissions, loading, deleteForm } = useAdminData();

  const handleViewForm = (form: AdminForm) => {
    if (form.slug) {
      window.open(`/f/${form.slug}`, '_blank');
    }
  };

  const handleEditForm = (form: AdminForm) => {
    window.open(`/form-builder/${form.id}`, '_blank');
  };

  const handleDeleteForm = async (form: AdminForm) => {
    if (
      confirm(
        `⚠️ DELETE FORM: "${form.title}"\n\nThis will permanently delete:\n- The form\n- All submissions to this form\n\nThis action cannot be undone!\n\nContinue?`
      )
    ) {
      await deleteForm(form.id);
    }
  };

  const columns: DataTableColumn<AdminForm>[] = [
    {
      key: 'title',
      header: 'Form',
      sortable: true,
      filterable: true,
      render: (value, row) => (
        <div className="flex items-start gap-3">
          <div className="mt-1 rounded-md bg-primary/10 p-2">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate font-medium text-foreground">{value}</div>
            {row.description && (
              <div className="mt-1 line-clamp-2 text-muted-foreground text-xs">
                {row.description}
              </div>
            )}
            <div className="mt-2 flex items-center gap-2">
              <div className="flex items-center gap-1 text-muted-foreground text-xs">
                <User className="h-3 w-3" />
                <span>ID: {row.user_id.slice(0, 8)}...</span>
              </div>
              {row.slug && (
                <div className="flex items-center gap-1 text-muted-foreground text-xs">
                  <ExternalLink className="h-3 w-3" />
                  <span>/f/{row.slug}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'is_published',
      header: 'Status',
      sortable: true,
      filterable: true,
      align: 'center',
      render: (value) => (
        <Badge className="gap-1" variant={value ? 'default' : 'secondary'}>
          {value ? (
            <CheckCircle className="h-3 w-3" />
          ) : (
            <XCircle className="h-3 w-3" />
          )}
          {value ? 'Published' : 'Draft'}
        </Badge>
      ),
    },
    {
      key: 'submission_count',
      header: 'Submissions',
      sortable: true,
      align: 'center',
      render: (value) => <div className="font-medium">{value || 0}</div>,
    },
    {
      key: 'created_at',
      header: 'Created',
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
      key: 'updated_at',
      header: 'Last Updated',
      sortable: true,
      render: (value) => (
        <div className="text-muted-foreground text-sm">{formatDate(value)}</div>
      ),
    },
    {
      key: 'id',
      header: 'Actions',
      align: 'right',
      render: (value, row) => (
        <div className="flex items-center gap-1">
          <Button
            disabled={!row.slug}
            onClick={(e) => {
              e.stopPropagation();
              handleViewForm(row);
            }}
            size="sm"
            title="View Form"
            variant="ghost"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleEditForm(row);
            }}
            size="sm"
            title="Edit Form"
            variant="ghost"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            className="text-red-500 hover:text-red-700"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteForm(row);
            }}
            size="sm"
            title="Delete Form"
            variant="ghost"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
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
          searchPlaceholder="Search forms..."
        />
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-primary/10 p-2">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-xl">Forms Analytics</h2>
              <p className="text-muted-foreground text-sm">
                Overview of your forms and submissions
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-blue-100 p-2">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="font-bold text-2xl">{allForms.length}</div>
                <div className="text-muted-foreground text-sm">Total Forms</div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-green-100 p-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div className="font-bold text-2xl">
                  {allForms.filter((f) => f.is_published).length}
                </div>
                <div className="text-muted-foreground text-sm">Published</div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-yellow-100 p-2">
                <XCircle className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <div className="font-bold text-2xl">
                  {allForms.filter((f) => !f.is_published).length}
                </div>
                <div className="text-muted-foreground text-sm">Drafts</div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-purple-100 p-2">
                <Eye className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <div className="font-bold text-2xl">{submissions.length}</div>
                <div className="text-muted-foreground text-sm">
                  Total Submissions
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-primary/10 p-2">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-xl">Forms Management</h2>
              <p className="text-muted-foreground text-sm">
                {allForms.length} forms total
              </p>
            </div>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={allForms}
          emptyIcon="📝"
          emptyMessage="No forms found"
          hoverable
          itemsPerPage={10}
          onRowClick={(form) => handleViewForm(form)}
          searchPlaceholder="Search forms by title or description..."
          striped
        />
      </Card>
    </div>
  );
}
