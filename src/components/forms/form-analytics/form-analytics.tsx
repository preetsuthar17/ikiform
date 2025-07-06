"use client";

// React imports
import React, { useState, useEffect } from "react";

// Next.js imports
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

// UI component imports
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/ui/loader";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Icon imports
import {
  Globe,
  Eye,
  BarChart3,
  Sparkles,
  Edit,
  Share,
  Trash2,
} from "lucide-react";

// Local hooks
import {
  useFormSubmissions,
  useAnalyticsData,
  useAnalyticsChat,
} from "./hooks";

// Database and utilities
import { formsDb } from "@/lib/database";
import { toast } from "@/hooks/use-toast";

// Local utilities
import { formatDate, getFieldLabel, exportToCSV, exportToJSON } from "./utils";

// Local components
import {
  OverviewStats,
  AnalyticsCards,
  InfoCards,
  SubmissionsList,
  SubmissionDetailsModal,
  FloatingChatButton,
  ChatModal,
} from "./components";
import { ConfirmationModal } from "@/components/dashboard/form-delete-confirmation-modal";

// Local types
import { FormAnalyticsProps } from "./types";

export function FormAnalytics({ form }: FormAnalyticsProps) {
  const router = useRouter();
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  const { submissions, loading, refreshing, refreshData } = useFormSubmissions(
    form.id,
  );
  const analyticsData = useAnalyticsData(form, submissions);
  const {
    chatOpen,
    setChatOpen,
    chatMessages,
    chatInput,
    setChatInput,
    chatLoading,
    chatStreaming,
    streamedContent,
    messagesEndRef,
    chatInputRef,
    chatSuggestions,
    abortController,
    handleChatSend,
    handleStopGeneration,
  } = useAnalyticsChat(form, submissions, analyticsData);

  const getFieldLabelForForm = (fieldId: string) =>
    getFieldLabel(form, fieldId);
  const handleExportCSV = () => exportToCSV(form, submissions);
  const handleExportJSON = () => exportToJSON(form, submissions);
  const handleExportSubmission = (submission: any) => {
    const submissionData = {
      id: submission.id,
      submitted_at: submission.submitted_at,
      data: submission.submission_data,
      ip_address: submission.ip_address,
    };

    const dataStr = JSON.stringify(submissionData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `submission_${submission.id.slice(-8)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Submission exported successfully");
  };

  const handleViewSubmission = (submission: any) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  // Form action handlers
  const handleEditForm = () => {
    router.push(`/form-builder/${form.id}`);
  };

  const handleShareForm = async () => {
    try {
      if (!form.is_published) {
        await formsDb.togglePublishForm(form.id, true);
      }
      const shareUrl = `${window.location.origin}/forms/${form.id}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Form link copied to clipboard!");
    } catch (error) {
      console.error("Error sharing form:", error);
      toast.error("Failed to share form");
    }
  };

  const handleDeleteForm = async () => {
    try {
      await formsDb.deleteForm(form.id);
      toast.success("Form deleted successfully");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error deleting form:", error);
      toast.error("Failed to delete form");
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="mx-auto p-6">
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <div className="p-4 rounded-card mx-auto">
                <Loader />
              </div>
              <div className="space-y-1">
                <p className="text-foreground font-medium">
                  Loading analytics...
                </p>
                <p className="text-sm text-muted-foreground">
                  Fetching your form data and submissions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background max-w-[95%] mx-auto w-full px-6">
      <div className="mx-auto p-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col gap-4">
            <Button asChild variant="secondary" className="font-medium">
              <Link href="/dashboard" className="flex items-center w-fit">
                Go to Dashboard
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground">
                {form.title}
              </h1>
              <Badge
                variant={form.is_published ? "default" : "secondary"}
                className="gap-1.5"
              >
                {form.is_published ? (
                  <>
                    <Globe className="w-3 h-3" />
                    Published
                  </>
                ) : (
                  <>
                    <Eye className="w-3 h-3" />
                    Draft
                  </>
                )}
              </Badge>
            </div>
            <p className="text-muted-foreground flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Form Analytics & Submission Data
            </p>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={handleEditForm}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent size="sm">Edit form</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={handleShareForm}
                  >
                    <Share className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent size="sm">Share form</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="h-9 w-9 p-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent size="sm">Delete form</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="w-px h-6 bg-border mx-2"></div>

            <Button
              variant="default"
              size="sm"
              onClick={() => setChatOpen(true)}
              className="gap-2 font-medium"
            >
              <Sparkles className="w-4 h-4" />
              Kiko AI
            </Button>
          </div>
        </div>
        <OverviewStats data={analyticsData} />
        <AnalyticsCards data={analyticsData} />
        <InfoCards form={form} data={analyticsData} formatDate={formatDate} />
        <SubmissionsList
          form={form}
          submissions={submissions}
          loading={loading}
          refreshing={refreshing}
          onRefresh={refreshData}
          onExportCSV={handleExportCSV}
          onExportJSON={handleExportJSON}
          onViewSubmission={handleViewSubmission}
          getFieldLabel={getFieldLabelForForm}
          formatDate={formatDate}
        />
      </div>
      <SubmissionDetailsModal
        submission={selectedSubmission}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        getFieldLabel={getFieldLabelForForm}
        formatDate={formatDate}
        onExport={handleExportSubmission}
      />
      <ConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Delete Form"
        description={`Are you sure you want to delete "${form.title}"? This action cannot be undone and will permanently remove the form and all its submissions.`}
        confirmText="Delete Form"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleDeleteForm}
      />
      <FloatingChatButton
        onClick={() => setChatOpen(true)}
        theme={theme}
        mounted={mounted}
      />
      <ChatModal
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        isMobile={isMobile}
        chatMessages={chatMessages}
        chatStreaming={chatStreaming}
        streamedContent={streamedContent}
        chatLoading={chatLoading}
        messagesEndRef={messagesEndRef}
        chatSuggestions={chatSuggestions}
        setChatInput={setChatInput}
        handleChatSend={handleChatSend}
        chatInputRef={chatInputRef}
        chatInput={chatInput}
        abortController={abortController}
        handleStopGeneration={handleStopGeneration}
      />
    </div>
  );
}
