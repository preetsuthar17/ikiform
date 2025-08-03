import { Check, ChevronRight } from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';

interface MultiStepQuizProgressProps {
  steps: Array<{
    id: string;
    title: string;
    isCompleted: boolean;
    hasQuizQuestions: boolean;
    score?: number;
    totalPoints?: number;
  }>;
  currentStepIndex: number;
  className?: string;
}

export function MultiStepQuizProgress({
  steps,
  currentStepIndex,
  className = '',
}: MultiStepQuizProgressProps) {
  if (steps.length <= 1) return null;

  return (
    <div className={cn('w-full', className)}>
      <nav aria-label="Quiz progress">
        <ol className="flex w-full items-center justify-between">
          {steps.map((step, index) => {
            const isCurrent = index === currentStepIndex;
            const isCompleted = step.isCompleted;
            const isPast = index < currentStepIndex;

            return (
              <li
                className={cn(
                  'flex items-center',
                  index !== steps.length - 1 && 'flex-1'
                )}
                key={step.id}
              >
                <div className="flex items-center">
                  {/* Step indicator */}
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full border-2 font-medium text-sm',
                        isCompleted || isPast
                          ? 'border-green-500 bg-green-500 text-white'
                          : isCurrent
                            ? 'border-blue-500 bg-blue-500 text-white'
                            : 'border-gray-300 bg-white text-gray-500'
                      )}
                    >
                      {isCompleted || isPast ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        index + 1
                      )}
                    </div>

                    {/* Step title */}
                    <div className="mt-2 text-center">
                      <div
                        className={cn(
                          'font-medium text-xs',
                          isCurrent
                            ? 'text-blue-600'
                            : isCompleted || isPast
                              ? 'text-green-600'
                              : 'text-gray-500'
                        )}
                      >
                        {step.title}
                      </div>

                      {/* Quiz score for completed steps */}
                      {step.hasQuizQuestions &&
                        (isCompleted || isPast) &&
                        step.score !== undefined && (
                          <div className="mt-1 text-muted-foreground text-xs">
                            {step.score}/{step.totalPoints} pts
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                {/* Connector line */}
                {index !== steps.length - 1 && (
                  <div className="mx-4 flex-1">
                    <div
                      className={cn(
                        'h-0.5 w-full',
                        isCompleted || isPast ? 'bg-green-500' : 'bg-gray-300'
                      )}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
