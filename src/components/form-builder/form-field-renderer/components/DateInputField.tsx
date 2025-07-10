import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { BaseFieldProps } from "../types";
import { getBaseClasses } from "../utils";
import { parseDate } from "yeezy-dates";

export function DateInputField({
  field,
  value,
  onChange,
  error,
  fieldRef,
}: BaseFieldProps) {
  const mode = field.settings?.dateInputMode || "human-friendly";
  const baseClasses = getBaseClasses(field, error);

  // For human-friendly mode
  const [inputValue, setInputValue] = useState(value || "");
  const [suggestions, setSuggestions] = useState<
    { label: string; date: string }[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  useEffect(() => {
    if (mode === "human-friendly" && inputValue) {
      try {
        const parsed = parseDate(inputValue).map((s) => ({
          label: s.label,
          date: s.date.toISOString(),
        }));
        setSuggestions(parsed);
        setShowSuggestions(parsed.length > 0);
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue, mode]);

  if (mode === "classic") {
    return (
      <DatePicker
        value={value ? new Date(value) : undefined}
        onChange={(date) => onChange(date ? date.toISOString() : "")}
        placeholder={field.placeholder || "Pick a date"}
        className={baseClasses}
      />
    );
  }

  // Human-friendly mode
  return (
    <div className="flex flex-col gap-2 relative">
      <Input
        type="date"
        id={field.id}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className={`flex gap-2 ${baseClasses}`}
        ref={fieldRef}
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-accent border border-border rounded-md p-2 z-888 shadow-lg flex flex-col gap-1">
          {suggestions.map((s, idx) => (
            <Button
              key={idx}
              type="button"
              variant="ghost"
              size="sm"
              className="justify-start w-full text-left"
              onMouseDown={() => {
                setInputValue(s.label);
                onChange(s.date);
                setShowSuggestions(false);
              }}
            >
              <span className="flex items-center gap-2">
                <Badge variant="secondary">{s.label}</Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(s.date).toLocaleString()}
                </span>
              </span>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
