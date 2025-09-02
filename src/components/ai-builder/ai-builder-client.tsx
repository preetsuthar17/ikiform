"use client";

import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useAIBuilder } from "@/hooks/ai-builder/use-ai-builder";
import { useAuth } from "@/hooks/use-auth";
import { usePremiumStatus } from "@/hooks/use-premium-status";
import { CHAT_SUGGESTIONS } from "@/lib/ai-builder/constants";
import { ChatPanel } from "./chat/chat-panel";
import { JsonModalWrapper } from "./json-modal-wrapper";
import { MobileChatDrawerWrapper } from "./mobile-chat-drawer-wrapper";
import { PremiumGuardOptimized } from "./premium-guard-optimized";
import { PreviewPanel } from "./preview/preview-panel";

export function AIBuilderClient() {
  const { user, loading: authLoading } = useAuth();

  const router = useRouter();
  const { hasPremium, checkingPremium: checking } = usePremiumStatus(user);
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const {
    messages,
    input,
    isLoading,
    forms,
    activeFormId,
    isStreaming,
    streamedContent,
    streamError,
    showJsonModal,
    activeForm,
    messagesEndRef,
    streamingRef,
    setInput,
    setActiveFormId,
    setStreamedContent,
    setStreamError,
    setShowJsonModal,
    handleSend,
    handleUseForm,
    processInitialPrompt,
    scrollToBottom,
    scrollStreamingToBottom,
  } = useAIBuilder();

  const suggestions = useMemo(
    () =>
      CHAT_SUGGESTIONS.map((text) => ({
        text,
        icon: <Sparkles className="h-4 w-4" />,
      })),
    []
  );

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages.length, scrollToBottom]);

  useEffect(() => {
    if (isStreaming) {
      scrollStreamingToBottom();
    }
  }, [streamedContent, isStreaming, scrollStreamingToBottom]);

  const chatPanelProps = useMemo(
    () => ({
      messages,
      isLoading,
      isStreaming,
      streamedContent,
      streamError,
      suggestions,
      setInput,
      input,
      handleSend,
      setStreamedContent,
      setStreamError,
      streamingRef,
      messagesEndRef,
      mounted: true,
      showSuggestions,
      setShowSuggestions,
    }),
    [
      messages,
      isLoading,
      isStreaming,
      streamedContent,
      streamError,
      suggestions,
      setInput,
      input,
      handleSend,
      setStreamedContent,
      setStreamError,
      streamingRef,
      messagesEndRef,
      showSuggestions,
      setShowSuggestions,
    ]
  );

  return (
    <PremiumGuardOptimized
      authLoading={authLoading}
      checking={checking}
      hasPremium={hasPremium}
      user={user}
    >
      <div className="flex h-screen w-full flex-col gap-4 bg-background md:flex-row">
        {}
        <div className="-translate-x-1/2 fixed bottom-4 left-1/2 z-50 w-full max-w-[90%] md:hidden">
          <Button
            className="w-full rounded-card"
            onClick={() => setChatDrawerOpen(true)}
            size="lg"
          >
            Create Form with Kiko
          </Button>
        </div>

        {}
        <div className="hidden h-full w-full md:flex">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel
              border="right"
              defaultSize={20}
              maxSize={30}
              minSize={15}
            >
              <ChatPanel {...chatPanelProps} />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={80}>
              <PreviewPanel
                activeForm={activeForm}
                activeFormId={activeFormId}
                forms={forms}
                router={router}
                setActiveFormId={setActiveFormId}
                setShowJsonModal={setShowJsonModal}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        {}
        <MobileChatDrawerWrapper
          isOpen={chatDrawerOpen}
          onOpenChange={setChatDrawerOpen}
          {...chatPanelProps}
        />

        {}
        <div className="flex h-full flex-1 flex-col md:hidden">
          <PreviewPanel
            activeForm={activeForm}
            activeFormId={activeFormId}
            forms={forms}
            router={router}
            setActiveFormId={setActiveFormId}
            setShowJsonModal={setShowJsonModal}
          />
        </div>

        <JsonModalWrapper
          activeForm={activeForm}
          isOpen={showJsonModal}
          onClose={() => setShowJsonModal(false)}
        />
      </div>
    </PremiumGuardOptimized>
  );
}
