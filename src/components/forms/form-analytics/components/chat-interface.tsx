import React, { memo, useEffect, useMemo } from "react";

// UI Components
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader } from "@/components/ui/loader";
import { Kbd } from "@/components/ui/kbd";

// Icons
import { Send, Square } from "lucide-react";

// Next.js Components
import Image from "next/image";

// Markdown Components
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
// @ts-ignore
import rehypeSanitize from "rehype-sanitize";

// Types
import type { ChatInterfaceProps } from "../types";
// Updated formatContent function with better object handling
function formatContent(content: any): string {
  if (content === null || content === undefined) {
    return String(content);
  }

  if (typeof content === "object") {
    // Handle arrays
    if (Array.isArray(content)) {
      // If it's an array of objects, format each one
      const formattedItems = content.map((item, index) => {
        if (typeof item === "object" && item !== null) {
          // For objects in arrays, create a readable format
          const entries = Object.entries(item)
            .map(([key, value]) => `${key}: ${formatValue(value)}`)
            .join(", ");
          return `Item ${index + 1}: {${entries}}`;
        }
        return formatValue(item);
      });
      return formattedItems.join("\n");
    }

    // Handle regular objects
    return Object.entries(content)
      .map(([key, value]) => `- **${key}**: ${formatValue(value)}`)
      .join("\n");
  }

  return String(content);
}

// Helper function to safely format any value
function formatValue(value: any): string {
  if (value === null || value === undefined) {
    return String(value);
  }

  if (typeof value === "object") {
    if (Array.isArray(value)) {
      return `[${value.map(formatValue).join(", ")}]`;
    }
    // For nested objects, create a compact representation
    const entries = Object.entries(value)
      .map(([k, v]) => `${k}: ${formatValue(v)}`)
      .join(", ");
    return `{${entries}}`;
  }

  return String(value);
}

const ChatMessage = memo(function ChatMessage({
  message,
  index,
  markdownComponents,
}: {
  message: any;
  index: number;
  markdownComponents: any;
}) {
  // Ensure content is always a string
  const formattedContent = formatContent(message.content);

  return (
    <div
      key={index}
      className={`flex gap-4 ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex gap-3 max-w-[85%] ${
          message.role === "user" ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Message Content */}
        <div
          className={`group relative px-4 py-3 rounded-card ${
            message.role === "user"
              ? "bg-primary text-primary-foreground rounded-br-md"
              : "bg-muted/50 border rounded-bl-md"
          }`}
        >
          <div className="text-sm leading-relaxed">
            {message.role === "user" ? (
              <div className="whitespace-pre-wrap">{formattedContent}</div>
            ) : (
              <div className="markdown-content">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeSanitize]}
                  components={markdownComponents}
                >
                  {formattedContent}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export const ChatInterface = memo(function ChatInterface({
  chatMessages,
  chatStreaming,
  streamedContent,
  chatLoading,
  messagesEndRef,
  chatSuggestions,
  setChatInput,
  handleChatSend,
  chatInputRef,
  chatInput,
  abortController,
  handleStopGeneration,
}: ChatInterfaceProps) {
  const isEmpty = chatMessages.length === 0;

  // Memoize markdown components to avoid recreating on each render
  const markdownComponents = useMemo(
    () => ({
      code: ({ inline, className, children, ...props }: any) => {
        const match = /language-(\w+)/.exec(className || "");
        return !inline && match ? (
          <SyntaxHighlighter
            style={oneDark}
            language={match[1]}
            PreTag="div"
            className="rounded-card my-2"
            {...props}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        ) : (
          <code
            className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
            {...props}
          >
            {children}
          </code>
        );
      },
      p: ({ children, ...props }: any) => (
        <p className="mb-2 last:mb-0" {...props}>
          {children}
        </p>
      ),
      h1: ({ children, ...props }: any) => (
        <h1 className="text-xl font-bold mb-2" {...props}>
          {children}
        </h1>
      ),
      h2: ({ children, ...props }: any) => (
        <h2 className="text-lg font-semibold mb-2" {...props}>
          {children}
        </h2>
      ),
      h3: ({ children, ...props }: any) => (
        <h3 className="text-md font-medium mb-2" {...props}>
          {children}
        </h3>
      ),
      ul: ({ children, ...props }: any) => (
        <ul
          className="list-disc list-inside mb-2 flex flex-col gap-1"
          {...props}
        >
          {children}
        </ul>
      ),
      ol: ({ children, ...props }: any) => (
        <ol
          className="list-decimal list-inside mb-2 flex flex-col gap-1"
          {...props}
        >
          {children}
        </ol>
      ),
      li: ({ children, ...props }: any) => (
        <li className="ml-2" {...props}>
          {children}
        </li>
      ),
      blockquote: ({ children, ...props }: any) => (
        <blockquote
          className="border-l-4 border-primary pl-4 italic mb-2"
          {...props}
        >
          {children}
        </blockquote>
      ),
      table: ({ children, ...props }: any) => (
        <div className="overflow-x-auto mb-2">
          <table
            className="min-w-full border-collapse border border-border rounded-card"
            {...props}
          >
            {children}
          </table>
        </div>
      ),
      th: ({ children, ...props }: any) => (
        <th
          className="border border-border px-3 py-2 bg-muted font-medium text-left"
          {...props}
        >
          {children}
        </th>
      ),
      td: ({ children, ...props }: any) => (
        <td className="border border-border px-3 py-2" {...props}>
          {children}
        </td>
      ),
      strong: ({ children, ...props }: any) => (
        <strong className="font-semibold" {...props}>
          {children}
        </strong>
      ),
      em: ({ children, ...props }: any) => (
        <em className="italic" {...props}>
          {children}
        </em>
      ),
    }),
    [],
  );

  useEffect(() => {
    if (
      chatInputRef &&
      typeof chatInputRef !== "function" &&
      chatInputRef.current
    ) {
      chatInputRef.current.focus();
    }
  }, [chatInputRef]);

  return (
    <div className="flex flex-col h-[74vh] background relative">
      {/* Messages Area */}
      <ScrollArea className="flex-1 px-6 py-6 overflow-hidden h-[90%]">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          {/* Welcome State */}
          {isEmpty && (
            <div className="text-center py-12 flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-card bg-primary/10 flex items-center justify-center">
                <Image
                  src="/logo.svg"
                  alt="Ikiform"
                  width={100}
                  height={100}
                  className="pointer-events-none dark:invert rounded-ele"
                />
              </div>
              <h3 className="text-xl font-semibold">Ask Kiko Anything</h3>
              <p className="text-muted-foreground max-w-md">
                Get instant insights and analysis from your form data. Ask
                questions in natural language.
              </p>
            </div>
          )}

          {/* Chat Messages */}
          {chatMessages.map((message, index) => (
            <ChatMessage
              key={`${message.role}-${index}-${message.content.slice(0, 50)}`}
              message={message}
              index={index}
              markdownComponents={markdownComponents}
            />
          ))}

          {/* Streaming Message */}
          {chatStreaming && (
            <div className="flex gap-4 justify-start">
              <div className="flex gap-3 max-w-[85%]">
                <div className="group relative px-4 py-3 rounded-card bg-muted/50 border rounded-bl-md">
                  {streamedContent ? (
                    <div className="text-sm leading-relaxed">
                      <div className="markdown-content">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeSanitize]}
                          components={markdownComponents}
                        >
                          {formatContent(streamedContent)}
                        </ReactMarkdown>
                      </div>
                      <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1 rounded-ele"></span>
                    </div>
                  ) : (
                    <Loader />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions for Existing Conversations */}
          {!isEmpty && chatSuggestions.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center pt-4">
              {chatSuggestions.slice(0, 3).map((suggestion, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-accent transition-colors px-3 py-1.5"
                  onClick={() => setChatInput(suggestion)}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="flex flex-col gap-3">
        <Separator />
        <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-4xl mx-auto">
            {/* Input Form */}
            <form
              onSubmit={handleChatSend}
              className="relative flex items-center  max-w-[90%] mx-auto"
            >
              <Textarea
                ref={chatInputRef}
                placeholder="Ask about your form analytics..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="min-h-[60px] resize-none pr-16 rounded-card flex-1"
                disabled={chatLoading}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleChatSend(e);
                  }
                }}
              />
              <div className="flex gap-2 items-center absolute right-3 top-0 h-full">
                {/* Stop Generation */}
                {chatStreaming && abortController && (
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={handleStopGeneration}
                  >
                    <Square className="w-4 h-4" />
                  </Button>
                )}
                {/* Send Button */}
                <Button
                  type="submit"
                  size="icon"
                  disabled={!chatInput.trim() || chatLoading}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
            {/* Helper Text */}
            <div className="flex items-center justify-center mt-3 text-xs text-muted-foreground">
              <span>
                Press <Kbd size="sm">Enter</Kbd> to send,{" "}
                <Kbd size="sm">Shift+Enter</Kbd> for new line
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
