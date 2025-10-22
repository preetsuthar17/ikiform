"use client";

import {
  ArrowLeft,
  BarChart3,
  Download,
  Edit,
  Eye,
  Globe,
  MoreHorizontal,
  Share,
  Sparkles,
  Trash2,
} from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import { ConfirmationModal } from "@/components/dashboard/form-delete-confirmation-modal";
import { ShareFormModal } from "@/components/form-builder/share-form-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

  const { submissions, loading, refreshing, refreshData } = useFormSubmissions(
    form.id
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
  const handleExportCsv = () => exportToCSV(form, submissions);
  const handleExportJson = () => exportToJSON(form, submissions);
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
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-4">
        {/* Header Section */}
        <Card
          aria-labelledby="form-analytics-header"
          className="p-4 shadow-none md:p-6"
        >
          <CardHeader className="p-0">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 flex-col gap-4">
                <Button
                  aria-label="Back to Dashboard"
                  asChild
                  className="w-fit"
                  variant="outline"
                >
                  <Link
                    className="inline-flex items-center gap-2"
                    href="/dashboard"
                  >
                    <ArrowLeft aria-hidden="true" className="size-4 shrink-0" />
                    <span className="text-sm">Back to Dashboard</span>
                  </Link>
                </Button>
                <div className="flex min-w-0 flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1
                      className="truncate font-bold text-2xl text-foreground sm:text-3xl"
                      id="form-analytics-header"
                    >
                      {form.title}
                    </h1>
                    <Badge
                      className="flex items-center gap-1.5"
                      variant={form.is_published ? "default" : "secondary"}
                    >
                      {form.is_published ? (
                        <>
                          <Globe aria-hidden="true" className="size-3" />
                          <span className="sr-only">Published</span>
                          <span aria-live="polite">Published</span>
                        </>
                      ) : (
                        <>
                          <Eye aria-hidden="true" className="size-3" />
                          <span className="sr-only">Draft</span>
                          <span aria-live="polite">Draft</span>
                        </>
                      )}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <BarChart3 aria-hidden="true" className="size-4" />
                    <span className="font-medium text-sm">
                      Form Analytics&nbsp;&amp;&nbsp;Submission Data
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Actions */}
              <div
                aria-label="Form Actions"
                className="flex flex-wrap items-center gap-3 sm:gap-3"
              >
                {/* Edit button with Tooltip */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        aria-label="Edit form"
                        className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        onClick={handleEditForm}
                        size="icon"
                        tabIndex={0}
                        variant="outline"
                      >
                        <Edit aria-hidden="true" className="size-4 shrink-0" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Edit form</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {/* Share button with Tooltip */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        aria-label="Share form"
                        className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        onClick={handleShareForm}
                        size="icon"
                        tabIndex={0}
                        variant="outline"
                      >
                        <Share aria-hidden="true" className="size-4 shrink-0" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Share form</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      aria-label="More actions"
                      className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      size="icon"
                      tabIndex={0}
                      variant="outline"
                    >
                      <MoreHorizontal
                        aria-hidden="true"
                        className="size-4 shrink-0"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleExportCsv}>
                      <Download
                        aria-hidden="true"
                        className="size-4 shrink-0"
                      />
                      <span>Export CSV</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportJson}>
                      <Download
                        aria-hidden="true"
                        className="size-4 shrink-0"
                      />
                      <span>Export JSON</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setIsDeleteModalOpen(true)}
                      variant="destructive"
                    >
                      <Trash2 aria-hidden="true" className="size-4 shrink-0" />
                      <span>Delete form</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        aria-label="Open Kiko AI"
                        className="flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        onClick={() => setChatOpen(true)}
                        variant="default"
                      >
                        <Sparkles
                          aria-hidden="true"
                          className="size-4 shrink-0"
                        />
                        <span className="hidden sm:inline">Kiko&nbsp;AI</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>AI Form analytics</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Analytics Content */}
        <div className="flex flex-col gap-4">
          <OverviewStats data={analyticsData} />
          <QuizAnalyticsCard quizAnalytics={analyticsData.quizAnalytics} />
          <AnalyticsCards data={analyticsData} />
          <TrendsChart trends={analyticsData.submissionTrends} />
          <DropoffAnalytics form={form} submissions={submissions} />
          <InfoCards data={analyticsData} form={form} formatDate={formatDate} />
        </div>
      </div>
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
      <FloatingChatButton onClick={() => setChatOpen(true)} />
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
