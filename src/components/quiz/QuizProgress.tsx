import { CheckCircle2, Clock, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  answeredQuestions: number;
  timeRemaining?: number;
  isVisible?: boolean;
  className?: string;
}

export function QuizProgress({
  currentQuestion,
  totalQuestions,
  answeredQuestions,
  timeRemaining,
  isVisible = true,
  className = "",
}: QuizProgressProps) {
  if (!isVisible || totalQuestions === 0) return null;

  const progressPercentage = (answeredQuestions / totalQuestions) * 100;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getTimeColor = () => {
    if (!timeRemaining) return "text-muted-foreground";
    if (timeRemaining < 300) return "text-red-500";
    if (timeRemaining < 600) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm">Quiz Progress</span>
          </div>
          {timeRemaining !== undefined && (
            <div
              className={`flex items-center gap-1 text-sm ${getTimeColor()}`}
            >
              <Clock className="h-3 w-3" />
              <span>{formatTime(timeRemaining)}</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Question {Math.min(currentQuestion, totalQuestions)} of{" "}
              {totalQuestions}
            </span>
            <span className="text-muted-foreground">
              {Math.round(progressPercentage)}% complete
            </span>
          </div>
          <Progress className="h-2" value={progressPercentage} />
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-muted-foreground text-sm">
                {answeredQuestions} answered
              </span>
            </div>
            <div className="flex items-center gap-1">
              <HelpCircle className="h-4 w-4 text-gray-400" />
              <span className="text-muted-foreground text-sm">
                {totalQuestions - answeredQuestions} remaining
              </span>
            </div>
          </div>

          <Badge className="text-xs" variant="outline">
            Quiz Mode
          </Badge>
        </div>
      </div>
    </Card>
  );
}
