// External imports
import { useState, useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";

// Type imports
import type { Form, FormSubmission } from "@/lib/database";
import type { ChatMessage, AnalyticsData } from "../types";

// Utility imports
import { generateSessionId } from "../utils/analytics";

export const useAnalyticsChat = (
  form: Form,
  submissions: FormSubmission[],
  analyticsData: AnalyticsData
) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatStreaming, setChatStreaming] = useState(false);
  const [streamedContent, setStreamedContent] = useState("");
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, streamedContent]);

  useEffect(() => {
    if (chatOpen && chatInputRef.current) {
      setTimeout(() => chatInputRef.current?.focus(), 100);
    }
  }, [chatOpen]);

  const handleChatSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    let sessionId = chatSessionId || generateSessionId();
    if (!chatSessionId) setChatSessionId(sessionId);

    const userMessage: ChatMessage = {
      role: "user",
      content: chatInput,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setChatLoading(true);
    setChatStreaming(true);
    setStreamedContent("");

    const controller = new AbortController();
    setAbortController(controller);

    try {
      const analyticsContext = {
        form: {
          id: form.id,
          title: form.title,
          description: form.description,
          is_published: form.is_published,
          created_at: form.created_at,
          updated_at: form.updated_at,
          schema: form.schema,
        },
        submissions,
        analytics: analyticsData,
      };

      const response = await fetch("/api/analytics-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: chatMessages.concat(userMessage),
          formId: form.id,
          context: analyticsContext,
          sessionId,
        }),
        signal: controller.signal,
      });

      if (!response.ok) throw new Error("Failed to send message");

      const responseSessionId = response.headers.get("X-Session-ID");
      if (responseSessionId && !chatSessionId)
        setChatSessionId(responseSessionId);

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream");

      let fullResponse = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        fullResponse += chunk;
        setStreamedContent(fullResponse);
      }

      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: fullResponse, timestamp: new Date() },
      ]);

      setStreamedContent("");
      setChatStreaming(false);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        const partialResponse = streamedContent.trim();
        if (partialResponse) {
          setChatMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: partialResponse + "\n\n[Response stopped by user]",
              timestamp: new Date(),
            },
          ]);
        }
        setStreamedContent("");
      } else {
        console.error("Chat error:", error);
        toast.error("Failed to send message. Please try again.");
        setChatMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I encountered an error. Please try again.",
            timestamp: new Date(),
          },
        ]);
      }
    } finally {
      setChatLoading(false);
      setChatStreaming(false);
      setAbortController(null);
    }
  };

  const handleStopGeneration = () => {
    abortController?.abort();
  };

  const generateChatSuggestions = (): string[] => {
    const { totalSubmissions } = analyticsData;
    const hasSubmissions = submissions.length > 0;
    const conversationLength = chatMessages.length;

    const baseSuggestions = [
      "Break down my form's performance",
      "What patterns can you spot?",
      "Help me understand the data",
      "What should I know about user behavior?",
    ];

    const contextSuggestions = [
      "What insights jump out to you?",
      "Where are users getting stuck?",
      "What's working well vs. not?",
      "How can I boost conversions?",
      "What would you optimize first?",
    ];

    const followUpSuggestions = [
      "Dig deeper into that",
      "What else should I consider?",
      "How significant is this?",
      "What's the root cause?",
      "Give me actionable next steps",
    ];

    if (conversationLength === 0) {
      return hasSubmissions && totalSubmissions > 0
        ? contextSuggestions.slice(0, 4)
        : baseSuggestions.slice(0, 4);
    } else {
      return followUpSuggestions.slice(0, 4);
    }
  };

  const chatSuggestions = generateChatSuggestions();

  return {
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
  };
};
