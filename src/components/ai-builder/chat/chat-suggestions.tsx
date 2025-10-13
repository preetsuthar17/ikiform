import { Button } from "@/components/ui/button";

interface ChatSuggestionsProps {
  suggestions: { text: string; icon: React.ReactNode }[];
  onSuggestionClick: (text: string) => void;
}

export function ChatSuggestions({
  suggestions,
  onSuggestionClick,
}: ChatSuggestionsProps) {
  return (
    <div className="flex flex-col gap-2 overflow-hidden max-sm:hidden">
      <div className="flex grow flex-wrap gap-2 overflow-x-auto">
        {suggestions.map((s, i) => (
          <Button
            className="grow rounded-2xl"
            key={i}
            onClick={() => onSuggestionClick(s.text)}
            size={"sm"}
            variant={"secondary"}
          >
            {s.text}
          </Button>
        ))}
      </div>
    </div>
  );
}
