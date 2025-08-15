import {
  Clock,
  Download,
  Eye,
  FileText,
  Globe,
  LayoutGrid,
  RefreshCw,
  Search,
  Table,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { DataTable, type DataTableColumn } from '@/components/ui/table';
import { Tabs, TabsContent } from '@/components/ui/tabs';

import type { Form, FormSubmission } from '@/lib/database';
import type { FilterState, SubmissionsListProps } from '../types';
import {
  filterSubmissions,
  getSubmissionCompletionRate,
} from '../utils/analytics';

export const SubmissionsList: React.FC<SubmissionsListProps> = ({
  form,
  submissions,
  loading,
  refreshing,
  onRefresh,
  onExportCSV,
  onExportJSON,
  onViewSubmission,
  getFieldLabel,
  formatDate,
}) => {
  const [activeView, setActiveView] = useState<'cards' | 'table'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState<FilterState>({
    timeRange: 'all',
    completionRate: 'all',
  });

  const totalFields = Math.max(
    form.schema.fields?.length || 0,
    form.schema.blocks?.reduce(
      (total, block) => total + (block.fields?.length || 0),
      0
    ) || 0
  );

  const filteredSubmissions = filterSubmissions(
    submissions,
    searchTerm,
    filterState,
    totalFields
  );

  const tableColumns: DataTableColumn<FormSubmission>[] = [
    {
      key: 'submitted_at',
      header: 'Date',
      render: (value) => formatDate(value.toString()),
    },
    {
      key: 'submission_data',
      header: 'Form Data',
      render: (value, row) => (
        <div className="flex items-center gap-4">
          <Badge variant="outline">{Object.keys(value).length} fields</Badge>
          <Button
            className="ml-auto"
            onClick={(e) => {
              e.stopPropagation();
              onViewSubmission(row);
            }}
            size="sm"
            variant="ghost"
          >
            <Eye className="h-4 w-4" />
            View Details
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <div className="rounded-card p-4">
          <FileText className="h-8 w-8 text-accent" />
        </div>
        <div className="text-center">
          <p className="font-medium text-foreground">Loading submissions...</p>
          <p className="text-muted-foreground text-sm">
            Fetching your form data
          </p>
        </div>
      </div>
    );
  }

  return (
    <Card className="flex flex-col gap-6 border-border bg-card p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="rounded-card bg-primary/10 p-2">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-xl">
              Form Submissions
            </h3>
            <p className="text-muted-foreground text-sm">
              View and analyze form responses
            </p>
          </div>
        </div>
        {submissions.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Button
                className="gap-2 transition-colors hover:bg-accent"
                disabled={refreshing}
                onClick={onRefresh}
                size="sm"
                variant="outline"
              >
                <RefreshCw
                  className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
                />
                Refresh
              </Button>
              <Button
                className="gap-2 transition-colors hover:bg-accent"
                disabled={submissions.length === 0}
                onClick={onExportCSV}
                size="sm"
                variant="outline"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
              <Button
                className="gap-2 transition-colors hover:bg-accent"
                onClick={onExportJSON}
                size="sm"
                variant="outline"
              >
                <Download className="h-4 w-4" />
                Export JSON
              </Button>
            </div>
            <Tabs
              className="w-auto"
              items={[
                {
                  id: 'cards',
                  icon: <LayoutGrid className="h-4 w-4" />,
                },
                {
                  id: 'table',
                  icon: <Table className="h-4 w-4" />,
                },
              ]}
              onValueChange={(value) =>
                setActiveView(value as 'cards' | 'table')
              }
              size="sm"
              value={activeView}
              variant="default"
            />
            <Badge className="text-xs" variant="secondary">
              {submissions.length} total
            </Badge>
          </div>
        )}
      </div>
      <Separator />
      <div>
        {submissions.length === 0 ? (
          <div className="flex flex-col items-center gap-6 py-16">
            <div className="gradient-bg flex h-24 w-24 items-center justify-center rounded-card">
              <Eye className="h-10 w-10 text-accent-foreground" />
            </div>
            <h4 className="font-semibold text-foreground text-xl">
              No submissions yet
            </h4>
            <p className="max-w-md text-center text-muted-foreground">
              Once people start filling out your form, their responses will
              appear here with detailed analytics and insights.
            </p>
            {!form.is_published && (
              <div className="flex flex-col items-center gap-3">
                <Button className="gap-2" size="sm" variant="outline">
                  <Globe className="h-4 w-4" />
                  Publish Form
                </Button>
                <p className="text-muted-foreground text-xs">
                  Publish your form to start collecting responses
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="relative max-w-md flex-1">
                <Input
                  leftIcon={<Search className="h-4 w-4" />}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search submissions..."
                  value={searchTerm}
                />
              </div>
              <Select
                onValueChange={(value) =>
                  setFilterState((prev) => ({
                    ...prev,
                    timeRange: value as 'all' | 'today' | 'week' | 'month',
                  }))
                }
                value={filterState.timeRange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
              <Select
                onValueChange={(value) =>
                  setFilterState((prev) => ({
                    ...prev,
                    completionRate: value as
                      | 'all'
                      | 'complete'
                      | 'partial'
                      | 'empty',
                  }))
                }
                value={filterState.completionRate}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select completion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Submissions</SelectItem>
                  <SelectItem value="complete">Complete</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="empty">Empty</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <TabsContent activeValue={activeView} value="cards">
              <div className="flex flex-col gap-4">
                {filteredSubmissions.slice(0, 10).map((submission) => (
                  <div key={submission.id}>
                    <Card className="p-4">
                      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-card bg-primary" />
                          <span className="font-medium text-foreground text-sm">
                            Submission {submission.id.slice(-8)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-muted-foreground text-xs">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(submission.submitted_at)}
                          </span>
                          {submission.ip_address && (
                            <span>IP: {submission.ip_address}</span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {Object.entries(submission.submission_data).map(
                          ([fieldId, value]) => {
                            const allFields = [
                              ...(form.schema.fields || []),
                              ...(form.schema.blocks?.flatMap(
                                (block) => block.fields || []
                              ) || []),
                            ];
                            const field = allFields.find(
                              (f) => f.id === fieldId
                            );

                            if (
                              field?.type === 'signature' &&
                              typeof value === 'string' &&
                              value.startsWith('data:image')
                            ) {
                              return (
                                <div
                                  className="flex flex-col gap-2"
                                  key={fieldId}
                                >
                                  <label className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                                    {getFieldLabel(fieldId)}
                                  </label>
                                  <div className="flex items-center justify-center rounded-ele border border-border bg-input p-2">
                                    <img
                                      alt="Signature"
                                      className="max-h-24 max-w-full rounded border"
                                      src={value}
                                    />
                                  </div>
                                </div>
                              );
                            }

                            if (
                              field?.type === 'social' &&
                              typeof value === 'object' &&
                              value !== null
                            ) {
                              const customLinks =
                                field.settings?.customLinks || [];
                              return (
                                <div
                                  className="flex flex-col gap-2"
                                  key={fieldId}
                                >
                                  <label className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                                    {getFieldLabel(fieldId)}
                                  </label>
                                  <div className="flex flex-col gap-1 rounded-ele border border-border bg-input p-2">
                                    {Object.entries(value).map(([key, url]) => {
                                      let label = key;
                                      if (key.startsWith('custom_')) {
                                        const idx = Number.parseInt(
                                          key.replace('custom_', ''),
                                          10
                                        );
                                        label =
                                          customLinks[idx]?.label ||
                                          `Custom Link ${idx + 1}`;
                                      } else {
                                        label =
                                          key.charAt(0).toUpperCase() +
                                          key.slice(1);
                                      }
                                      return (
                                        <a
                                          className="text-primary underline"
                                          href={
                                            typeof url === 'string'
                                              ? url
                                              : undefined
                                          }
                                          key={key}
                                          rel="noopener noreferrer"
                                          target="_blank"
                                        >
                                          {label}
                                        </a>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            }

                            // Handle file uploads
                            if (field?.type === 'file' && value) {
                              const files = Array.isArray(value)
                                ? value
                                : [value];
                              const fileCount = files.length;
                              const hasImages = files.some(
                                (file) =>
                                  (typeof file === 'object' &&
                                    file.type?.startsWith('image/')) ||
                                  (typeof file === 'string' &&
                                    file.match(
                                      /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i
                                    ))
                              );

                              return (
                                <div
                                  className="flex flex-col gap-2"
                                  key={fieldId}
                                >
                                  <label className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                                    {getFieldLabel(fieldId)}
                                  </label>
                                  <div className="rounded-ele border border-border bg-input p-2">
                                    <div className="flex items-center gap-2">
                                      <div className="-space-x-1 flex">
                                        {files.slice(0, 3).map((file, idx) => {
                                          const isFileObj =
                                            typeof file === 'object' &&
                                            file.signedUrl;
                                          const isImage = isFileObj
                                            ? file.type?.startsWith('image/')
                                            : typeof file === 'string' &&
                                              file.match(
                                                /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i
                                              );
                                          const url = isFileObj
                                            ? file.signedUrl
                                            : file;

                                          return isImage ? (
                                            <img
                                              alt="File preview"
                                              className="h-8 w-8 rounded border border-white object-cover"
                                              key={idx}
                                              src={url}
                                            />
                                          ) : (
                                            <div
                                              className="flex h-8 w-8 items-center justify-center rounded border border-white bg-accent"
                                              key={idx}
                                            >
                                              <span className="font-mono text-xs">
                                                {isFileObj
                                                  ? file.name
                                                      ?.split('.')
                                                      .pop()
                                                      ?.slice(0, 3)
                                                      .toUpperCase()
                                                  : 'FILE'}
                                              </span>
                                            </div>
                                          );
                                        })}
                                        {fileCount > 3 && (
                                          <div className="flex h-8 w-8 items-center justify-center rounded border border-white bg-muted">
                                            <span className="text-xs">
                                              +{fileCount - 3}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                      <span className="text-muted-foreground text-xs">
                                        {fileCount} file
                                        {fileCount !== 1 ? 's' : ''}{' '}
                                        {hasImages ? '(with images)' : ''}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              );
                            }

                            return (
                              <div
                                className="flex flex-col gap-2"
                                key={fieldId}
                              >
                                <label className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                                  {getFieldLabel(fieldId)}
                                </label>
                                <div className="rounded-ele border border-border bg-input p-2">
                                  <p className="line-clamp-2 text-foreground text-sm">
                                    {Array.isArray(value)
                                      ? value.join(', ')
                                      : typeof value === 'object' &&
                                          value !== null
                                        ? JSON.stringify(value)
                                        : String(value) || '—'}
                                  </p>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </Card>
                    <Separator className="mt-4" />
                  </div>
                ))}

                {filteredSubmissions.length > 10 && (
                  <div className="border-border border-t pt-4 text-center">
                    <p className="mb-3 text-muted-foreground text-sm">
                      Showing 10 of {filteredSubmissions.length} submissions
                    </p>
                    <Button className="gap-2" size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                      View All Submissions
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent activeValue={activeView} value="table">
              <div className="-mx-6 p-4">
                <DataTable
                  bordered
                  columns={tableColumns}
                  data={filteredSubmissions}
                  hoverable
                  itemsPerPage={10}
                  searchable
                  searchPlaceholder="Search submissions..."
                  showPagination
                  size="default"
                  variant="bordered"
                />
              </div>
            </TabsContent>
          </div>
        )}
      </div>
    </Card>
  );
};
