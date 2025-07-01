"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { formsDb } from "@/lib/database";
import { toast } from "@/hooks/use-toast";
import type { Form, FormSubmission } from "@/lib/database";

interface FormAnalyticsProps {
  form: Form;
}

export function FormAnalytics({ form }: FormAnalyticsProps) {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubmissions();
  }, [form.id]);

  const loadSubmissions = async () => {
    try {
      const formSubmissions = await formsDb.getFormSubmissions(form.id);
      setSubmissions(formSubmissions);
    } catch (error) {
      console.error("Error loading submissions:", error);
      toast.error("Failed to load form submissions");
    } finally {
      setLoading(false);
    }
  };

  const exportToJSON = () => {
    const exportData = {
      form: {
        id: form.id,
        title: form.title,
        description: form.description,
        schema: form.schema,
        created_at: form.created_at,
        updated_at: form.updated_at,
      },
      submissions: submissions.map((submission) => ({
        id: submission.id,
        data: submission.submission_data,
        submitted_at: submission.submitted_at,
        ip_address: submission.ip_address,
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.title
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase()}_data.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Data exported successfully!");
  };

  const exportToCSV = () => {
    if (submissions.length === 0) {
      toast.error("No data to export");
      return;
    }

    // Get all unique field keys from submissions
    const allFields = new Set<string>();
    submissions.forEach((submission) => {
      Object.keys(submission.submission_data).forEach((key) =>
        allFields.add(key)
      );
    });

    // Create header row
    const headers = [
      "Submission ID",
      "Submitted At",
      "IP Address",
      ...Array.from(allFields),
    ];

    // Create data rows
    const rows = submissions.map((submission) => {
      const row = [
        submission.id,
        new Date(submission.submitted_at).toISOString(),
        submission.ip_address || "",
      ];

      // Add field values in order
      Array.from(allFields).forEach((field) => {
        const value = submission.submission_data[field];
        if (Array.isArray(value)) {
          row.push(value.join(", "));
        } else if (typeof value === "object" && value !== null) {
          row.push(JSON.stringify(value));
        } else {
          row.push(value || "");
        }
      });

      return row;
    });

    // Convert to CSV
    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.title
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase()}_data.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Data exported to CSV successfully!");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFieldLabel = (fieldId: string) => {
    const field = form.schema.fields.find((f) => f.id === fieldId);
    return field?.label || fieldId;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{form.title}</h2>
          <p className="text-gray-600">Form Analytics & Submissions</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant={form.is_published ? "default" : "secondary"}>
            {form.is_published ? "Published" : "Draft"}
          </Badge>
          <Button
            variant="outline"
            onClick={exportToCSV}
            disabled={submissions.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={exportToJSON}>
            <Download className="w-4 h-4 mr-2" />
            Export JSON
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Total Submissions
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {submissions.length}
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Form Fields
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {form.schema.fields.length}
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Last Submission
          </h3>
          <p className="text-lg font-bold text-gray-900">
            {submissions.length > 0
              ? formatDate(submissions[0].submitted_at)
              : "No submissions yet"}
          </p>
        </Card>
      </div>

      {/* Submissions List */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Submissions</h3>

        {submissions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Eye className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No submissions yet</p>
            <p className="text-sm">
              Share your form to start collecting responses
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.slice(0, 10).map((submission) => (
              <Card key={submission.id} className="p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500">
                    {formatDate(submission.submitted_at)}
                  </span>
                  {submission.ip_address && (
                    <span className="text-xs text-gray-400">
                      IP: {submission.ip_address}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(submission.submission_data).map(
                    ([fieldId, value]) => (
                      <div key={fieldId}>
                        <label className="text-sm font-medium text-gray-700">
                          {getFieldLabel(fieldId)}
                        </label>
                        <p className="text-gray-900 mt-1">
                          {Array.isArray(value)
                            ? value.join(", ")
                            : typeof value === "object" && value !== null
                            ? JSON.stringify(value)
                            : String(value)}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </Card>
            ))}

            {submissions.length > 10 && (
              <p className="text-center text-gray-500 text-sm">
                Showing 10 of {submissions.length} submissions. Export data to
                see all.
              </p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
