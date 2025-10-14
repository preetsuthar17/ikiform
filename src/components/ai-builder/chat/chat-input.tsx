import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export function ChatInput({
  input,
  setInput,
  onSubmit,
  isLoading,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const isSubmittingRef = useRef(false);
  const [isMultiline, setIsMultiline] = useState(false);
  const hasText = input.trim().length > 0;

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const maxHeight = 160;
    el.style.height = Math.min(el.scrollHeight, maxHeight) + "px";
    const minHeight = 44;
    const currentHeight = Number.parseFloat(el.style.height || "0");
    setIsMultiline(currentHeight > minHeight + 1);
  };

  useEffect(() => {
    autoResize();
  }, [input]);

  const handleLocalSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (isLoading || isSubmittingRef.current) {
      e.preventDefault();
      return;
    }
    isSubmittingRef.current = true;
    onSubmit(e);
    setTimeout(() => {
      isSubmittingRef.current = false;
    }, 300);
  };

  return (
    <div className="supports-[padding:max(0px)]/ios sticky bottom-0 z-10 flex touch-manipulation flex-col gap-2 bg-gradient-to-t from-background via-background/90 to-transparent p-2 pt-3 pb-[max(0px,env(safe-area-inset-bottom))] backdrop-blur md:gap-3 md:p-3 md:pt-4">
      <form
        className="relative mx-auto flex w-full max-w-3xl items-center gap-2 rounded-2xl border border-border bg-card px-2 py-2 transition-all focus-within:border-primary/30 md:gap-3 md:rounded-xl md:px-4"
        onSubmit={handleLocalSubmit}
      >
        <Textarea
          aria-describedby="chat-input-help"
          aria-label="Message to Kiko AI"
          autoCapitalize="sentences"
          autoComplete="off"
          autoCorrect="on"
          className="max-h-[160px] min-h-[44px] flex-1 resize-none whitespace-pre-wrap break-words border-none bg-transparent p-3 pr-14 text-base leading-normal shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 md:pr-12 md:text-sm md:leading-snug"
          disabled={isLoading}
          enterKeyHint="send"
          id="chat-message"
          inputMode="text"
          name="message"
          onChange={(e) => {
            setInput(e.target.value);
            autoResize();
          }}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
              e.preventDefault();
              (e.target as HTMLTextAreaElement).form?.requestSubmit();
              return;
            }
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              (e.target as HTMLTextAreaElement).form?.requestSubmit();
            }
          }}
          placeholder="Describe the form you want to create…"
          ref={textareaRef}
          rows={1}
          value={input}
        />
        {/** Mobile: larger 44px target */}
        <Button
          aria-label="Send message"
          className={
            "absolute right-2 transition-all duration-200 ease-out md:hidden" +
            (isMultiline && hasText ? "bottom-2" : "-translate-y-1/2 top-1/2")
          }
          disabled={isLoading || !input.trim()}
          loading={isLoading}
          size="icon-lg"
          title="Send message"
          type="submit"
        >
          {!isLoading && <Send className="h-5 w-5" />}
        </Button>
        {/** Desktop/tablet */}
        <Button
          aria-label="Send message"
          className={
            "absolute right-3 hidden transition-all duration-200 ease-out md:inline-flex" +
            (isMultiline && hasText ? "bottom-2" : "-translate-y-1/2 top-1/2")
          }
          disabled={isLoading || !input.trim()}
          loading={isLoading}
          size="icon"
          title="Send message"
          type="submit"
        >
          {!isLoading && <Send className="h-4 w-4" />}
        </Button>
      </form>
      <div
        className="mx-auto w-full max-w-3xl gap-2 px-2 text-center text-[11px] text-muted-foreground md:px-0 md:text-xs"
        id="chat-input-help"
      >
        Press <Kbd>Enter</Kbd> to send, <Kbd>Shift+Enter</Kbd> for new line, or{" "}
        <Kbd>⌘/Ctrl+Enter</Kbd> to send
      </div>
    </div>
  );
}
