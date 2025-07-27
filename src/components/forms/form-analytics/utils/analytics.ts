// Type imports
import type { Form, FormSubmission } from '@/lib/database';
import type {
  ConversionFunnelStep,
  FieldAnalytics,
  FilterState,
} from '../types';

// Utility functions
export const generateSessionId = () =>
  `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const getFieldLabel = (form: Form, fieldId: string) => {
  let field = form.schema.fields?.find((f) => f.id === fieldId);
  if (!field && form.schema.blocks) {
    for (const block of form.schema.blocks) {
      field = block.fields?.find((f) => f.id === fieldId);
      if (field) break;
    }
  }
  return field?.label || fieldId;
};

export const getTotalFields = (form: Form) => {
  const fieldsFromDirectArray = form.schema.fields?.length || 0;
  const fieldsFromBlocks =
    form.schema.blocks?.reduce(
      (total, block) => total + (block.fields?.length || 0),
      0
    ) || 0;
  return Math.max(fieldsFromDirectArray, fieldsFromBlocks);
};

export const getSubmissionCompletionRate = (
  submission: FormSubmission,
  totalFields: number
) => {
  if (totalFields === 0) return 0;
  const filledFields = Object.values(submission.submission_data).filter(
    (val) => val !== '' && val !== null && val !== undefined
  ).length;
  return (filledFields / totalFields) * 100;
};

export const filterSubmissions = (
  submissions: FormSubmission[],
  searchTerm: string,
  filterState: FilterState,
  totalFields: number
) => {
  return submissions.filter((submission) => {
    if (searchTerm) {
      const searchString = JSON.stringify(submission).toLowerCase();
      if (!searchString.includes(searchTerm.toLowerCase())) return false;
    }

    const submissionDate = new Date(submission.submitted_at);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (filterState.timeRange !== 'all') {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);

      switch (filterState.timeRange) {
        case 'today':
          if (submissionDate < today) return false;
          break;
        case 'week':
          startDate.setDate(startDate.getDate() - 7);
          if (submissionDate < startDate) return false;
          break;
        case 'month':
          startDate.setMonth(startDate.getMonth() - 1);
          if (submissionDate < startDate) return false;
          break;
      }
    }

    if (filterState.completionRate !== 'all') {
      const completionRate = getSubmissionCompletionRate(
        submission,
        totalFields
      );
      switch (filterState.completionRate) {
        case 'complete':
          if (completionRate < 100) return false;
          break;
        case 'partial':
          if (completionRate < 1 || completionRate === 100) return false;
          break;
        case 'empty':
          if (completionRate > 0) return false;
          break;
      }
    }

    return true;
  });
};

export const calculateFieldAnalytics = (
  form: Form,
  submissions: FormSubmission[]
): Record<string, FieldAnalytics> => {
  const analytics: Record<string, FieldAnalytics> = {};
  const allPossibleFields = [
    ...(form.schema.fields || []),
    ...(form.schema.blocks?.flatMap((block) => block.fields || []) || []),
  ];

  allPossibleFields.forEach((field) => {
    const responses = submissions
      .map((sub) => sub.submission_data[field.id])
      .filter((val) => val !== '' && val !== null && val !== undefined);

    const valueFrequency: Record<string, number> = {};
    let totalLength = 0;

    responses.forEach((response) => {
      const stringValue = Array.isArray(response)
        ? response.join(', ')
        : String(response);
      valueFrequency[stringValue] = (valueFrequency[stringValue] || 0) + 1;
      totalLength += stringValue.length;
    });

    const mostCommon = Object.entries(valueFrequency).sort(
      ([, a], [, b]) => b - a
    )[0];

    analytics[field.id] = {
      label: field.label,
      totalResponses: responses.length,
      completionRate:
        submissions.length > 0
          ? Math.round((responses.length / submissions.length) * 100)
          : 0,
      uniqueValues: Object.keys(valueFrequency).length,
      mostCommonValue: mostCommon ? mostCommon[0] : null,
      averageLength:
        responses.length > 0 ? Math.round(totalLength / responses.length) : 0,
    };
  });

  return analytics;
};

export const calculateSubmissionTrends = (
  submissions: FormSubmission[]
): Record<string, number> => {
  const trends: Record<string, number> = {};
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateKey = date.toLocaleDateString();
    trends[dateKey] = 0;
  }

  submissions.forEach((sub) => {
    const subDate = new Date(sub.submitted_at);
    if (subDate >= last7Days) {
      const dateKey = subDate.toLocaleDateString();
      if (trends[dateKey] !== undefined) {
        trends[dateKey]++;
      }
    }
  });

  return trends;
};

export const calculateHourlySubmissions = (
  submissions: FormSubmission[]
): Record<number, number> => {
  const hours: Record<number, number> = {};

  for (let i = 0; i < 24; i++) {
    hours[i] = 0;
  }

  submissions.forEach((sub) => {
    const hour = new Date(sub.submitted_at).getHours();
    hours[hour]++;
  });

  return hours;
};

export const calculateBounceRate = (submissions: FormSubmission[]): number => {
  if (submissions.length === 0) return 0;

  const bouncedSubmissions = submissions.filter((sub) => {
    const filledFields = Object.values(sub.submission_data).filter(
      (val) => val !== '' && val !== null && val !== undefined
    ).length;
    return filledFields <= 1;
  });

  return Math.round((bouncedSubmissions.length / submissions.length) * 100);
};

export const calculateConversionFunnel = (
  form: Form,
  submissions: FormSubmission[]
): ConversionFunnelStep[] | null => {
  if (!(form.schema.settings?.multiStep && form.schema.blocks)) return null;

  const funnel = form.schema.blocks.map((block) => {
    const blockFieldIds = block.fields?.map((f) => f.id) || [];
    const completedCount = submissions.filter((sub) => {
      return blockFieldIds.some((fieldId) => {
        const value = sub.submission_data[fieldId];
        return value !== '' && value !== null && value !== undefined;
      });
    }).length;

    return {
      stepName: block.title,
      completedCount,
      conversionRate:
        submissions.length > 0
          ? Math.round((completedCount / submissions.length) * 100)
          : 0,
    };
    (' 12q ');
  });

  return funnel;
};

export const getActiveFilters = (
  searchTerm: string,
  filterState: FilterState
): string[] => {
  const filters: string[] = [];

  if (searchTerm) {
    filters.push(`Search: "${searchTerm}"`);
  }

  if (filterState.timeRange !== 'all') {
    const ranges = {
      today: 'Today',
      week: 'Last 7 Days',
      month: 'Last 30 Days',
    };
    filters.push(`Time: ${ranges[filterState.timeRange]}`);
  }

  if (filterState.completionRate !== 'all') {
    const rates = {
      complete: 'Complete',
      partial: 'Partial',
      empty: 'Empty',
    };
    filters.push(`Completion: ${rates[filterState.completionRate]}`);
  }

  return filters;
};
