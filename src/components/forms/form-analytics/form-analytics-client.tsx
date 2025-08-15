'use client';

import {
  BarChart3,
  Edit,
  Eye,
  Globe,
  Share,
  Sparkles,
  Trash2,
} from 'lucide-react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

import React, { useEffect, useState } from 'react';
import { ConfirmationModal } from '@/components/dashboard/form-delete-confirmation-modal';
import { ShareFormModal } from '@/components/form-builder/share-form-modal';
import { Badge } from '@/components/ui/badge';

import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from '@/hooks/use-toast';

import { formsDb } from '@/lib/database';

import {
  AnalyticsCards,
  ChatModal,
  FloatingChatButton,
  InfoCards,
  OverviewStats,
  SubmissionDetailsModal,
  SubmissionsList,
  TrendsChart,
} from './components';
import { DropoffAnalytics } from './components/dropoff-analytics';

import {
  useAnalyticsChat,
  useAnalyticsData,
  useFormSubmissions,
} from './hooks';

import type { FormAnalyticsProps } from './types';

import { exportToCSV, exportToJSON, formatDate, getFieldLabel } from './utils';

/**
 * Client component for FormAnalytics
 * Contains all interactive functionality and state management
 * Optimized to minimize re-renders and improve performance
 */
export function FormAnalyticsClient({ form }: FormAnalyticsProps) {
  const router = useRouter();
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { submissions, loading, refreshing, refreshData } = useFormSubmissions(
    form.id
  );

  const analyticsData = useAnalyticsData(form, submissions);

  const {
    chatOpen,
    chatMessages,
    chatInput,
    chatLoading,
    chatStreaming,
    streamedContent,
    messagesEndRef,
    chatSuggestions,
    setChatInput,
    handleChatSend,
    chatInputRef,
    abortController,
    handleStopGeneration,
    setChatOpen,
  } = useAnalyticsChat(form, submissions, analyticsData);

  const { theme } = useTheme();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDeleteForm = async () => {
    try {
      await formsDb.deleteForm(form.id);
      toast.success('Form deleted successfully');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error deleting form:', error);
      toast.error('Failed to delete form');
    }
  };

  const handleExportCSV = () => {
    exportToCSV(form, submissions);
  };

  const handleExportJSON = () => {
    exportToJSON(form, submissions);
  };

  const handleSubmissionClick = (submission: any) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  const getFormUrl = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const identifier = form.slug || form.id;
    return `${baseUrl}/f/${identifier}`;
  };

  const getFieldLabelForForm = (fieldId: string) =>
    getFieldLabel(form, fieldId);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader className="h-8 w-8" />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="mx-auto flex w-full max-w-[95%] flex-col gap-6 px-6">
        {}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h1 className="font-semibold text-2xl text-foreground">
                {form.title}
              </h1>
              <Badge variant={form.is_published ? 'default' : 'secondary'}>
                {form.is_published ? 'Published' : 'Draft'}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm">
              Created on {formatDate(form.created_at)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild size="sm" variant="outline">
                  <Link href={getFormUrl()} target="_blank">
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View public form</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/form-builder/${form.id}`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit form</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setIsShareModalOpen(true)}
                  size="sm"
                  variant="outline"
                >
                  <Share className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share form</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setIsDeleteModalOpen(true)}
                  size="sm"
                  variant="destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete form</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {}
        <OverviewStats data={analyticsData} />
        <InfoCards data={analyticsData} form={form} formatDate={formatDate} />
        <AnalyticsCards data={analyticsData} />
        <TrendsChart trends={analyticsData.submissionTrends} />
        <DropoffAnalytics form={form} submissions={submissions} />
        <SubmissionsList
          form={form}
          formatDate={formatDate}
          getFieldLabel={getFieldLabelForForm}
          loading={loading}
          onExportCSV={handleExportCSV}
          onExportJSON={handleExportJSON}
          onRefresh={refreshData}
          onViewSubmission={handleSubmissionClick}
          refreshing={refreshing}
          submissions={submissions}
        />

        {}
        {!isMobile && (
          <FloatingChatButton
            mounted={true}
            onClick={() => setChatOpen(!chatOpen)}
            theme={theme}
          />
        )}

        {}
        <SubmissionDetailsModal
          form={form}
          formatDate={formatDate}
          getFieldLabel={getFieldLabelForForm}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          submission={selectedSubmission}
        />

        <ConfirmationModal
          cancelText="Cancel"
          confirmText="Delete Form"
          description="This action cannot be undone. This will permanently delete the form and all its submissions."
          onConfirm={handleDeleteForm}
          onOpenChange={setIsDeleteModalOpen}
          open={isDeleteModalOpen}
          title="Delete Form"
          variant="destructive"
        />

        <ShareFormModal
          formId={form.id}
          formSlug={form.slug || null}
          isOpen={isShareModalOpen}
          isPublished={form.is_published}
          onClose={() => setIsShareModalOpen(false)}
          onPublish={async () => {
            await formsDb.togglePublishForm(form.id, true);
            toast.success('Form published!');
          }}
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
    </TooltipProvider>
  );
}
