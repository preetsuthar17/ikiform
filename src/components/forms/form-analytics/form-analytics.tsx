"use client";

import {
  BarChart3,
  Edit,
  Eye,
  Globe,
  Share,
  Sparkles,
  Trash2,
} from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

import React, { useEffect, useState } from "react";
import { ConfirmationModal } from "@/components/dashboard/form-delete-confirmation-modal";
import { ShareFormModal } from "@/components/form-builder/share-form-modal";
import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";

import { formsDb } from "@/lib/database";

import {
  AnalyticsCards,
  ChatModal,
  FloatingChatButton,
  InfoCards,
  OverviewStats,
  QuizAnalyticsCard,
  SubmissionDetailsModal,
  SubmissionsList,
  TrendsChart,
} from "./components";
import { DropoffAnalytics } from "./components/dropoff-analytics";

import {
  useAnalyticsChat,
  useAnalyticsData,
  useFormSubmissions,
} from "./hooks";

import type { FormAnalyticsProps } from "./types";

import { exportToCSV, exportToJSON, formatDate, getFieldLabel } from "./utils";

export function FormAnalytics({ form }: FormAnalyticsProps) {
  const router = useRouter();
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
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

  const handleEditForm = () => {
    router.push(`/form-builder/${form.id}`);
  };

  const handleShareForm = () => {
    setIsShareModalOpen(true);
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
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="mx-auto p-6">
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col gap-4 text-center">
              <div className="mx-auto rounded-card p-4">
                <Loader />
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-medium text-foreground">
                  Loading analytics...
                </p>
                <p className="text-muted-foreground text-sm">
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
    <div className="mx-auto min-h-screen w-full max-w-[95%] bg-background px-4 py-12">
      <div className="mx-auto flex flex-col gap-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4">
            <Button asChild className="font-medium" variant="secondary">
              <Link className="flex w-fit items-center" href="/dashboard">
                Go to Dashboard
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <h1 className="font-bold text-3xl text-foreground">
                {form.title}
              </h1>
              <Badge
                className="gap-1.5"
                variant={form.is_published ? "default" : "secondary"}
              >
                {form.is_published ? (
                  <>
                    <Globe className="h-3 w-3" />
                    Published
                  </>
                ) : (
                  <>
                    <Eye className="h-3 w-3" />
                    Draft
                  </>
                )}
              </Badge>
            </div>
            <p className="flex items-center gap-2 text-muted-foreground">
              <BarChart3 className="h-4 w-4" />
              Form Analytics & Submission Data
            </p>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleEditForm}
                    size="icon"
                    variant="secondary"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent size="sm">Edit form</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleShareForm}
                    size="icon"
                    variant="secondary"
                  >
                    <Share className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent size="sm">Share form</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="h-9 w-9 p-0"
                    onClick={() => setIsDeleteModalOpen(true)}
                    size="icon"
                    variant="destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent size="sm">Delete form</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="mx-2 h-6 w-px bg-border" />

            <Button
              className="gap-2 font-medium"
              onClick={() => setChatOpen(true)}
              variant="default"
            >
              <Sparkles className="h-4 w-4" />
              Kiko AI
            </Button>
          </div>
        </div>
        <OverviewStats data={analyticsData} />
        <QuizAnalyticsCard quizAnalytics={analyticsData.quizAnalytics} />
        <AnalyticsCards data={analyticsData} />
        <TrendsChart trends={analyticsData.submissionTrends} />
        <DropoffAnalytics form={form} submissions={submissions} />
        <InfoCards data={analyticsData} form={form} formatDate={formatDate} />
        <SubmissionsList
          form={form}
          formatDate={formatDate}
          getFieldLabel={getFieldLabelForForm}
          loading={loading}
          onExportCSV={handleExportCSV}
          onExportJSON={handleExportJSON}
          onRefresh={refreshData}
          onViewSubmission={handleViewSubmission}
          refreshing={refreshing}
          submissions={submissions}
        />
      </div>
      <SubmissionDetailsModal
        form={form}
        formatDate={formatDate}
        getFieldLabel={getFieldLabelForForm}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onExport={handleExportSubmission}
        submission={selectedSubmission}
      />
      <ConfirmationModal
        cancelText="Cancel"
        confirmText="Delete Form"
        description={`Are you sure you want to delete "${form.title}"? This action cannot be undone and will permanently remove the form and all its submissions.`}
        onConfirm={handleDeleteForm}
        onOpenChange={setIsDeleteModalOpen}
        open={isDeleteModalOpen}
        title="Delete Form"
        variant="destructive"
      />
      <ShareFormModal
        formId={form?.id || null}
        formSlug={form?.slug || null}
        isOpen={isShareModalOpen}
        isPublished={!!form?.is_published}
        onClose={() => setIsShareModalOpen(false)}
        onPublish={async () => {
          await formsDb.togglePublishForm(form.id, true);
          toast.success("Form published!");
        }}
      />
      <FloatingChatButton
        mounted={mounted}
        onClick={() => setChatOpen(true)}
        theme={theme}
      />
      <ChatModal
        abortController={abortController}
        chatInput={chatInput}
        chatInputRef={chatInputRef}
        chatLoading={chatLoading}
        chatMessages={chatMessages}
        chatStreaming={chatStreaming}
        chatSuggestions={chatSuggestions}
        handleChatSend={handleChatSend}
        handleStopGeneration={handleStopGeneration}
        isMobile={isMobile}
        isOpen={chatOpen}
        messagesEndRef={messagesEndRef}
        onClose={() => setChatOpen(false)}
        setChatInput={setChatInput}
        streamedContent={streamedContent}
      />
    </div>
  );
}
