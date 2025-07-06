// React imports
import { useState, useEffect } from "react";

// Next.js imports
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

// Icon imports
import { Sparkles } from "lucide-react";

// UI components imports
import { Button } from "@/components/ui/button";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

// Local imports
import { useAuth } from "@/hooks/use-auth";
import { useAIBuilder } from "@/hooks/ai-builder/use-ai-builder";
import { createClient } from "@/utils/supabase/client";
import { CHAT_SUGGESTIONS } from "@/lib/ai-builder/constants";
import { initializeScrollbarStyles } from "@/lib/ai-builder/utils";
import { ChatPanel } from "./chat/chat-panel";
import { PreviewPanel } from "./preview/preview-panel";
import { MobileChatDrawer } from "./mobile-chat-drawer";
import { JsonModal } from "./json-modal";
import { PremiumGuard } from "./premium-guard";

export function AIBuilder() {
  const { user, loading: authLoading } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  const [hasPremium, setHasPremium] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
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
    mounted,
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
    icon: <Sparkles className="w-4 h-4" />,
  }));

  useEffect(() => {
    initializeScrollbarStyles();
  }, []);

  useEffect(() => {
    if (!user) {
      setHasPremium(false);
      return;
    }
    setChecking(true);
    const checkPremium = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("users")
        .select("has_premium")
        .eq("email", user.email)
        .single();
      setHasPremium(data?.has_premium || false);
      setChecking(false);
    };
    checkPremium();
  }, [user]);

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
    theme,
    showSuggestions,
    setShowSuggestions,
  };

  return (
    <PremiumGuard
      user={user}
      hasPremium={hasPremium}
      authLoading={authLoading}
      checking={checking}
    >
      <div className="flex h-screen w-full bg-background flex-col md:flex-row gap-4">
        {/* Mobile: Chat Drawer Trigger */}
        <div className="fixed bottom-4 max-w-[90%] w-full left-1/2 -translate-x-1/2 z-50 md:hidden">
          <Button
            size="lg"
            className="rounded-full shadow-lg w-full"
            onClick={() => setChatDrawerOpen(true)}
          >
            Create Form with Kiko
          </Button>
        </div>

        {/* Desktop: Resizable Chat + Preview */}
        <div className="hidden md:flex w-full h-full">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel
              defaultSize={20}
              minSize={15}
              maxSize={30}
              border="right"
            >
              <ChatPanel {...chatPanelProps} />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={80}>
              <PreviewPanel
                forms={forms}
                activeFormId={activeFormId}
                setActiveFormId={setActiveFormId}
                router={router}
                setShowJsonModal={setShowJsonModal}
                activeForm={activeForm}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        {/* Mobile: Drawer for Chat */}
        <MobileChatDrawer
          isOpen={chatDrawerOpen}
          onOpenChange={setChatDrawerOpen}
          {...chatPanelProps}
        />

        {/* Mobile: Main page is always the preview */}
        <div className="flex-1 md:hidden flex flex-col h-full">
          <PreviewPanel
            forms={forms}
            activeFormId={activeFormId}
            setActiveFormId={setActiveFormId}
            router={router}
            setShowJsonModal={setShowJsonModal}
            activeForm={activeForm}
          />
        </div>

        <JsonModal
          isOpen={showJsonModal}
          onClose={() => setShowJsonModal(false)}
          activeForm={activeForm}
        />
      </div>
    </PremiumGuard>
  );
}
