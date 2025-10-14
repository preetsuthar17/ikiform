import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

import { useEffect, useRef, useState } from "react";

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
import { initializeScrollbarStyles } from "@/lib/ai-builder/utils";
import { ChatPanel } from "./chat/chat-panel";
import { JsonModal } from "./json-modal";
import { MobileChatDrawer } from "./mobile-chat-drawer";
import { PremiumGuard } from "./premium-guard";
import { PreviewPanel } from "./preview/preview-panel";

export function AIBuilder() {
  const { user, loading: authLoading } = useAuth();

  const router = useRouter();
  const { hasPremium, checkingPremium: checking } = usePremiumStatus(user);
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [mounted, setMounted] = useState(false);
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
    messagesEndRef,
    streamingRef,
    setInput,
    setActiveFormId,
    setStreamedContent,
    setStreamError,
    setShowJsonModal,
    handleSend,
    handleUseForm,
    activeForm,
  } = useAIBuilder();

  const suggestions = CHAT_SUGGESTIONS.map((text) => ({
    text,
    icon: <Sparkles className="h-4 w-4" />,
  }));

  useEffect(() => {
    initializeScrollbarStyles();
    setMounted(true);
  }, []);

  useEffect(() => {
    if (streamError && errorLiveRegionRef.current) {
      errorLiveRegionRef.current.focus({ preventScroll: true });
    }
  }, [streamError]);

  const chatPanelProps = {
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
    mounted,
    showSuggestions,
    setShowSuggestions,
  };

  return (
    <PremiumGuard
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
            <ResizablePanel defaultSize={25} maxSize={30} minSize={15}>
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
        <MobileChatDrawer
          isOpen={chatDrawerOpen}
          onOpenChange={setChatDrawerOpen}
          drawerId="mobile-chat-drawer"
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

        {/** Live regions for A11y announcements */}
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

        <JsonModal
          activeForm={activeForm}
          isOpen={showJsonModal}
          onClose={() => setShowJsonModal(false)}
        />
      </div>
    </PremiumGuard>
  );
}
