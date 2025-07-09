import React, { useState } from "react";

// UI Components
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { DataTable, type DataTableColumn } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent } from "@/components/ui/tabs";

// Icons
import {
  Download,
  Eye,
  FileText,
  RefreshCw,
  Table,
  LayoutGrid,
  Search,
  Clock,
  Globe,
} from "lucide-react";

// Types and Utilities
import type { Form, FormSubmission } from "@/lib/database";
import type { SubmissionsListProps, FilterState } from "../types";
import {
  filterSubmissions,
  getSubmissionCompletionRate,
} from "../utils/analytics";

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
  const [activeView, setActiveView] = useState<"cards" | "table">("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterState, setFilterState] = useState<FilterState>({
    timeRange: "all",
    completionRate: "all",
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
      key: "submitted_at",
      header: "Date",
      render: (value) => formatDate(value.toString()),
    },
    {
      key: "submission_data",
      header: "Form Data",
      render: (value, row) => (
        <div className="flex items-center gap-4">
          <Badge variant="outline">{Object.keys(value).length} fields</Badge>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto"
            onClick={(e) => {
              e.stopPropagation();
              onViewSubmission(row);
            }}
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
      <div className="flex items-center justify-center flex-col gap-4 py-20">
        <div className="p-4 rounded-card">
          <FileText className="w-8 h-8 text-accent" />
        </div>
        <div className="text-center">
          <p className="text-foreground font-medium">Loading submissions...</p>
          <p className="text-sm text-muted-foreground">
            Fetching your form data
          </p>
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-card border-border">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-card">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              Form Submissions
            </h3>
            <p className="text-sm text-muted-foreground">
              View and analyze form responses
            </p>
          </div>
        </div>
        {submissions.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={refreshing}
                className="gap-2 hover:bg-accent transition-colors"
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onExportCSV}
                disabled={submissions.length === 0}
                className="gap-2 hover:bg-accent transition-colors"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onExportJSON}
                className="gap-2 hover:bg-accent transition-colors"
              >
                <Download className="w-4 h-4" />
                Export JSON
              </Button>
            </div>
            <Tabs
              value={activeView}
              onValueChange={(value) =>
                setActiveView(value as "cards" | "table")
              }
              items={[
                {
                  id: "cards",
                  icon: <LayoutGrid className="w-4 h-4" />,
                },
                {
                  id: "table",
                  icon: <Table className="w-4 h-4" />,
                },
              ]}
              variant="default"
              size="sm"
              className="w-auto"
            />
            <Badge variant="secondary" className="text-xs">
              {submissions.length} total
            </Badge>
          </div>
        )}
      </div>

      <div className="p-6">
        {submissions.length === 0 ? (
          <div className="flex flex-col items-center gap-6 py-16">
            <div className="gradient-bg w-24 h-24 rounded-card flex items-center justify-center">
              <Eye className="w-10 h-10 text-accent-foreground" />
            </div>
            <h4 className="text-xl font-semibold text-foreground">
              No submissions yet
            </h4>
            <p className="text-muted-foreground max-w-md text-center">
              Once people start filling out your form, their responses will
              appear here with detailed analytics and insights.
            </p>
            {!form.is_published && (
              <div className="flex flex-col items-center gap-3">
                <Button variant="outline" size="sm" className="gap-2">
                  <Globe className="w-4 h-4" />
                  Publish Form
                </Button>
                <p className="text-xs text-muted-foreground">
                  Publish your form to start collecting responses
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search submissions..."
                  value={searchTerm}
                  leftIcon={<Search className="w-4 h-4" />}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                value={filterState.timeRange}
                onValueChange={(value) =>
                  setFilterState((prev) => ({
                    ...prev,
                    timeRange: value as "all" | "today" | "week" | "month",
                  }))
                }
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
                value={filterState.completionRate}
                onValueChange={(value) =>
                  setFilterState((prev) => ({
                    ...prev,
                    completionRate: value as
                      | "all"
                      | "complete"
                      | "partial"
                      | "empty",
                  }))
                }
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

            <TabsContent value="cards" activeValue={activeView}>
              <div className="flex flex-col gap-4">
                {filteredSubmissions.slice(0, 10).map((submission) => (
                  <div key={submission.id}>
                    <Card className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="text-sm font-medium text-foreground">
                            Submission {submission.id.slice(-8)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(submission.submitted_at)}
                          </span>
                          {submission.ip_address && (
                            <span>IP: {submission.ip_address}</span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(submission.submission_data).map(
                          ([fieldId, value]) => (
                            <div key={fieldId} className="flex flex-col gap-2">
                              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                {getFieldLabel(fieldId)}
                              </label>
                              <div className="p-2 bg-input border border-border rounded-ele">
                                <p className="text-sm text-foreground line-clamp-2">
                                  {Array.isArray(value)
                                    ? value.join(", ")
                                    : typeof value === "object" &&
                                        value !== null
                                      ? JSON.stringify(value)
                                      : String(value) || "—"}
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </Card>
                    <Separator className="mt-4" />
                  </div>
                ))}

                {filteredSubmissions.length > 10 && (
                  <div className="text-center pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-3">
                      Showing 10 of {filteredSubmissions.length} submissions
                    </p>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="w-4 h-4" />
                      View All Submissions
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="table" activeValue={activeView}>
              <div className="-mx-6">
                <DataTable
                  data={filteredSubmissions}
                  columns={tableColumns}
                  searchable
                  searchPlaceholder="Search submissions..."
                  itemsPerPage={10}
                  showPagination
                  hoverable
                  bordered
                  variant="bordered"
                  size="default"
                />
              </div>
            </TabsContent>
          </div>
        )}
      </div>
    </Card>
  );
};
