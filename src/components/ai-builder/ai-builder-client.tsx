"use client";

import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
  const errorLiveRegionRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    if (streamError && errorLiveRegionRef.current) {
      errorLiveRegionRef.current.focus({ preventScroll: true });
    }
  }, [streamError]);

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
      <div
        id="main-content"
        role="main"
        tabIndex={-1}
        className="flex h-screen w-full flex-col gap-4 bg-background md:flex-row motion-reduce:transition-none motion-reduce:animate-none"
        style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
      >
        {}
        <div className="-translate-x-1/2 fixed bottom-4 left-1/2 z-50 w-full max-w-[90%] md:hidden">
          <Button
            className="w-full rounded-2xl"
            onClick={() => setChatDrawerOpen(true)}
            size="lg"
            aria-haspopup="dialog"
            aria-expanded={chatDrawerOpen}
            aria-controls="mobile-chat-drawer"
          >
            Create Form with Kiko
          </Button>
        </div>

        {}
        <div className="hidden h-full w-full md:flex">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={20} maxSize={30} minSize={15}>
              <div className="h-full w-full">
                <ChatPanel {...chatPanelProps} />
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={80}>
              <ScrollArea className="h-full">
                <PreviewPanel
                  activeForm={activeForm}
                  activeFormId={activeFormId}
                  forms={forms}
                  router={router}
                  setActiveFormId={setActiveFormId}
                  setShowJsonModal={setShowJsonModal}
                />
              </ScrollArea>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        {}
        <MobileChatDrawerWrapper
          isOpen={chatDrawerOpen}
          onOpenChange={setChatDrawerOpen}
          {...chatPanelProps}
        />
        <div className="flex h-full min-h-0 flex-1 flex-col md:hidden">
          <Separator />
          <ScrollArea className="min-h-0 flex-1 pb-20">
            <PreviewPanel
              activeForm={activeForm}
              activeFormId={activeFormId}
              forms={forms}
              router={router}
              setActiveFormId={setActiveFormId}
              setShowJsonModal={setShowJsonModal}
            />
          </ScrollArea>
        </div>

        <div
          ref={errorLiveRegionRef}
          tabIndex={-1}
          aria-live="assertive"
          aria-atomic="true"
          className="sr-only"
        >
          {streamError ? `Error: ${streamError}` : ""}
        </div>
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {isStreaming ? "Generating response…" : isLoading ? "Loading…" : ""}
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
