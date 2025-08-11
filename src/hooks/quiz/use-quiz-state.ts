import { useCallback, useEffect, useState } from "react";
import type { FormSchema, FormSubmission } from "@/lib/database";
import {
  calculateQuizScore,
  generateQuizResultMessage,
  type QuizResult,
} from "@/lib/quiz/scoring";

export interface QuizState {
  isQuizMode: boolean;
  currentScore: number;
  totalPossible: number;
  answeredQuestions: number;
  totalQuestions: number;
  timeRemaining?: number;
  isSubmitted: boolean;
  result?: QuizResult;
  resultMessage?: string;
}

export function useQuizState(
  schema: FormSchema,
  submissionData: Record<string, any> = {},
) {
  const [quizState, setQuizState] = useState<QuizState>(() => {
    const isQuizMode = Boolean(schema.settings?.quiz?.enabled);
    const allFields = [
      ...(schema.fields || []),
      ...(schema.blocks?.flatMap((block) => block.fields || []) || []),
    ];
    const quizFields = allFields.filter((field) => field.settings?.isQuizField);

    return {
      isQuizMode,
      currentScore: 0,
      totalPossible: quizFields.reduce(
        (sum, field) => sum + (field.settings?.points || 1),
        0,
      ),
      answeredQuestions: 0,
      totalQuestions: quizFields.length,
      timeRemaining: schema.settings?.quiz?.timeLimit
        ? schema.settings.quiz.timeLimit * 60
        : undefined,
      isSubmitted: false,
    };
  });

  useEffect(() => {
    if (!quizState.isQuizMode) return;

    const result = calculateQuizScore(schema, submissionData);
    setQuizState((prev) => ({
      ...prev,
      currentScore: result.score,
      answeredQuestions: result.answeredQuestions,
    }));
  }, [submissionData, schema, quizState.isQuizMode]);

  useEffect(() => {
    if (
      !quizState.timeRemaining ||
      quizState.timeRemaining <= 0 ||
      quizState.isSubmitted
    ) {
      return;
    }

    const timer = setInterval(() => {
      setQuizState((prev) => {
        const newTimeRemaining = (prev.timeRemaining || 0) - 1;
        if (newTimeRemaining <= 0) {
          return {
            ...prev,
            timeRemaining: 0,
            isSubmitted: true,
          };
        }
        return {
          ...prev,
          timeRemaining: newTimeRemaining,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizState.timeRemaining, quizState.isSubmitted]);

  const submitQuiz = useCallback(() => {
    if (!quizState.isQuizMode) return;

    const result = calculateQuizScore(schema, submissionData);
    const resultMessage = generateQuizResultMessage(result, schema);

    setQuizState((prev) => ({
      ...prev,
      isSubmitted: true,
      result,
      resultMessage,
      timeRemaining: undefined,
    }));

    return result;
  }, [schema, submissionData, quizState.isQuizMode]);

  const resetQuiz = useCallback(() => {
    if (!quizState.isQuizMode) return;

    setQuizState((prev) => ({
      ...prev,
      currentScore: 0,
      answeredQuestions: 0,
      timeRemaining: schema.settings?.quiz?.timeLimit
        ? schema.settings.quiz.timeLimit * 60
        : undefined,
      isSubmitted: false,
      result: undefined,
      resultMessage: undefined,
    }));
  }, [schema.settings?.quiz?.timeLimit, quizState.isQuizMode]);

  return {
    quizState,
    submitQuiz,
    resetQuiz,
    updateQuizState: setQuizState,
  };
}
