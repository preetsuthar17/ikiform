import React from "react";
import type { BaseFieldProps } from "../types";
import { RadioGroup, RadioItem } from "@/components/ui/radio";

export function PollField({
  field,
  value,
  onChange,
  error,
  fieldRef,
}: BaseFieldProps) {
  const options = field.settings?.pollOptions || [];
  const showResults = !!field.settings?.showResults;

  // For demo: fake results
  const fakeResults = options.map((opt, i) => ({
    label: opt,
    votes: Math.floor(Math.random() * 20),
  }));
  const totalVotes = fakeResults.reduce((sum, o) => sum + o.votes, 0);

  return (
    <RadioGroup value={value || ""} onValueChange={onChange} error={error}>
      {options.map((option, idx) => (
        <RadioItem key={idx} value={option} label={option} />
      ))}
    </RadioGroup>
  );
}
