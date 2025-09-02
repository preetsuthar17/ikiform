import { useMemo } from "react";

import type { Form, FormSubmission } from "@/lib/database";
import type { AnalyticsData } from "../types";

import {
  calculateBounceRate,
  calculateConversionFunnel,
  calculateFieldAnalytics,
  calculateHourlySubmissions,
  calculateQuizAnalytics,
  calculateSubmissionTrends,
  getTotalFields,
} from "../utils/analytics";

export const useAnalyticsData = (
  form: Form,
  submissions: FormSubmission[]
): AnalyticsData => {
  return useMemo(() => {
    const totalSubmissions = submissions.length;
    const lastSubmission = submissions.length > 0 ? submissions[0] : null;
    const totalFields = getTotalFields(form);

    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    const recentSubmissions = submissions.filter(
      (sub) => new Date(sub.submitted_at) >= last30Days
    );

    const fieldStats = submissions.reduce(
      (acc, sub) => {
        const filledFields = Object.values(sub.submission_data).filter(
          (val) => val !== "" && val !== null && val !== undefined
        ).length;
        acc.totalFilledFields += filledFields;
        acc.fieldCompletionRates[filledFields] =
          (acc.fieldCompletionRates[filledFields] || 0) + 1;
        return acc;
      },
      {
        totalFilledFields: 0,
        fieldCompletionRates: {} as Record<number, number>,
      }
    );

    const completionRate =
      submissions.length > 0 && totalFields > 0
        ? Math.round(
            (fieldStats.totalFilledFields /
              (submissions.length * totalFields)) *
              100
          )
        : 0;

    const submissionsByDay = submissions.reduce(
      (acc, sub) => {
        const date = new Date(sub.submitted_at).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const mostActiveDay = Object.entries(submissionsByDay).sort(
      ([, a], [, b]) => b - a
    )[0];

    const avgSubmissionsPerDay =
      submissions.length > 0
        ? Math.round(
            (submissions.length /
              Math.max(1, Object.keys(submissionsByDay).length)) *
              10
          ) / 10
        : 0;

    const fieldAnalytics = calculateFieldAnalytics(form, submissions);
    const submissionTrends = calculateSubmissionTrends(submissions);
    const hourlySubmissions = calculateHourlySubmissions(submissions);
    const bounceRate = calculateBounceRate(submissions);
    const conversionFunnel = calculateConversionFunnel(form, submissions);

    const peakHour = Object.entries(hourlySubmissions).sort(
      ([, a], [, b]) => b - a
    )[0];

    const topFields = Object.entries(fieldAnalytics)
      .sort(([, a], [, b]) => b.completionRate - a.completionRate)
      .slice(0, 5);

    const worstFields = Object.entries(fieldAnalytics)
      .sort(([, a], [, b]) => a.completionRate - b.completionRate)
      .slice(0, 3);

    const quizAnalytics = calculateQuizAnalytics(form, submissions);

    return {
      totalSubmissions,
      completionRate,
      recentSubmissions,
      mostActiveDay,
      lastSubmission,
      avgSubmissionsPerDay,
      bounceRate,
      peakHour,
      fieldAnalytics,
      topFields,
      worstFields,
      submissionTrends,
      conversionFunnel,
      hourlySubmissions,
      totalFields,
      quizAnalytics,
    };
  }, [form, submissions]);
};
