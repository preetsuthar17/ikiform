import {
  Award,
  CheckCircle,
  Target,
  TrendingUp,
  Trophy,
  Users,
} from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { QuizAnalytics } from '../types';

interface QuizAnalyticsCardProps {
  quizAnalytics: QuizAnalytics;
}

export function QuizAnalyticsCard({ quizAnalytics }: QuizAnalyticsCardProps) {
  if (!quizAnalytics.isQuizForm) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Quiz Overview Stats */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
            <Trophy className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Quiz Submissions</p>
            <p className="font-semibold text-2xl">
              {quizAnalytics.totalQuizSubmissions}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
            <Target className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Average Score</p>
            <p className="font-semibold text-2xl">
              {quizAnalytics.averagePercentage.toFixed(1)}%
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
            <CheckCircle className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Pass Rate</p>
            <p className="font-semibold text-2xl">
              {quizAnalytics.passRate.toFixed(1)}%
            </p>
          </div>
        </div>
      </Card>

      {/* Top Performers */}
      {quizAnalytics.topPerformers.length > 0 && (
        <Card className="p-4 md:col-span-2 lg:col-span-3">
          <div className="mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-600" />
            <h3 className="font-semibold">Top Performers</h3>
          </div>
          <div className="flex flex-col gap-3">
            {quizAnalytics.topPerformers.map((performer, index) => (
              <div
                className="flex items-center justify-between rounded-lg bg-muted/30 p-3"
                key={performer.submissionId}
              >
                <div className="flex items-center gap-3">
                  <Badge variant={index === 0 ? 'default' : 'secondary'}>
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
        </Card>
      )}

      {/* Question Analytics */}
      {quizAnalytics.questionAnalytics.length > 0 && (
        <Card className="p-4 md:col-span-2 lg:col-span-3">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">Question Performance</h3>
          </div>
          <div className="flex flex-col gap-4">
            {quizAnalytics.questionAnalytics.map((question) => (
              <div className="flex flex-col gap-2" key={question.fieldId}>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{question.label}</span>
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
        </Card>
      )}
    </div>
  );
}
