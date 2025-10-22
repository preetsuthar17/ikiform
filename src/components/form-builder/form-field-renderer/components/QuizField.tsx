import { CheckCircle, HelpCircle, Info, XCircle } from "lucide-react";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import type { BaseFieldProps } from "../types";

import { getErrorRingClasses } from "../utils";
import { sanitizeOptions } from "../utils/sanitizeOptions";

interface QuizFieldProps extends BaseFieldProps {
  showFeedback?: boolean;
  isSubmitted?: boolean;
  userScore?: number;
  totalPossibleScore?: number;
}

export function QuizField({
  field,
  value,
  onChange,
  error,
  disabled,
  showFeedback = false,
  isSubmitted = false,
}: QuizFieldProps) {
  const errorRingClasses = getErrorRingClasses(error);
  const [apiOptions, setApiOptions] = React.useState<Array<
    string | { value: string; label?: string }
  > | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  const fetchQuizOptions = async () => {
    if (!field.optionsApi) {
      setApiOptions(null);
      return;
    }

    setIsLoading(true);
    setFetchError(null);

    try {
      const response = await fetch(field.optionsApi);
      const data = await response.json();

      let options: Array<any> = [];
      if (Array.isArray(data)) {
        options = data;
      } else if (Array.isArray(data.options)) {
        options = data.options;
      }

      if (field.valueKey || field.labelKey) {
        options = options.map((item: any) => ({
          value: field.valueKey ? item[field.valueKey] : item.value,
          label: field.labelKey
            ? item[field.labelKey]
            : item.label || item.value,
        }));
      }

      setApiOptions(sanitizeOptions(options));
    } catch (error) {
      setFetchError("Failed to fetch options");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchQuizOptions();
  }, [field.optionsApi, field.valueKey ?? "", field.labelKey ?? ""]);

  const getQuizOptions = () => apiOptions ?? field.options ?? [];

  const getCorrectAnswer = () => field.settings?.correctAnswer;

  const getQuizPoints = () => field.settings?.points || 1;

  const getQuizExplanation = () => field.settings?.explanation;

  const isAnswerCorrect = () => {
    const correctAnswer = getCorrectAnswer();
    return value && correctAnswer && value === correctAnswer;
  };

  const getFeedbackIcon = () => {
    if (!(showFeedback && isSubmitted && value)) return null;

    if (isAnswerCorrect()) {
      return <CheckCircle className="size-4 text-green-600" />;
    }
    return <XCircle className="size-4 text-red-600" />;
  };

  const getFeedbackCardStyling = () => {
    if (!(showFeedback && isSubmitted && value)) return "";

    if (isAnswerCorrect()) {
      return "border-green-200 bg-green-50";
    }
    return "border-red-200 bg-red-50";
  };

  const getOptionStyling = (optionValue: string) => {
    if (!(showFeedback && isSubmitted)) return "";

    const correctAnswer = getCorrectAnswer();
    const isThisOptionCorrect = correctAnswer === optionValue;
    const isSelected = value === optionValue;

    if (isThisOptionCorrect) {
      return "border-green-500 bg-green-50";
    }
    if (isSelected && !isThisOptionCorrect) {
      return "border-red-500 bg-red-50";
    }
    return "";
  };

  const getOptionIcon = (optionValue: string) => {
    if (!(showFeedback && isSubmitted)) return null;

    const correctAnswer = getCorrectAnswer();
    const isThisOptionCorrect = correctAnswer === optionValue;
    const isSelected = value === optionValue;

    if (isThisOptionCorrect) {
      return <CheckCircle className="size-4 text-green-600" />;
    }
    if (isSelected && !isThisOptionCorrect) {
      return <XCircle className="size-4 text-red-600" />;
    }
    return null;
  };

  const getCorrectAnswerText = () => {
    const correctAnswer = getCorrectAnswer();
    if (!correctAnswer) return "";

    const correctOption = getQuizOptions().find(
      (opt) => (typeof opt === "string" ? opt : opt.value) === correctAnswer
    );

    if (!correctOption) return correctAnswer;
    return typeof correctOption === "string"
      ? correctOption
      : correctOption.label || correctOption.value;
  };

  const handleValueChange = (newValue: string) => {
    onChange(newValue);
  };

  const renderQuizHeader = () => {
    const points = getQuizPoints();

    return (
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          {field.label && (
            <div className="flex items-center gap-2">
              <HelpCircle className="size-4 text-primary" />
              <Label className="font-medium text-foreground text-sm">
                {field.label}
                {field.required && (
                  <span className="ml-1 text-destructive">*</span>
                )}
              </Label>
            </div>
          )}
          {field.description && (
            <p className="mt-1 text-muted-foreground text-sm">
              {field.description}
            </p>
          )}
        </div>
        <Badge className="text-xs transition-all" variant="secondary">
          {points} {points === 1 ? "point" : "points"}
        </Badge>
      </div>
    );
  };

  const renderQuizOptions = () => {
    const options = getQuizOptions();

    return (
      <RadioGroup
        className={`flex flex-col gap-2 ${errorRingClasses}`}
        disabled={disabled || isLoading}
        onValueChange={handleValueChange}
        value={value || ""}
      >
        {fetchError && (
          <div className="p-2 text-destructive text-sm" role="alert">
            {fetchError}
          </div>
        )}
        {options.filter(Boolean).map((option, index) => {
          let optionValue = "";
          let optionLabel = "";

          if (typeof option === "string") {
            optionValue = option;
            optionLabel = option;
          } else if (option && typeof option === "object") {
            optionValue = option.value || "";
            optionLabel = option.label || option.value || "";
          }

          if (!optionValue) return null;

          return (
            <div
              className={`rounded-lg border p-3 transition-colors ${getOptionStyling(optionValue)}`}
              key={index}
            >
              <div className="flex h-full items-center justify-start gap-2">
                <RadioGroupItem
                  disabled={disabled || isLoading}
                  id={`${field.id}-${index}`}
                  value={optionValue}
                />
                <Label
                  className="flex h-full w-full flex-1 items-center"
                  htmlFor={`${field.id}-${index}`}
                  style={{ height: "100%", width: "100%" }}
                >
                  {optionLabel}
                </Label>
                {getOptionIcon(optionValue)}
              </div>
            </div>
          );
        })}
      </RadioGroup>
    );
  };

  const renderFeedback = () => {
    if (!(showFeedback && isSubmitted && value)) return null;

    const points = getQuizPoints();
    const explanation = getQuizExplanation();
    const isCorrect = isAnswerCorrect();
    const correctAnswerText = getCorrectAnswerText();

    return (
      <Card className={`p-4 ${getFeedbackCardStyling()}`}>
        <div className="flex items-start gap-3">
          {getFeedbackIcon()}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">
                {isCorrect ? "Correct!" : "Incorrect"}
              </span>
              <span className="text-muted-foreground text-sm">
                {isCorrect ? `+${points} points` : "0 points"}
              </span>
            </div>

            {!isCorrect && correctAnswerText && (
              <p className="mt-1 text-muted-foreground text-sm">
                Correct answer: {correctAnswerText}
              </p>
            )}

            {explanation && (
              <div className="mt-2 flex gap-2">
                <Info className="mt-0.5 size-4 flex-shrink-0 text-blue-600" />
                <p className="text-muted-foreground text-sm">{explanation}</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="group flex flex-col gap-3">
      {renderQuizHeader()}
      {renderQuizOptions()}
      {renderFeedback()}
      {error && (
        <p aria-live="polite" className="text-destructive text-sm" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
