import { CheckCircle, Target, TrendingUp, Trophy } from "lucide-react";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import type { QuizResult } from "@/lib/quiz/scoring";

interface QuizScoreDisplayProps {
  result: QuizResult;
  isVisible?: boolean;
  className?: string;
}

export function QuizScoreDisplay({
  result,
  isVisible = true,
  className = "",
}: QuizScoreDisplayProps) {
  if (!isVisible) return null;

  const {
    score,
    totalPossible,
    percentage,
    passed,
    answeredQuestions,
    totalQuestions,
  } = result;

  const getScoreColor = () => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 70) return "text-blue-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressColor = () => {
    if (percentage >= 90) return "bg-green-500";
    if (percentage >= 70) return "bg-blue-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="mb-4 flex items-center gap-3">
        {passed ? (
          <Trophy className="size-6 text-yellow-500" />
        ) : (
          <Target className="size-6 text-blue-500" />
        )}
        <div>
          <h3 className="font-semibold text-lg">
            {passed ? "Quiz Passed!" : "Quiz Complete"}
          </h3>
          <p className="text-muted-foreground text-sm">
            Your performance summary
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Score Section */}
        <div className="flex flex-col gap-2 text-center">
          <div className={`font-bold text-3xl ${getScoreColor()}`}>
            {percentage}%
          </div>
          <div className="text-muted-foreground text-sm">
            {score} out of {totalPossible} points
          </div>
          <Progress
            className="h-3"
            style={
              {
                "--progress-color": getProgressColor(),
              } as React.CSSProperties
            }
            value={percentage}
          />
        </div>

        <Separator />

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="font-semibold text-lg">{answeredQuestions}</div>
            <div className="text-muted-foreground text-xs">Answered</div>
          </div>
          <div>
            <div className="font-semibold text-lg">{totalQuestions}</div>
            <div className="text-muted-foreground text-xs">Total</div>
          </div>
          <div>
            <div className="font-semibold text-lg">
              {answeredQuestions === totalQuestions ? (
                <CheckCircle className="mx-auto size-5 text-green-500" />
              ) : (
                `${Math.round((answeredQuestions / totalQuestions) * 100)}%`
              )}
            </div>
            <div className="text-muted-foreground text-xs">Complete</div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex justify-center">
          <Badge className="text-sm" variant={passed ? "default" : "secondary"}>
            {passed ? (
              <>
                <Trophy className="mr-2 size-3" />
                Passed
              </>
            ) : (
              <>
                <TrendingUp className="mr-2 size-3" />
                Needs Improvement
              </>
            )}
          </Badge>
        </div>
      </div>
    </Card>
  );
}
