import { Award, CheckCircle, Target, TrendingUp, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { QuizAnalytics } from "../types";

interface QuizAnalyticsCardProps {
  quizAnalytics: QuizAnalytics;
}

export function QuizAnalyticsCard({ quizAnalytics }: QuizAnalyticsCardProps) {
  if (!quizAnalytics.isQuizForm) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {}
      <Card className="h-fit grow gap-4 border-border bg-card p-4 shadow-none md:p-6">
        <CardHeader className="flex flex-row items-center gap-4 p-0">
          <div aria-hidden="true" className="rounded-md bg-blue-500/10 p-3">
            <Trophy className="size-6 text-blue-600" />
          </div>
          <CardTitle className="font-medium text-base text-muted-foreground">
            Quiz Submissions
          </CardTitle>
        </CardHeader>
        <CardContent className="px-1 py-0">
          <p className="font-bold text-2xl text-foreground tabular-nums">
            {quizAnalytics.totalQuizSubmissions.toLocaleString()}
          </p>
        </CardContent>
      </Card>

      <Card className="h-fit grow gap-4 border-border bg-card p-4 shadow-none md:p-6">
        <CardHeader className="flex flex-row items-center gap-4 p-0">
          <div aria-hidden="true" className="rounded-md bg-green-500/10 p-3">
            <Target className="size-6 text-green-600" />
          </div>
          <CardTitle className="font-medium text-base text-muted-foreground">
            Average Score
          </CardTitle>
        </CardHeader>
        <CardContent className="px-1 py-0">
          <p className="font-bold text-2xl text-foreground tabular-nums">
            {quizAnalytics.averagePercentage.toFixed(1)}%
          </p>
        </CardContent>
      </Card>

      <Card className="h-fit grow gap-4 border-border bg-card p-4 shadow-none md:p-6">
        <CardHeader className="flex flex-row items-center gap-4 p-0">
          <div aria-hidden="true" className="rounded-md bg-purple-500/10 p-3">
            <CheckCircle className="size-6 text-purple-600" />
          </div>
          <CardTitle className="font-medium text-base text-muted-foreground">
            Pass Rate
          </CardTitle>
        </CardHeader>
        <CardContent className="px-1 py-0">
          <p className="font-bold text-2xl text-foreground tabular-nums">
            {quizAnalytics.passRate.toFixed(1)}%
          </p>
        </CardContent>
      </Card>

      <Card className="h-fit grow gap-4 border-border bg-card p-4 shadow-none md:p-6">
        <CardHeader className="flex flex-row items-center gap-4 p-0">
          <div aria-hidden="true" className="rounded-md bg-orange-500/10 p-3">
            <Award className="size-6 text-orange-600" />
          </div>
          <CardTitle className="font-medium text-base text-muted-foreground">
            Top Score
          </CardTitle>
        </CardHeader>
        <CardContent className="px-1 py-0">
          <p className="font-bold text-2xl text-foreground tabular-nums">
            {quizAnalytics.topPerformers.length > 0
              ? `${quizAnalytics.topPerformers[0].percentage.toFixed(1)}%`
              : "N/A"}
          </p>
        </CardContent>
      </Card>

      {}
      {quizAnalytics.topPerformers.length > 0 && (
        <Card className="grow gap-4 border-border bg-card p-4 shadow-none md:col-span-2 lg:col-span-4">
          <CardHeader className="flex flex-row items-center gap-4 p-0">
            <div aria-hidden="true" className="rounded-md bg-yellow-500/10 p-3">
              <Award className="size-6 text-yellow-600" />
            </div>
            <CardTitle className="font-medium text-base text-muted-foreground">
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent className="px-1 py-0">
            <div className="flex flex-col gap-3">
              {quizAnalytics.topPerformers.map((performer, index) => (
                <div
                  className="flex items-center justify-between rounded-lg bg-muted/30 p-3"
                  key={performer.submissionId}
                >
                  <div className="flex items-center gap-3">
                    <Badge variant={index === 0 ? "default" : "secondary"}>
                      #{index + 1}
                    </Badge>
                    <span className="font-medium text-sm">
                      Submission {performer.submissionId.slice(-8)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">
                      {performer.percentage.toFixed(1)}%
                    </span>
                    <span className="text-muted-foreground text-sm">
                      ({performer.score} points)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {}
      {quizAnalytics.questionAnalytics.length > 0 && (
        <Card className="grow gap-4 border-border bg-card p-4 shadow-none md:col-span-2 lg:col-span-4">
          <CardHeader className="flex flex-row items-center gap-4 p-0">
            <div aria-hidden="true" className="rounded-md bg-blue-500/10 p-3">
              <TrendingUp className="size-6 text-blue-600" />
            </div>
            <CardTitle className="font-medium text-base text-muted-foreground">
              Question Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="px-1 py-0">
            <div className="flex flex-col gap-4">
              {quizAnalytics.questionAnalytics.map((question) => (
                <div className="flex flex-col gap-2" key={question.fieldId}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">
                      {question.label}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {question.correctAnswers}/{question.totalAnswers} correct
                    </span>
                  </div>
                  <Progress className="h-2" value={question.accuracyRate} />
                  <div className="flex justify-between text-muted-foreground text-xs">
                    <span>{question.accuracyRate.toFixed(1)}% accuracy</span>
                    <span>{question.totalAnswers} responses</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
