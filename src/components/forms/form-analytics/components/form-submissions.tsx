"use client";

import {
  ArrowLeft,
  Calendar,
  Download,
  Eye,
  FileText,
  Globe,
  RefreshCw,
  Search,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import type { Form, FormSubmission } from "@/lib/database";

interface FormSubmissionsProps {
  form: Form;
  submissions: FormSubmission[];
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getFieldLabel = (form: Form, fieldId: string) => {
  const allFields = [
    ...(form.schema.fields || []),
    ...(form.schema.blocks?.flatMap((block) => block.fields || []) || []),
  ];
  const field = allFields.find((f) => f.id === fieldId);
  return field?.label || fieldId;
};

const exportToCSV = (form: Form, submissions: FormSubmission[]) => {
  if (submissions.length === 0) {
    toast.error("No submissions to export");
    return;
  }

  const allFields = [
    ...(form.schema.fields || []),
    ...(form.schema.blocks?.flatMap((block) => block.fields || []) || []),
  ];

  const headers = ["Submission ID", "Submitted At", "IP Address", ...allFields.map((f) => f.label || f.id)];
  
  const csvContent = [
    headers.join(","),
    ...submissions.map((submission) => [
      submission.id,
      submission.submitted_at,
      submission.ip_address || "",
      ...allFields.map((field) => {
        const value = submission.submission_data[field.id];
        if (value === null || value === undefined) return "";
        if (typeof value === "object") return JSON.stringify(value);
        return String(value).replace(/,/g, ";");
      }),
    ].join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${form.title}_submissions.csv`;
  link.click();
  URL.revokeObjectURL(url);
  
  toast.success("CSV exported successfully");
};

const exportToJSON = (form: Form, submissions: FormSubmission[]) => {
  if (submissions.length === 0) {
    toast.error("No submissions to export");
    return;
  }

  const dataStr = JSON.stringify(submissions, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${form.title}_submissions.json`;
  link.click();
  URL.revokeObjectURL(url);
  
  toast.success("JSON exported successfully");
};

export function FormSubmissions({ form, submissions }: FormSubmissionsProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);

  const filteredSubmissions = submissions.filter((submission) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      submission.id.toLowerCase().includes(searchLower) ||
      submission.ip_address?.toLowerCase().includes(searchLower) ||
      Object.values(submission.submission_data).some((value) =>
        String(value).toLowerCase().includes(searchLower)
      )
    );
  });

  const allFields = [
    ...(form.schema.fields || []),
    ...(form.schema.blocks?.flatMap((block) => block.fields || []) || []),
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header Section */}
        <Card className="mb-8">
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Button asChild variant="ghost" size="sm">
                    <Link 
                      href={`/dashboard/forms/${form.id}/analytics`}
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                    >
                      <ArrowLeft className="size-4" />
                      Back to Analytics
                    </Link>
                  </Button>
                </div>
                
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                      {form.title}
                    </h1>
                    <Badge
                      className="gap-1.5"
                      variant={form.is_published ? "default" : "secondary"}
                    >
                      {form.is_published ? (
                        <>
                          <Globe className="size-3" />
                          Published
                        </>
                      ) : (
                        <>
                          <User className="size-3" />
                          Draft
                        </>
                      )}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="size-4" />
                    <span className="text-sm">Form Submissions ({submissions.length})</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => exportToCSV(form, submissions)}
                  disabled={submissions.length === 0}
                  variant="outline"
                  size="sm"
                >
                  <Download className="mr-2 size-4" />
                  Export CSV
                </Button>
                <Button
                  onClick={() => exportToJSON(form, submissions)}
                  disabled={submissions.length === 0}
                  variant="outline"
                  size="sm"
                >
                  <Download className="mr-2 size-4" />
                  Export JSON
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Submissions Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="size-5" />
                Submissions
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search submissions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredSubmissions.length === 0 ? (
              <div className="flex flex-col items-center gap-6 py-16">
                <div className="gradient-bg flex size-24 items-center justify-center rounded-2xl">
                  <FileText className="size-10 text-accent-foreground" />
                </div>
                <h4 className="font-semibold text-foreground text-xl">
                  {searchTerm ? "No matching submissions" : "No submissions yet"}
                </h4>
                <p className="max-w-md text-center text-muted-foreground">
                  {searchTerm 
                    ? "Try adjusting your search terms to find submissions."
                    : "Once people start filling out your form, their responses will appear here."
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Fields</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubmissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell className="font-mono text-sm">
                          {submission.id.slice(-8)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="size-4 text-muted-foreground" />
                            {formatDate(submission.submitted_at)}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {submission.ip_address || "N/A"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {Object.keys(submission.submission_data).length} fields
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedSubmission(submission)}
                              >
                                <Eye className="mr-2 size-4" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>
                                  Submission Details - {submission.id.slice(-8)}
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-6">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                      Submission ID
                                    </label>
                                    <p className="font-mono text-sm">{submission.id}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                      Submitted At
                                    </label>
                                    <p className="text-sm">{formatDate(submission.submitted_at)}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                      IP Address
                                    </label>
                                    <p className="font-mono text-sm">{submission.ip_address || "N/A"}</p>
                                  </div>
                                </div>
                                
                                <Separator />
                                
                                <div>
                                  <h3 className="font-semibold text-lg mb-4">Form Data</h3>
                                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {Object.entries(submission.submission_data).map(([fieldId, value]) => {
                                      const fieldLabel = getFieldLabel(form, fieldId);
                                      
                                      return (
                                        <div key={fieldId} className="space-y-2">
                                          <label className="text-sm font-medium text-muted-foreground">
                                            {fieldLabel}
                                          </label>
                                          <div className="rounded-lg border border-border bg-muted/50 p-3">
                                            <p className="text-sm">
                                              {Array.isArray(value)
                                                ? value.join(", ")
                                                : typeof value === "object" && value !== null
                                                ? JSON.stringify(value, null, 2)
                                                : String(value) || "—"}
                                            </p>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
