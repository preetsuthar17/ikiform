import { Send, Square } from 'lucide-react';

import Image from 'next/image';
import React, { memo, useEffect, useMemo } from 'react';

import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Kbd } from '@/components/ui/kbd';
import { Loader } from '@/components/ui/loader';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

import type { ChatInterfaceProps } from '../types';

function formatContent(content: any): string {
  if (content === null || content === undefined) {
    return String(content);
  }

  if (typeof content === 'object') {
    if (Array.isArray(content)) {
      const formattedItems = content.map((item, index) => {
        if (typeof item === 'object' && item !== null) {
          const entries = Object.entries(item)
            .map(([key, value]) => `${key}: ${formatValue(value)}`)
            .join(', ');
          return `Item ${index + 1}: {${entries}}`;
        }
        return formatValue(item);
      });
      return formattedItems.join('\n');
    }

    return Object.entries(content)
      .map(([key, value]) => `- **${key}**: ${formatValue(value)}`)
      .join('\n');
  }

  return String(content);
}

function formatValue(value: any): string {
  if (value === null || value === undefined) {
    return String(value);
  }

  if (typeof value === 'object') {
    if (Array.isArray(value)) {
      return `[${value.map(formatValue).join(', ')}]`;
    }

    const entries = Object.entries(value)
      .map(([k, v]) => `${k}: ${formatValue(v)}`)
      .join(', ');
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

  return (
    <div
      className={`flex gap-4 ${
        message.role === 'user' ? 'justify-end' : 'justify-start'
      }`}
      key={index}
    >
      <div
        className={`flex max-w-[85%] gap-3 ${
          message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        {}
        <div
          className={`group relative rounded-card px-4 py-3 ${
            message.role === 'user'
              ? 'rounded-br-md bg-primary text-primary-foreground'
              : 'rounded-bl-md border bg-muted/50'
          }`}
        >
          <div className="text-sm leading-relaxed">
            {message.role === 'user' ? (
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
        const match = /language-(\w+)/.exec(className || '');
        return !inline && match ? (
          <SyntaxHighlighter
            className="my-2 rounded-card"
            language={match[1]}
            PreTag="div"
            style={oneDark}
            {...props}
          >
            {String(children).replace(/\n$/, '')}
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
            className="min-w-full border-collapse rounded-card border border-border"
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
      typeof chatInputRef !== 'function' &&
      chatInputRef.current
    ) {
      chatInputRef.current.focus();
    }
  }, [chatInputRef]);

  return (
    <div className="background relative flex h-[74vh] flex-col">
      {}
      <ScrollArea className="h-[90%] flex-1 overflow-hidden px-6 py-6">
        <div className="mx-auto flex max-w-4xl flex-col gap-6">
          {}
          {isEmpty && (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-card bg-primary/10">
                <Image
                  alt="Ikiform"
                  className="pointer-events-none rounded-ele dark:invert"
                  height={100}
                  src="/logo.svg"
                  width={100}
                />
              </div>
              <h3 className="font-semibold text-xl">Ask Kiko Anything</h3>
              <p className="max-w-md text-muted-foreground">
                Get instant insights and analysis from your form data. Ask
                questions in natural language.
              </p>
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
            <div className="flex justify-start gap-4">
              <div className="flex max-w-[85%] gap-3">
                <div className="group relative rounded-card rounded-bl-md border bg-muted/50 px-4 py-3">
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
                      <span className="ml-1 inline-block h-4 w-2 animate-pulse rounded-ele bg-primary" />
                    </div>
                  ) : (
                    <Loader />
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

      <div className="flex flex-col gap-3">
        <Separator />
        <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="mx-auto max-w-4xl">
            {}
            <form
              className="relative mx-auto flex max-w-[90%] items-center"
              onSubmit={handleChatSend}
            >
              <Textarea
                className="min-h-[60px] flex-1 resize-none rounded-card pr-16"
                disabled={chatLoading}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleChatSend(e);
                  }
                }}
                placeholder="Ask about your form analytics..."
                ref={chatInputRef}
                value={chatInput}
              />
              <div className="absolute top-0 right-3 flex h-full items-center gap-2">
                {}
                {chatStreaming && abortController && (
                  <Button
                    onClick={handleStopGeneration}
                    size="icon"
                    variant="destructive"
                  >
                    <Square className="h-4 w-4" />
                  </Button>
                )}
                {}
                <Button
                  disabled={!chatInput.trim() || chatLoading}
                  size="icon"
                  type="submit"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
            {}
            <div className="mt-3 flex items-center justify-center text-muted-foreground text-xs">
              <span>
                Press <Kbd size="sm">Enter</Kbd> to send,{' '}
                <Kbd size="sm">Shift+Enter</Kbd> for new line
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
