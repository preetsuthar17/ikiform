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
    <div className="overflow-hidden max-sm:hidden flex flex-col gap-2">
      <div className="flex flex-wrap gap-2 overflow-x-auto grow">
        {suggestions.map((s, i) => (
          <Button
            key={i}
            size={"sm"}
            variant={"secondary"}
            className="rounded-card grow"
            onClick={() => onSuggestionClick(s.text)}
          >
            {s.text}
          </Button>
        ))}
      </div>
    </div>
  );
}
