// AI form suggestions component
import React from "react";

// UI Components
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Icons
import { Sparkles } from "lucide-react";

// Constants
import { AI_FORM_SUGGESTIONS } from "../constants";

// Types
import type { AIFormSuggestionsProps } from "../types";

export function AIFormSuggestions({ onCreateForm }: AIFormSuggestionsProps) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" /> Kiko AI
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {AI_FORM_SUGGESTIONS.map((suggestion, index) => (
          <Card key={index} className="p-4 bg-card border-border rounded-card">
            <div className="flex flex-col gap-3 items-start text-left">
              <p className="font-medium text-muted-foreground">
                {suggestion.prompt}
              </p>
              <Button
                size="sm"
                variant="secondary"
                className="w-fit"
                onClick={() => onCreateForm(suggestion.prompt)}
              >
                <Sparkles className="w-4 h-4" />
                Create Form
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
