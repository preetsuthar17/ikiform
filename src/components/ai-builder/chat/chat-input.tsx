import { Send } from "lucide-react";

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
  return (
    <div className="flex flex-col gap-3 p-4 backdrop-blur">
      <form
        className="relative flex items-center gap-4 rounded-ele border border-border bg-card px-4 py-2"
        onSubmit={onSubmit}
      >
        <Textarea
          className="max-h-[120px] min-h-[40px] flex-1 resize-none border-none bg-transparent p-3 outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          disabled={isLoading}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              (e.target as HTMLTextAreaElement).form?.requestSubmit();
            }
          }}
          placeholder="Describe the form you want to create..."
          rows={1}
          value={input}
        />
        <Button
          className="-translate-y-1/2 absolute top-1/2 right-3"
          disabled={isLoading || !input.trim()}
          loading={isLoading}
          size="icon"
          type="submit"
        >
          {!isLoading && <Send className="h-4 w-4" />}
        </Button>
      </form>
      <div className="gap-2 text-center text-muted-foreground text-xs">
        Press <Kbd size="sm">Enter</Kbd> to send,{" "}
        <Kbd size="sm">Shift+Enter</Kbd> for new line
      </div>
    </div>
  );
}
