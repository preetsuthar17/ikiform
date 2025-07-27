// AI form suggestions component

// Icons
import { Sparkles } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
// UI Components
import { Card } from '@/components/ui/card';

// Constants
import { AI_FORM_SUGGESTIONS } from '../constants';

// Types
import type { AIFormSuggestionsProps } from '../types';

export function AIFormSuggestions({ onCreateForm }: AIFormSuggestionsProps) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="flex items-center gap-2 font-semibold text-foreground text-lg">
        <Sparkles className="h-5 w-5 text-primary" /> Forms templates with Kiko
        AI
      </h3>
      <div className="flex flex-wrap gap-6">
        {AI_FORM_SUGGESTIONS.map((suggestion, index) => (
          <Card
            className="grow rounded-card border-border bg-card p-4"
            key={index}
          >
            <div className="flex flex-col items-start gap-3 text-left">
              <p className="font-medium">{suggestion.title}</p>
              <p className="font-medium text-muted-foreground text-sm">
                {suggestion.summary}
              </p>
              <Button
                className="w-fit"
                onClick={() => onCreateForm(suggestion.prompt)}
                size="sm"
                variant="secondary"
              >
                Use this template
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
