// Icon imports
import { Send } from "lucide-react";

// UI components imports
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Kbd } from "@/components/ui/kbd";

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
    <div className="backdrop-blur p-4 flex flex-col gap-3">
      <form
        onSubmit={onSubmit}
        className="relative flex items-center bg-card rounded-ele border border-border shadow-md px-4 py-2 gap-4"
      >
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe the form you want to create..."
          className="flex-1 bg-transparent border-none outline-none resize-none min-h-[40px] max-h-[120px] p-3 focus-visible:ring-0  focus-visible:ring-offset-0"
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
          size="icon"
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          {!isLoading && <Send className="w-4 h-4" />}
        </Button>
      </form>
      <div className="text-xs text-muted-foreground text-center gap-2">
        Press <Kbd size="sm">Enter</Kbd> to send,{" "}
        <Kbd size="sm">Shift+Enter</Kbd> for new line
      </div>
    </div>
  );
}
