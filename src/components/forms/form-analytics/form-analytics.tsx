"use client";

// React imports
import React, { useState, useEffect } from "react";

// Next.js imports
import Link from "next/link";
import { useTheme } from "next-themes";

// UI component imports
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/ui/loader";

// Icon imports
import { Globe, Eye, BarChart3, Sparkles } from "lucide-react";

// Local hooks
import {
  useFormSubmissions,
  useAnalyticsData,
  useAnalyticsChat,
} from "./hooks";

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

// Local types
import { FormAnalyticsProps } from "./types";

export function FormAnalytics({ form }: FormAnalyticsProps) {
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

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
  const handleExportCSV = () => exportToCSV(form, submissions);
  const handleExportJSON = () => exportToJSON(form, submissions);

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
              <div className="p-4 bg-accent/10 rounded-card mx-auto">
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
