"use client";

import {
  useState,
  useRef,
  useEffect,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  KeyboardEvent,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

import {
  Send,
  Bot,
  User,
  Sparkles,
  Copy,
  Check,
  Download,
  ArrowLeft,
  MessageSquare,
  Upload,
  Mic,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Loader } from "@/components/ui/loader";
import { FormPreview } from "@/components/form-builder/form-preview";
import { useRouter } from "next/navigation";
import { Kbd } from "@/components/ui/kbd";
import Image from "next/image";
import { useTheme } from "next-themes";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
  ModalClose,
} from "@/components/ui/modal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerCloseButton,
  DrawerOverlay,
  DrawerTrigger,
  DrawerDescription,
} from "@/components/ui/drawer";
import { type NextRouter } from "next/router";
import { createClient } from "@/utils/supabase/client";

interface ChatPanelProps {
  messages: any[];
  isLoading: boolean;
  isStreaming: boolean;
  streamedContent: string;
  streamError: string | null;
  showSuggestions: boolean;
  suggestions: { text: string; icon: React.ReactNode }[];
  setInput: (v: string) => void;
  input: string;
  handleSend: (e: React.FormEvent<HTMLFormElement>) => void;
  setShowSuggestions: (v: boolean) => void;
  setStreamedContent: (v: string) => void;
  setStreamError: (v: string | null) => void;
  streamingRef: React.RefObject<HTMLDivElement | null>;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  mounted: boolean;
  theme: string | undefined;
}

function ChatPanel({
  messages,
  isLoading,
  isStreaming,
  streamedContent,
  streamError,
  showSuggestions,
  suggestions,
  setInput,
  input,
  handleSend,
  setShowSuggestions,
  setStreamedContent,
  setStreamError,
  streamingRef,
  messagesEndRef,
  mounted,
  theme,
}: ChatPanelProps) {
  // Hide suggestions if there is any message
  const shouldShowSuggestions = showSuggestions && messages.length === 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 max-s-">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="icon">
              <Link href="/form-builder">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-lg font-semibold flex items-center gap-2">
                Kiko AI
              </h1>
            </div>
          </div>
        </div>
      </div>
      {/* Chat Container */}
      <ScrollArea className="flex-1 p-4 relative">
        <div className="space-y-4">
          {/* Welcome Message */}
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <Link href="/">
                  {mounted && theme === "light" ? (
                    <Image
                      src="/logo.svg"
                      alt="Ikiform"
                      width={69}
                      height={69}
                      className="pointer-events-none invert"
                    />
                  ) : (
                    <Image
                      src="/logo.svg"
                      alt="Ikiform"
                      width={69}
                      height={69}
                      className="pointer-events-none"
                    />
                  )}
                </Link>
              </div>
              <h2 className="text-2xl font-semibold mb-2">
                How can Kiko help you?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto text-center text-sm">
                Hi, I'm Kiko your personalized AI form builder :3
              </p>
            </motion.div>
          )}
          {/* Messages */}
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <Card
                  className={`max-w-[90%] p-2 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50"
                  }`}
                >
                  <CardHeader className="px-2">
                    {message.role === "assistant" && (
                      <div className="flex items-center justify-start gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                        <p className="text-xs font-medium">Kiko</p>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="p-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 space-y-2">
                        <div className="prose prose-sm max-w-none">
                          {message.role === "user" && (
                            <div>
                              {message.content
                                .split("\n")
                                .map((line: string, i: number) => (
                                  <p
                                    key={i}
                                    className="text-sm flex items-center justify-center"
                                  >
                                    {line}
                                  </p>
                                ))}
                            </div>
                          )}
                          {message.role === "assistant" && message.schema && (
                            <ExpandableJsonBlock schema={message.schema} />
                          )}
                          {message.role === "assistant" && !message.schema && (
                            <div className="text-sm whitespace-pre-wrap break-words">
                              {message.content}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          {/* Loading indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 justify-start"
            >
              <Loader />
            </motion.div>
          )}
          {isStreaming && (
            <div className="my-2 p-3 rounded-lg bg-muted/50 border border-border text-sm font-mono max-h-xl overflow-hidden">
              <div
                className="text-xs text-muted-foreground flex flex-col gap-2 max-h-xl h-[90px] fade-y overflow-auto scrollbar-none"
                ref={streamingRef}
                style={{ scrollBehavior: "smooth" }}
              >
                Generating form...
                <pre className="whitespace-pre-wrap break-words">
                  {streamedContent}
                </pre>
              </div>
            </div>
          )}
          {streamError && (
            <div className="my-2 p-3 rounded-lg bg-destructive/10 border border-destructive text-sm">
              {streamError}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      {/* Suggestions */}
      {shouldShowSuggestions && (
        <div className="mb-4 overflow-hidden p-4 max-sm:hidden ">
          <div className="text-xs text-muted-foreground mb-2 font-medium tracking-wide">
            Try these examples
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 flex-wrap">
            {suggestions.map((s, i) => (
              <button
                key={i}
                className="gap-2 px-4 py-2 rounded-full bg-muted hover:bg-primary/10 transition text-sm font-medium border border-border whitespace-nowrap grow flex items-center justify-center"
                onClick={() => {
                  setInput(s.text);
                  setShowSuggestions(false);
                }}
              >
                {s.text}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Input Area */}
      <div className="border-t bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 p-4 flex-shrink-0">
        <form
          onSubmit={handleSend}
          className="relative flex items-center bg-card rounded-ele border border-border shadow-md/2 px-4 py-2 mt-4"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe the form you want to create..."
            className="flex-1 bg-transparent border-none outline-none resize-none min-h-[40px] max-h-[120px] pr-10 flex items-center justify-start text-left p-3 "
            style={{ boxShadow: "none" }}
            disabled={isLoading}
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                (e.target as HTMLTextAreaElement).form?.requestSubmit();
              }
            }}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            loading={isLoading}
            size={"icon"}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {isLoading ? <></> : <Send className="w-4 h-4" />}
          </Button>
        </form>
        <div className="text-xs text-muted-foreground mt-2 text-center">
          Press <Kbd size={"sm"}>Enter</Kbd> to send,{" "}
          <Kbd size={"sm"}>Shift+Enter</Kbd> for new line
        </div>
      </div>
    </div>
  );
}

interface PreviewPanelProps {
  forms: any[];
  activeFormId: string | null;
  setActiveFormId: (id: string) => void;
  router: any;
  setShowJsonModal: (v: boolean) => void;
  activeForm: any;
}

function PreviewPanel({
  forms,
  activeFormId,
  setActiveFormId,
  router,
  setShowJsonModal,
  activeForm,
}: PreviewPanelProps) {
  return (
    <div className="flex flex-col flex-1 h-full">
      {/* Mobile header */}
      <div className="md:hidden flex items-center gap-3 p-4 border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <Button asChild variant="ghost" size="icon">
          <Link href="/form-builder">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div className="inline-flex items-center gap-2">
          <span className="w-2 h-2 bg-muted-foreground rounded-full"></span>
          <span className="text-lg font-semibold">Kiko AI</span>
        </div>
      </div>
      {/* Mobile: Form tabs/buttons */}
      <div className="max-sm:flex hidden gap-2 overflow-x-auto p-3">
        {forms.map((form, idx) => (
          <Button
            key={form.id}
            size="sm"
            variant={form.id === activeFormId ? "secondary" : "outline"}
            className={form.id === activeFormId ? "tab-active" : "tab"}
            onClick={() => setActiveFormId(form.id)}
          >
            {form.prompt ? `${form.prompt.slice(0, 12)}...` : `Form ${idx + 1}`}
          </Button>
        ))}
      </div>
      <div className="items-center justify-between p-4 border-b bg-card/50 hidden md:flex">
        <div className="flex gap-2">
          {forms.map((form, idx) => (
            <Button
              key={form.id}
              variant={"secondary"}
              className={form.id === activeFormId ? "tab-active" : "tab"}
              onClick={() => setActiveFormId(form.id)}
            >
              {form.prompt
                ? `${form.prompt.slice(0, 20)}...`
                : `Form ${idx + 1}`}
            </Button>
          ))}
        </div>
        {activeForm?.schema && (
          <div className="flex items-center justify-end mb-2">
            <Button
              size="sm"
              variant="outline"
              className="mr-2"
              onClick={() => setShowJsonModal(true)}
            >
              View JSON
            </Button>
            <Button
              size="sm"
              onClick={() => {
                localStorage.setItem(
                  "importedFormSchema",
                  JSON.stringify(activeForm.schema)
                );
                router.push("/form-builder");
              }}
            >
              Use this form
            </Button>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-auto p-6">
        {activeForm?.schema ? (
          <FormPreview
            schema={activeForm.schema}
            selectedFieldId={null}
            onFieldSelect={() => {}}
            onFieldsReorder={() => {}}
            onFieldDelete={() => {}}
          />
        ) : (
          <div className="text-muted-foreground h-full w-full flex items-center justify-center text-center">
            No form selected.
          </div>
        )}
      </div>
    </div>
  );
}

export default function AIChatPage() {
  const { user, loading: authLoading } = useAuth();
  const [hasPremium, setHasPremium] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Handle URL parameters
  const [initialPromptProcessed, setInitialPromptProcessed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Chat state
  const [messages, setMessages] = useState<any[]>([]); // { role, content, schema? }
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [forms, setForms] = useState<
    { id: string; schema: any; prompt: string }[]
  >([]);
  const [activeFormId, setActiveFormId] = useState<string | null>(null);

  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedContent, setStreamedContent] = useState("");
  const [streamError, setStreamError] = useState<string | null>(null);

  const [showJsonModal, setShowJsonModal] = useState(false);
  const streamingRef = useRef<HTMLDivElement>(null);

  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);

  // Handle URL parameters for pre-filled prompts
  useEffect(() => {
    if (mounted && !initialPromptProcessed) {
      const urlParams = new URLSearchParams(window.location.search);
      const promptParam = urlParams.get("prompt");
      const sentParam = urlParams.get("sent");

      if (promptParam && sentParam === "true") {
        const decodedPrompt = decodeURIComponent(promptParam);
        setInput(decodedPrompt);
        setShowSuggestions(false);
        setInitialPromptProcessed(true);

        // Auto-send the prompt after a short delay to ensure input is set
        setTimeout(() => {
          autoSendPrompt(decodedPrompt);
        }, 500);
      }
    }
  }, [mounted, initialPromptProcessed]);

  // Auto-send function for URL parameters
  const autoSendPrompt = async (promptText: string) => {
    if (!promptText.trim()) return;

    setInput(""); // Clear input immediately after sending
    setIsLoading(true);
    setIsStreaming(true);
    setStreamedContent("");
    setStreamError(null);

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: promptText }]);

    const currentMessages = [
      ...messages,
      { role: "user", content: promptText },
    ];

    const res = await fetch("/api/ai-builder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: currentMessages,
      }),
    });

    if (!res.body) {
      setStreamError("No response from server.");
      setIsStreaming(false);
      setIsLoading(false);
      return;
    }

    const reader = res.body.getReader();
    let fullText = "";
    let foundJson = null;

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = new TextDecoder().decode(value);
      fullText += chunk;
      setStreamedContent(fullText);

      // Try to extract JSON as soon as possible
      if (!foundJson) {
        try {
          const match = fullText.match(/\{[\s\S]*\}/);
          if (match) foundJson = JSON.parse(match[0]);
        } catch {}
      }
    }

    setIsStreaming(false);
    setIsLoading(false);

    // Add AI message to chat
    if (foundJson) {
      // Check for duplicate schema (deep equality)
      const existing = forms.find(
        (f) => JSON.stringify(f.schema) === JSON.stringify(foundJson)
      );
      if (existing) {
        setActiveFormId(existing.id);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "This form already exists. Switched to the existing form.",
            schema: foundJson,
          },
        ]);
      } else {
        const newId = Date.now().toString();
        setForms((prev) => [
          ...prev,
          { id: newId, schema: foundJson, prompt: promptText },
        ]);
        setActiveFormId(newId);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: fullText, schema: foundJson },
        ]);
      }
      setStreamedContent(""); // Clear the streaming block
    } else {
      setStreamError(
        "Sorry, I couldn't generate a form from your input. Please try rephrasing your request or provide more details!"
      );
    }
  };

  const suggestions = [
    { text: "Create a contact form", icon: <Sparkles className="w-4 h-4" /> },
    {
      text: "Customer feedback survey",
      icon: <Sparkles className="w-4 h-4" />,
    },
    { text: "Event registration form", icon: <Sparkles className="w-4 h-4" /> },
    { text: "Job application form", icon: <Sparkles className="w-4 h-4" /> },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isStreaming && streamingRef.current) {
      streamingRef.current.scrollTop = streamingRef.current.scrollHeight;
    }
  }, [streamedContent, isStreaming]);

  useEffect(() => {
    if (!user) {
      setHasPremium(false);
      return;
    }
    setChecking(true);
    const checkPremium = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("users")
        .select("has_premium")
        .eq("email", user.email)
        .single();
      setHasPremium(data?.has_premium || false);
      setChecking(false);
    };
    checkPremium();
  }, [user]);

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const currentInput = input;
    setInput("");
    setIsLoading(true);
    setIsStreaming(true);
    setStreamedContent("");
    setStreamError(null);

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: currentInput }]);

    const currentMessages = [
      ...messages,
      { role: "user", content: currentInput },
    ];

    const res = await fetch("/api/ai-builder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: currentMessages,
      }),
    });

    if (!res.body) {
      setStreamError("No response from server.");
      setIsStreaming(false);
      setIsLoading(false);
      return;
    }

    const reader = res.body.getReader();
    let fullText = "";
    let foundJson = null;

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = new TextDecoder().decode(value);
      fullText += chunk;
      setStreamedContent(fullText);

      // Try to extract JSON as soon as possible
      if (!foundJson) {
        try {
          const match = fullText.match(/\{[\s\S]*\}/);
          if (match) foundJson = JSON.parse(match[0]);
        } catch {}
      }
    }

    setIsStreaming(false);
    setIsLoading(false);

    // Add AI message to chat
    if (foundJson) {
      // Check for duplicate schema (deep equality)
      const existing = forms.find(
        (f) => JSON.stringify(f.schema) === JSON.stringify(foundJson)
      );
      if (existing) {
        setActiveFormId(existing.id);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "This form already exists. Switched to the existing form.",
            schema: foundJson,
          },
        ]);
      } else {
        const newId = Date.now().toString();
        setForms((prev) => [
          ...prev,
          { id: newId, schema: foundJson, prompt: currentInput },
        ]);
        setActiveFormId(newId);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: fullText, schema: foundJson },
        ]);
      }
      setStreamedContent(""); // Clear the streaming block
    } else {
      setStreamError(
        "Sorry, I couldn't generate a form from your input. Please try rephrasing your request or provide more details!"
      );
    }
  };

  // Find the latest valid schema in the conversation
  const latestSchema = (() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].schema) return messages[i].schema;
    }
    return null;
  })();

  const handleUseForm = () => {
    if (latestSchema) {
      // Save schema to localStorage (or sessionStorage)
      localStorage.setItem("importedFormSchema", JSON.stringify(latestSchema));
      // Redirect to form builder
      router.push("/form-builder");
    }
  };

  const activeForm = forms.find((f) => f.id === activeFormId);

  if (authLoading || checking || hasPremium === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!user || !hasPremium) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6">
        <div className="text-2xl font-semibold">Requires Premium</div>
        <div className="text-muted-foreground text-center max-w-md">
          You need a premium subscription to use the AI form builder. Upgrade to
          unlock all features.
        </div>
        <Link href="/#pricing">
          <Button size="lg">View Pricing</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen max-sm:pb-24 w-full bg-background">
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
            <ChatPanel
              messages={messages}
              isLoading={isLoading}
              isStreaming={isStreaming}
              streamedContent={streamedContent}
              streamError={streamError}
              showSuggestions={showSuggestions}
              suggestions={suggestions}
              setInput={setInput}
              input={input}
              handleSend={handleSend}
              setShowSuggestions={setShowSuggestions}
              setStreamedContent={setStreamedContent}
              setStreamError={setStreamError}
              streamingRef={streamingRef}
              messagesEndRef={messagesEndRef}
              mounted={mounted}
              theme={theme}
            />
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
      <Drawer open={chatDrawerOpen} onOpenChange={setChatDrawerOpen}>
        <DrawerContent className=" max-w-full w-full">
          <DrawerHeader>
            <DrawerTitle>Kiko AI Chat</DrawerTitle>
            <DrawerDescription className="sr-only">
              Chat with the AI form builder assistant
            </DrawerDescription>
            <DrawerCloseButton />
          </DrawerHeader>
          <div className="flex flex-col h-[90vh] overflow-y-auto">
            <ChatPanel
              messages={messages}
              isLoading={isLoading}
              isStreaming={isStreaming}
              streamedContent={streamedContent}
              streamError={streamError}
              showSuggestions={showSuggestions}
              suggestions={suggestions}
              setInput={setInput}
              input={input}
              handleSend={handleSend}
              setShowSuggestions={setShowSuggestions}
              setStreamedContent={setStreamedContent}
              setStreamError={setStreamError}
              streamingRef={streamingRef}
              messagesEndRef={messagesEndRef}
              mounted={mounted}
              theme={theme}
            />
          </div>
        </DrawerContent>
      </Drawer>
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

      {showJsonModal && activeForm?.schema && (
        <Modal open={showJsonModal} onOpenChange={setShowJsonModal}>
          <ModalContent className="max-w-lg w-[95vw]">
            <ModalHeader>
              <ModalTitle>Form JSON Schema</ModalTitle>
            </ModalHeader>
            <ScrollArea className="bg-muted rounded-ele text-xs max-h-[60vh] min-h-[120px] h-[40rem] w-full border p-4 my-4">
              <pre className="whitespace-pre-wrap break-words">
                {JSON.stringify(activeForm.schema, null, 2)}
              </pre>
            </ScrollArea>
            <ModalFooter>
              <CopyButtonWithState schema={activeForm.schema} />
              <ModalClose asChild>
                <Button variant="outline">Close</Button>
              </ModalClose>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}

// Add global CSS for scrollbar-none if not available in Tailwind
if (typeof window !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `
    .scrollbar-none {
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    .scrollbar-none::-webkit-scrollbar {
      display: none;
    }
  `;
  document.head.appendChild(style);
}

function ExpandableJsonBlock({ schema }: { schema: any }) {
  const [expanded, setExpanded] = useState(false);
  const targetHeight = expanded ? 100 : 300;
  return (
    <div className="my-2 p-3 rounded-lg bg-muted/50 border border-border text-xs font-mono overflow-hidden transition-all duration-200  ">
      <motion.div
        animate={{ height: targetHeight }}
        initial={{ height: 100 }}
        style={{ overflow: "hidden" }}
      >
        <ScrollArea className="w-full h-full">
          <pre className="whitespace-pre-wrap break-words">
            {JSON.stringify(schema, null, 2)}
          </pre>
        </ScrollArea>
      </motion.div>
      <div className="flex justify-end mt-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setExpanded((e) => !e)}
          className="text-xs px-2 py-1 h-7 flex items-center gap-1"
        >
          {expanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
          {expanded ? "Collapse" : "Expand"}
        </Button>
      </div>
    </div>
  );
}

function CopyButtonWithState({ schema }: { schema: any }) {
  const [copied, setCopied] = useState(false);
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Button
            variant="outline"
            size={"icon"}
            onClick={async () => {
              await navigator.clipboard.writeText(
                JSON.stringify(schema, null, 2)
              );
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="flex items-center gap-1"
            disabled={copied}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 transition-all" />
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent size="sm">{copied ? "Copied" : "Copy"}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
