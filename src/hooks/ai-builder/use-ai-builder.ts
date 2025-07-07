// React imports
import { useState, useEffect, useRef } from "react";

// Next.js imports
import { useRouter } from "next/navigation";

// Local imports
import { ChatMessage, FormSchema } from "@/lib/ai-builder/types";
import {
  generateSessionId,
  checkForDuplicateSchema,
  fixAIGeneratedSchema,
} from "@/lib/ai-builder/utils";
import { AIBuilderService } from "@/lib/ai-builder/ai-service";

export const useAIBuilder = () => {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamingRef = useRef<HTMLDivElement>(null);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [forms, setForms] = useState<FormSchema[]>([]);
  const [activeFormId, setActiveFormId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedContent, setStreamedContent] = useState("");
  const [streamError, setStreamError] = useState<string | null>(null);
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [initialPromptProcessed, setInitialPromptProcessed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !initialPromptProcessed) {
      const urlParams = new URLSearchParams(window.location.search);
      const promptParam = urlParams.get("prompt");
      const sentParam = urlParams.get("sent");

      if (promptParam && sentParam === "true") {
        const decodedPrompt = decodeURIComponent(promptParam);
        setInput(decodedPrompt);
        setInitialPromptProcessed(true);

        setTimeout(() => {
          autoSendPrompt(decodedPrompt);
        }, 500);
      }
    }
  }, [mounted, initialPromptProcessed]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isStreaming && streamingRef.current) {
      streamingRef.current.scrollTop = streamingRef.current.scrollHeight;
    }
  }, [streamedContent, isStreaming]);

  const processAIResponse = async (
    promptText: string,
    currentMessages: ChatMessage[],
  ) => {
    let currentSessionId = sessionId || generateSessionId();
    setSessionId(currentSessionId);

    setIsLoading(true);
    setIsStreaming(true);
    setStreamedContent("");
    setStreamError(null);

    const { fullText, foundJson } = await AIBuilderService.sendMessage(
      currentMessages,
      currentSessionId,
      setStreamedContent,
      setStreamError,
    );

    setIsStreaming(false);
    setIsLoading(false);

    if (foundJson) {
      // Ensure the schema structure is correct
      const fixedSchema = fixAIGeneratedSchema(foundJson);

      const existing = checkForDuplicateSchema(forms, fixedSchema);
      if (existing) {
        setActiveFormId(existing.id);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "This form already exists. Switched to the existing form.",
            schema: fixedSchema,
          },
        ]);
      } else {
        const newId = Date.now().toString();
        setForms((prev) => [
          ...prev,
          { id: newId, schema: fixedSchema, prompt: promptText },
        ]);
        setActiveFormId(newId);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: fullText, schema: fixedSchema },
        ]);
      }
      setStreamedContent("");
    } else {
      setStreamError(
        "Sorry, I couldn't generate a form from your input. Please try rephrasing your request or provide more details!",
      );
    }
  };

  const autoSendPrompt = async (promptText: string) => {
    if (!promptText.trim()) return;

    const newMessage: ChatMessage = { role: "user", content: promptText };
    setMessages((prev) => [...prev, newMessage]);
    await processAIResponse(promptText, [...messages, newMessage]);
  };

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const currentInput = input;
    setInput("");

    const newMessage: ChatMessage = { role: "user", content: currentInput };
    setMessages((prev) => [...prev, newMessage]);
    await processAIResponse(currentInput, [...messages, newMessage]);
  };

  const handleUseForm = () => {
    const activeForm = forms.find((f) => f.id === activeFormId);
    if (activeForm?.schema) {
      localStorage.setItem(
        "importedFormSchema",
        JSON.stringify(activeForm.schema),
      );
      router.push("/form-builder");
    }
  };

  return {
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
    activeForm: forms.find((f) => f.id === activeFormId),
  };
};
