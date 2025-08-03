import {
  Award,
  CheckCircle,
  Info,
  RotateCcw,
  Target,
  TrendingUp,
  Trophy,
  XCircle,
} from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import type { QuizResult } from '@/lib/quiz/scoring';

interface QuizResultsProps {
  result: QuizResult;
  showDetailedResults?: boolean;
  allowRetake?: boolean;
  onRetake?: () => void;
  customMessage?: string;
}

export function QuizResults({
  result,
  showDetailedResults = true,
  allowRetake = false,
  onRetake,
  customMessage,
}: QuizResultsProps) {
  const {
    score,
    totalPossible,
    percentage,
    passed,
    answeredQuestions,
    totalQuestions,
    fieldResults,
  } = result;

  const getScoreColor = () => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = () => {
    if (passed) return 'default';
    return 'destructive';
  };

  return (
    <div className="space-y-6">
      {/* Main Score Card */}
      <Card className="p-8 text-center">
        <div className="mb-6 flex justify-center">
          {passed ? (
            <div className="rounded-full bg-green-100 p-4">
              <Trophy className="h-12 w-12 text-green-600" />
            </div>
          ) : (
            <div className="rounded-full bg-blue-100 p-4">
              <Target className="h-12 w-12 text-blue-600" />
            </div>
          )}
        </div>

        <h2 className="mb-4 font-bold text-2xl text-foreground">
          {passed ? 'Congratulations!' : 'Quiz Complete'}
        </h2>

        {customMessage ? (
          <p className="mb-6 text-muted-foreground">{customMessage}</p>
        ) : (
          <p className="mb-6 text-muted-foreground">
            {passed
              ? "You've successfully completed the quiz!"
              : 'Thanks for taking the quiz. Keep practicing!'}
          </p>
        )}

        {/* Score Display */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <div className={`font-bold text-4xl ${getScoreColor()}`}>
                {percentage}%
              </div>
              <p className="text-muted-foreground text-sm">Score</p>
            </div>
            <div className="text-center">
              <div className="font-bold text-2xl text-foreground">
                {score}/{totalPossible}
              </div>
              <p className="text-muted-foreground text-sm">Points</p>
            </div>
          </div>

          <Progress className="h-3" value={percentage} />
        </div>

        {/* Quick Stats */}
        <div className="mb-6 flex justify-center gap-6">
          <div className="text-center">
            <div className="font-semibold text-foreground">
              {answeredQuestions}
            </div>
            <p className="text-muted-foreground text-sm">Answered</p>
          </div>
          <div className="text-center">
            <div className="font-semibold text-foreground">
              {totalQuestions}
            </div>
            <p className="text-muted-foreground text-sm">Total Questions</p>
          </div>
        </div>

        {/* Pass/Fail Badge */}
        <Badge
          className="mx-auto w-fit text-sm"
          variant={getScoreBadgeVariant()}
        >
          {passed ? (
            <>
              <Award className="h-4 w-4" />
              Passed
            </>
          ) : (
            <>
              <TrendingUp className="h-4 w-4" />
              Needs Improvement
            </>
          )}
        </Badge>

        {/* Retake Button */}
        {allowRetake && onRetake && (
          <div className="mt-6">
            <Button className="gap-2" onClick={onRetake} variant="outline">
              <RotateCcw className="h-4 w-4" />
              Retake Quiz
            </Button>
          </div>
        )}
      </Card>

      {/* Detailed Results */}
      {showDetailedResults && fieldResults.length > 0 && (
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground text-lg">
              Question by Question Results
            </h3>
          </div>

          <div className="space-y-4">
            {fieldResults.map((fieldResult, index) => (
              <div key={fieldResult.fieldId}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="font-medium text-foreground text-sm">
                        Question {index + 1}: {fieldResult.fieldLabel}
                      </span>
                      {fieldResult.isCorrect ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex gap-4">
                        <span className="text-muted-foreground">
                          Your answer:
                        </span>
                        <span
                          className={
                            fieldResult.isCorrect
                              ? 'text-green-600'
                              : 'text-red-600'
                          }
                        >
                          {Array.isArray(fieldResult.userAnswer)
                            ? fieldResult.userAnswer.join(', ')
                            : fieldResult.userAnswer || 'No answer'}
                        </span>
                      </div>

                      {!fieldResult.isCorrect && (
                        <div className="flex gap-4">
                          <span className="text-muted-foreground">
                            Correct answer:
                          </span>
                          <span className="text-green-600">
                            {Array.isArray(fieldResult.correctAnswer)
                              ? fieldResult.correctAnswer.join(', ')
                              : fieldResult.correctAnswer}
                          </span>
                        </div>
                      )}

                      {fieldResult.explanation && (
                        <div className="rounded-lg bg-blue-50 p-3">
                          <div className="flex gap-2">
                            <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                            <p className="text-blue-800 text-sm">
                              {fieldResult.explanation}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold text-sm">
                      {fieldResult.points}/{fieldResult.maxPoints}
                    </div>
                    <div className="text-muted-foreground text-xs">points</div>
                  </div>
                </div>

                {index < fieldResults.length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
