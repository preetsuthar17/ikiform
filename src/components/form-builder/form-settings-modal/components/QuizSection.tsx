import { Trophy } from "lucide-react";
import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { LocalSettings } from "../types";

interface QuizSectionProps {
  localSettings: LocalSettings;
  updateSettings: (updates: Partial<LocalSettings>) => void;
}

export function QuizSection({
  localSettings,
  updateSettings,
}: QuizSectionProps) {
  const quizSettings = localSettings.quiz || {};

  const updateQuizSettings = (
    updates: Partial<NonNullable<LocalSettings["quiz"]>>,
  ) => {
    updateSettings({
      quiz: {
        ...quizSettings,
        ...updates,
      },
    });
  };

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center gap-3">
        <Trophy className="h-5 w-5 text-primary" />
        <h3 className="font-medium text-lg">Quiz & Scoring</h3>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Switch
            checked={quizSettings.enabled}
            id="quiz-enabled"
            onCheckedChange={(enabled) => updateQuizSettings({ enabled })}
            size="sm"
          />
          <Label className="font-medium text-sm" htmlFor="quiz-enabled">
            Enable Quiz Mode
          </Label>
        </div>

        {quizSettings.enabled && (
          <div className="flex flex-col gap-4 border-muted border-l-2 pl-6">
            {/* Passing Score */}
            <QuizField
              description="Minimum percentage needed to pass the quiz"
              id="passing-score"
              label="Passing Score (%)"
              max={100}
              min={0}
              onChange={(value) => updateQuizSettings({ passingScore: value })}
              step={5}
              type="slider"
              value={quizSettings.passingScore || 70}
            />

            {/* Show Score to User */}
            <QuizToggleField
              checked={quizSettings.showScore !== false}
              description="Display the user's score after form submission"
              id="show-score"
              label="Show Score to User"
              onChange={(showScore) => updateQuizSettings({ showScore })}
            />

            {/* Show Correct Answers */}
            <QuizToggleField
              checked={quizSettings.showCorrectAnswers !== false}
              description="Show correct answers and explanations after submission"
              id="show-correct"
              label="Show Correct Answers"
              onChange={(showCorrectAnswers) =>
                updateQuizSettings({ showCorrectAnswers })
              }
            />

            {/* Allow Retake */}
            <QuizToggleField
              checked={quizSettings.allowRetake ?? false}
              description="Let users retake the quiz to improve their score"
              id="allow-retake"
              label="Allow Retake"
              onChange={(allowRetake) => updateQuizSettings({ allowRetake })}
            />

            {/* Time Limit */}
            <QuizField
              description="Optional time limit for quiz completion"
              id="time-limit"
              label="Time Limit (minutes)"
              max={180}
              min={1}
              onChange={(timeLimit) => {
                const value = timeLimit
                  ? Number.parseInt(timeLimit.toString())
                  : undefined;
                updateQuizSettings({ timeLimit: value });
              }}
              placeholder="Leave empty for no limit"
              type="number"
              value={quizSettings.timeLimit || ""}
            />

            {/* Custom Result Messages */}
            <div className="space-y-4 pt-2">
              <Label className="font-medium text-sm">
                Custom Result Messages
              </Label>

              <QuizField
                description="Use {score}, {percentage}, {total} as placeholders"
                id="pass-message"
                label="Success Message"
                onChange={(pass) =>
                  updateQuizSettings({
                    resultMessage: {
                      ...quizSettings.resultMessage,
                      pass,
                    },
                  })
                }
                placeholder="Congratulations! You passed with {percentage}% ({score}/{total} points)."
                rows={3}
                type="textarea"
                value={quizSettings.resultMessage?.pass || ""}
              />

              <QuizField
                description="Use {score}, {percentage}, {total} as placeholders"
                id="fail-message"
                label="Improvement Message"
                onChange={(fail) =>
                  updateQuizSettings({
                    resultMessage: {
                      ...quizSettings.resultMessage,
                      fail,
                    },
                  })
                }
                placeholder="You scored {percentage}% ({score}/{total} points). Keep practicing!"
                rows={3}
                type="textarea"
                value={quizSettings.resultMessage?.fail || ""}
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

// Helper component for quiz fields
function QuizField({
  id,
  label,
  description,
  value,
  onChange,
  type = "text",
  placeholder,
  rows,
  min,
  max,
  step,
}: {
  id: string;
  label: string;
  description?: string;
  value: any;
  onChange: (value: any) => void;
  type?: "text" | "number" | "textarea" | "slider";
  placeholder?: string;
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {type === "slider" ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">{description}</span>
            <span className="font-medium text-sm">{value}%</span>
          </div>
          <Slider
            className="w-full"
            id={id}
            max={max}
            min={min}
            onValueChange={([newValue]) => onChange(newValue)}
            step={step}
            value={[value]}
          />
        </div>
      ) : type === "textarea" ? (
        <>
          <Textarea
            id={id}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            value={value}
          />
          {description && (
            <p className="text-muted-foreground text-xs">{description}</p>
          )}
        </>
      ) : (
        <>
          <Input
            id={id}
            max={max}
            min={min}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            type={type}
            value={value}
          />
          {description && (
            <p className="text-muted-foreground text-xs">{description}</p>
          )}
        </>
      )}
    </div>
  );
}

// Helper component for toggle fields
function QuizToggleField({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-3">
      <Switch
        checked={checked}
        className="mt-1"
        id={id}
        onCheckedChange={onChange}
        size="sm"
      />
      <div className="flex flex-1 flex-col gap-2">
        <Label className="cursor-pointer font-medium text-sm" htmlFor={id}>
          {label}
        </Label>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
    </div>
  );
}
