// Animation imports
import { AnimatePresence, motion } from "motion/react";

// UI components imports
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader } from "@/components/ui/loader";

// Local imports
import { ChatPanelProps } from "@/lib/ai-builder/types";
import { ChatHeader } from "./chat-header";
import { WelcomeMessage } from "./welcome-message";
import { ChatMessageItem } from "./chat-message-item";
import { ChatSuggestions } from "./chat-suggestions";
import { ChatInput } from "./chat-input";
import { StreamingIndicator } from "./streaming-indicator";
import { Separator } from "@/components/ui/separator";

export function ChatPanel({
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
  const shouldShowSuggestions = showSuggestions && messages.length === 0;

  const handleSuggestionClick = (text: string) => {
    setInput(text);
    setShowSuggestions(false);
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <ChatHeader />
      <ScrollArea className="flex-1 relative p-4">
        <div className="flex flex-col gap-4">
          {messages.length === 0 && (
            <WelcomeMessage mounted={mounted} theme={theme} />
          )}
          <AnimatePresence>
            {messages.map((message, index) => (
              <ChatMessageItem
                key={`${message.role}-${index}-${message.content.slice(0, 50)}`}
                message={message}
                index={index}
              />
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <Loader />
            </motion.div>
          )}
          {isStreaming && (
            <StreamingIndicator
              ref={streamingRef}
              streamedContent={streamedContent}
              streamError={streamError}
            />
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      {shouldShowSuggestions && (
        <div className="p-4">
          <ChatSuggestions
            suggestions={suggestions}
            onSuggestionClick={handleSuggestionClick}
          />
        </div>
      )}
      <Separator />
      <ChatInput
        input={input}
        setInput={setInput}
        onSubmit={handleSend}
        isLoading={isLoading}
      />
    </div>
  );
}
