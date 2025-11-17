"use client";

import { Send, Square } from "lucide-react";

import Image from "next/image";
import { memo, useEffect, useMemo } from "react";

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Loader } from "@/components/ui/loader";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

import type { ChatInterfaceProps } from "../types";

function formatContent(content: any): string {
  if (content === null || content === undefined) {
    return String(content);
  }

  if (typeof content === "object") {
    if (Array.isArray(content)) {
      const formattedItems = content.map((item, index) => {
        if (typeof item === "object" && item !== null) {
          const entries = Object.entries(item)
            .map(([key, value]) => `${key}: ${formatValue(value)}`)
            .join(", ");
          return `Item ${index + 1}: {${entries}}`;
        }
        return formatValue(item);
      });
      return formattedItems.join("\n");
    }

    return Object.entries(content)
      .map(([key, value]) => `- **${key}**: ${formatValue(value)}`)
      .join("\n");
  }

  return String(content);
}

function formatValue(value: any): string {
  if (value === null || value === undefined) {
    return String(value);
  }

  if (typeof value === "object") {
    if (Array.isArray(value)) {
      return `[${value.map(formatValue).join(", ")}]`;
    }

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
  const formattedContent = formatContent(message.content);
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"}`}
      key={index}
    >
      <div
        className={`flex max-w-[85%] gap-3 ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {}
        <div
          className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-primary/10 text-primary"
          }`}
        >
          {isUser ? (
            <svg className="size-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                clipRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                fillRule="evenodd"
              />
            </svg>
          ) : (
            <svg className="size-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                clipRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                fillRule="evenodd"
              />
            </svg>
          )}
        </div>

        {}
        <div
          className={`group relative rounded-2xl px-4 py-3 ${
            isUser
              ? "rounded-br-sm bg-primary text-primary-foreground"
              : "rounded-bl-sm border bg-card"
          }`}
        >
          <div className="text-sm leading-relaxed">
            {isUser ? (
              <div className="whitespace-pre-wrap">{formattedContent}</div>
            ) : (
              <div className="markdown-content">
                <ReactMarkdown
                  components={markdownComponents}
                  rehypePlugins={[rehypeSanitize]}
                  remarkPlugins={[remarkGfm]}
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

  const markdownComponents = useMemo(
    () => ({
      code: ({ inline, className, children, ...props }: any) => {
        const match = /language-(\w+)/.exec(className || "");
        return !inline && match ? (
          <SyntaxHighlighter
            className="my-2 rounded-2xl"
            language={match[1]}
            PreTag="div"
            style={oneDark}
            {...props}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        ) : (
          <code
            className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm"
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
        <h1 className="mb-2 font-bold text-xl" {...props}>
          {children}
        </h1>
      ),
      h2: ({ children, ...props }: any) => (
        <h2 className="mb-2 font-semibold text-lg" {...props}>
          {children}
        </h2>
      ),
      h3: ({ children, ...props }: any) => (
        <h3 className="mb-2 font-medium text-md" {...props}>
          {children}
        </h3>
      ),
      ul: ({ children, ...props }: any) => (
        <ul
          className="mb-2 flex list-inside list-disc flex-col gap-1"
          {...props}
        >
          {children}
        </ul>
      ),
      ol: ({ children, ...props }: any) => (
        <ol
          className="mb-2 flex list-inside list-decimal flex-col gap-1"
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
          className="mb-2 border-primary border-l-4 pl-4 italic"
          {...props}
        >
          {children}
        </blockquote>
      ),
      table: ({ children, ...props }: any) => (
        <div className="mb-2 overflow-x-auto">
          <table
            className="min-w-full border-collapse rounded-2xl border border-border"
            {...props}
          >
            {children}
          </table>
        </div>
      ),
      th: ({ children, ...props }: any) => (
        <th
          className="border border-border bg-muted px-3 py-2 text-left font-medium"
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
    []
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
    <div className="mx-4 flex h-[88%] flex-col bg-background md:mx-0 md:h-[84%]">
      {}
      <ScrollArea className="h-full flex-1">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6">
          {}
          {isEmpty && (
            <div className="flex flex-col items-center gap-6 py-12 text-center">
              <div className="flex size-20 items-center justify-center rounded-2xl bg-primary/10">
                <Image
                  alt="Ikiform"
                  className="pointer-events-none rounded-xl"
                  height={100}
                  src="/logo.svg"
                  width={100}
                />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-xl">Ask Kiko Anything</h3>
                <p className="max-w-md text-muted-foreground">
                  Get instant insights and analysis from your form data. Ask
                  questions in natural language.
                </p>
              </div>
            </div>
          )}

          {}
          {chatMessages.map((message, index) => (
            <ChatMessage
              index={index}
              key={`${message.role}-${index}-${message.content.slice(0, 50)}`}
              markdownComponents={markdownComponents}
              message={message}
            />
          ))}

          {}
          {chatStreaming && (
            <div className="flex justify-start gap-3">
              <div className="flex max-w-[85%] gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <svg
                    className="size-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      clipRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                      fillRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="group relative rounded-2xl rounded-bl-md border bg-card px-4 py-3">
                  {streamedContent ? (
                    <div className="text-sm leading-relaxed">
                      <div className="markdown-content">
                        <ReactMarkdown
                          components={markdownComponents}
                          rehypePlugins={[rehypeSanitize]}
                          remarkPlugins={[remarkGfm]}
                        >
                          {formatContent(streamedContent)}
                        </ReactMarkdown>
                      </div>
                      <span className="ml-1 inline-block h-4 w-2 animate-pulse rounded-xl bg-primary" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Loader />
                      <span className="text-muted-foreground text-sm">
                        Thinking...
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {}
          {!isEmpty && chatSuggestions.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 pt-4">
              {chatSuggestions.slice(0, 3).map((suggestion, index) => (
                <Badge
                  className="cursor-pointer px-3 py-1.5 transition-colors hover:bg-accent"
                  key={index}
                  onClick={() => setChatInput(suggestion)}
                  variant="secondary"
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {}
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div>
          <form
            className="relative flex items-end gap-3"
            onSubmit={handleChatSend}
          >
            <div className="flex-1">
              <Textarea
                className="max-h-[120px] min-h-[40px] resize-none pr-12"
                disabled={chatLoading}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleChatSend(e);
                  }
                }}
                placeholder="Ask about your form analytics..."
                ref={chatInputRef}
                value={chatInput}
              />
            </div>
            <div className="flex items-center gap-2">
              {chatStreaming && abortController && (
                <Button
                  className="size-10"
                  onClick={handleStopGeneration}
                  size="icon"
                  variant="destructive"
                >
                  <Square className="size-4" />
                </Button>
              )}
              <Button
                className="size-10"
                disabled={!chatInput.trim() || chatLoading}
                size="icon"
                type="submit"
              >
                <Send className="size-4" />
              </Button>
            </div>
          </form>
          <div className="mt-2 flex items-center justify-center text-muted-foreground text-xs">
            <span>
              Press <Kbd>Enter</Kbd> to send, <Kbd>Shift+Enter</Kbd> for new
              line
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});
