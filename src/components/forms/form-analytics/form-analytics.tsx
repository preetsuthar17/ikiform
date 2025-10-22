"use client";

import {
  BarChart3,
  Edit,
  Eye,
  Globe,
  Share,
  Sparkles,
  Trash2,
  ArrowLeft,
  MoreHorizontal,
  Download,
  RefreshCw,
} from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import { ConfirmationModal } from "@/components/dashboard/form-delete-confirmation-modal";
import { ShareFormModal } from "@/components/form-builder/share-form-modal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
       <Loader/>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="mx-auto max-w-7xl flex flex-col gap-4">
        {/* Header Section */}
        <Card className="shadow-none p-4 md:p-6" aria-labelledby="form-analytics-header">
          <CardHeader className="p-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
              <div className="flex flex-col gap-4 min-w-0">
                <Button
                  asChild
                  variant="outline"
                  className="w-fit"
                  aria-label="Back to Dashboard"
                >
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2"
                  >
                    <ArrowLeft className="size-4 shrink-0" aria-hidden="true" />
                    <span className="text-sm">Back to Dashboard</span>
                  </Link>
                </Button>
                <div className="flex flex-col gap-4 min-w-0">
                  <div className="flex items-center flex-wrap gap-3">
                    <h1
                      id="form-analytics-header"
                      className="text-2xl font-bold truncate text-foreground sm:text-3xl"
                    >
                      {form.title}
                    </h1>
                    <Badge
                      className="flex items-center gap-1.5"
                      variant={form.is_published ? "default" : "secondary"}
                    >
                      {form.is_published ? (
                        <>
                          <Globe className="size-3" aria-hidden="true" />
                          <span className="sr-only">Published</span>
                          <span aria-live="polite">Published</span>
                        </>
                      ) : (
                        <>
                          <Eye className="size-3" aria-hidden="true" />
                          <span className="sr-only">Draft</span>
                          <span aria-live="polite">Draft</span>
                        </>
                      )}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <BarChart3 className="size-4" aria-hidden="true" />
                    <span className="text-sm font-medium">Form Analytics&nbsp;&amp;&nbsp;Submission Data</span>
                  </div>
                </div>
              </div>
              
              {/* Right: Actions */}
              <div className="flex items-center flex-wrap gap-3 sm:gap-3" aria-label="Form Actions">
                {/* Edit button with Tooltip */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={handleEditForm}
                        size="icon"
                        variant="outline"
                        aria-label="Edit form"
                        tabIndex={0}
                        className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <Edit className="size-4 shrink-0" aria-hidden="true" />
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
                        onClick={handleShareForm}
                        size="icon"
                        variant="outline"
                        aria-label="Share form"
                        tabIndex={0}
                        className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <Share className="size-4 shrink-0" aria-hidden="true" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Share form</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      aria-label="More actions"
                      tabIndex={0}
                      className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <MoreHorizontal className="size-4 shrink-0" aria-hidden="true" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleExportCsv}>
                      <Download className="size-4 shrink-0" aria-hidden="true" />
                      <span>Export CSV</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportJson}>
                      <Download className="size-4 shrink-0" aria-hidden="true" />
                      <span>Export JSON</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setIsDeleteModalOpen(true)}
                      variant="destructive"
                    >
                      <Trash2 className="size-4 shrink-0" aria-hidden="true" />
                      <span>Delete form</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className="flex gap-2 items-center focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          onClick={() => setChatOpen(true)}
                          variant="default"
                          aria-label="Open Kiko AI"
                        >
                          <Sparkles className="size-4 shrink-0" aria-hidden="true" />
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
