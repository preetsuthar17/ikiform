import { CheckCircle, HelpCircle, Info, XCircle } from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioItem } from '@/components/ui/radio';
import type { BaseFieldProps } from '../types';
import { getErrorRingClasses } from '../utils';
import { sanitizeOptions } from '../utils/sanitizeOptions';

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
  const [loading, setLoading] = React.useState(false);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (field.optionsApi) {
      setLoading(true);
      fetch(field.optionsApi)
        .then((res) => res.json())
        .then((data) => {
          let options: Array<any> = [];
          if (Array.isArray(data)) {
            options = data;
          } else if (Array.isArray(data.options)) {
            options = data.options;
          }

          if (field.valueKey || field.labelKey) {
            options = options.map((item: any) => {
              return {
                value: field.valueKey ? item[field.valueKey] : item.value,
                label: field.labelKey
                  ? item[field.labelKey]
                  : item.label || item.value,
              };
            });
          }
          setApiOptions(sanitizeOptions(options));
          setLoading(false);
        })
        .catch((err) => {
          setFetchError('Failed to fetch options');
          setLoading(false);
        });
    } else {
      setApiOptions(null);
    }
  }, [field.optionsApi, field.valueKey ?? '', field.labelKey ?? '']);

  const options = apiOptions ?? field.options ?? [];
  const correctAnswer = field.settings?.correctAnswer;
  const isCorrect = value && correctAnswer && value === correctAnswer;
  const points = field.settings?.points || 1;
  const explanation = field.settings?.explanation;

  const getFeedbackIcon = () => {
    if (!(showFeedback && isSubmitted && value)) return null;

    if (isCorrect) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
    return <XCircle className="h-4 w-4 text-red-600" />;
  };

  const getFeedbackStyling = () => {
    if (!(showFeedback && isSubmitted && value)) return '';

    if (isCorrect) {
      return 'border-green-200 bg-green-50';
    }
    return 'border-red-200 bg-red-50';
  };

  return (
    <div className="group flex flex-col gap-3">
      {/* Question with points indicator - no default field label */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          {field.label && (
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-primary" />
              <label className="font-medium text-foreground text-sm">
                {field.label}
                {field.required && (
                  <span className="ml-1 text-destructive">*</span>
                )}
              </label>
            </div>
          )}
          {field.description && (
            <p className="mt-1 text-muted-foreground text-sm">
              {field.description}
            </p>
          )}
        </div>

        {/* Points indicator */}
        <Badge className="text-xs transition-all" variant="secondary">
          {points} {points === 1 ? 'point' : 'points'}
        </Badge>
      </div>

      {/* Radio options */}
      <RadioGroup
        className={`flex flex-col gap-2 ${errorRingClasses}`}
        disabled={disabled || loading}
        onValueChange={onChange}
        value={value || ''}
      >
        {fetchError && <div className="p-2 text-red-500">{fetchError}</div>}
        {options.filter(Boolean).map((option, index) => {
          let optionValue = '';
          let optionLabel = '';

          if (typeof option === 'string') {
            optionValue = option;
            optionLabel = option;
          } else if (option && typeof option === 'object') {
            optionValue = option.value || '';
            optionLabel = option.label || option.value || '';
          }

          if (!optionValue) return null;

          const isThisOptionCorrect = correctAnswer === optionValue;
          const isSelected = value === optionValue;

          let optionStyling = '';
          let optionIcon = null;

          if (showFeedback && isSubmitted) {
            if (isThisOptionCorrect) {
              optionStyling = 'border-green-500 bg-green-50';
              optionIcon = <CheckCircle className="h-4 w-4 text-green-600" />;
            } else if (isSelected && !isThisOptionCorrect) {
              optionStyling = 'border-red-500 bg-red-50';
              optionIcon = <XCircle className="h-4 w-4 text-red-600" />;
            }
          }

          return (
            <div
              className={`rounded-lg border p-3 transition-colors ${optionStyling}`}
              key={index}
            >
              <div className="flex items-center justify-between">
                <RadioItem
                  disabled={disabled || loading}
                  id={`${field.id}-${index}`}
                  label={optionLabel}
                  value={optionValue}
                />
                {optionIcon}
              </div>
            </div>
          );
        })}
      </RadioGroup>

      {/* Feedback section */}
      {showFeedback && isSubmitted && value && (
        <Card className={`p-4 ${getFeedbackStyling()}`}>
          <div className="flex items-start gap-3">
            {getFeedbackIcon()}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </span>
                <span className="text-muted-foreground text-sm">
                  {isCorrect ? `+${points} points` : '0 points'}
                </span>
              </div>

              {/* Show correct answer if user was wrong */}
              {!isCorrect && correctAnswer && (
                <p className="mt-1 text-muted-foreground text-sm">
                  Correct answer: {(() => {
                    const correctOption = options.find(
                      (opt) =>
                        (typeof opt === 'string' ? opt : opt.value) ===
                        correctAnswer
                    );
                    if (!correctOption) return correctAnswer;
                    return typeof correctOption === 'string'
                      ? correctOption
                      : correctOption.label || correctOption.value;
                  })()}
                </p>
              )}

              {/* Show explanation if available */}
              {explanation && (
                <div className="mt-2 flex gap-2">
                  <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                  <p className="text-muted-foreground text-sm">{explanation}</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}
