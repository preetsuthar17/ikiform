# Quiz and Scoring System

This module provides a comprehensive quiz and scoring functionality for forms, allowing you to create interactive quizzes with radio fields, automatic scoring, and detailed results presentation.

## Features

- ✅ **Radio Field Quiz Questions**: Convert any radio field into a quiz question with correct answers
- ✅ **Flexible Scoring System**: Assign custom points to each question
- ✅ **Real-time Progress Tracking**: Show progress for both single-step and multi-step forms
- ✅ **Time Limits**: Optional countdown timers for quiz completion
- ✅ **Instant Feedback**: Show correct/incorrect answers with explanations
- ✅ **Pass/Fail Logic**: Configurable passing scores with custom messages
- ✅ **Quiz Analytics**: Detailed performance statistics for form creators
- ✅ **Retake Functionality**: Allow users to retake quizzes to improve scores
- ✅ **Multi-step Support**: Works seamlessly with single-step and multi-step forms

## Quick Start

### 1. Enable Quiz Mode in Form Settings

```tsx
import { QuizSection } from "@/components/form-builder/form-settings-modal/components/QuizSection";

// In your form settings modal
<QuizSection localSettings={localSettings} updateSettings={updateSettings} />;
```

### 2. Configure Radio Fields as Quiz Questions

In the field settings panel, any radio field can be converted to a quiz question:

- ✅ Enable "Quiz Question" toggle
- ✅ Select the correct answer from available options
- ✅ Set point value for the question
- ✅ Add optional explanation text
- ✅ Choose whether to show correct answers

### 3. Use the Quiz Form Renderer

```tsx
import { QuizFormRenderer } from "@/components/quiz";

<QuizFormRenderer
  schema={formSchema}
  fields={formFields}
  values={formValues}
  errors={formErrors}
  onChange={handleFieldChange}
  onSubmit={handleFormSubmit}
  currentStep={currentStep}
  totalSteps={totalSteps}
/>;
```

### 4. Display Quiz Results

```tsx
import { QuizResults, QuizScoreDisplay } from '@/components/quiz';

// For full results page
<QuizResults
  result={quizResult}
  showDetailedResults={true}
  allowRetake={true}
  onRetake={handleRetake}
  customMessage="Great job completing the quiz!"
/>

// For compact score display
<QuizScoreDisplay
  result={quizResult}
  isVisible={true}
  className="my-4"
/>
```

### 5. Quiz Analytics for Form Creators

```tsx
import { QuizAnalytics } from "@/components/quiz";

<QuizAnalytics
  schema={formSchema}
  submissions={formSubmissions}
  className="mt-6"
/>;
```

## Quiz State Management

Use the `useQuizState` hook for complete quiz state management:

```tsx
import { useQuizState } from "@/hooks/quiz";

function MyQuizForm({ schema, submissionData }) {
  const { quizState, submitQuiz, resetQuiz } = useQuizState(
    schema,
    submissionData
  );

  console.log({
    isQuizMode: quizState.isQuizMode,
    currentScore: quizState.currentScore,
    totalPossible: quizState.totalPossible,
    timeRemaining: quizState.timeRemaining,
    isSubmitted: quizState.isSubmitted,
    result: quizState.result,
  });

  const handleSubmit = () => {
    const result = submitQuiz();
    console.log("Quiz completed:", result);
  };

  const handleReset = () => {
    resetQuiz();
  };
}
```

## Configuration Options

### Form-level Quiz Settings

```typescript
interface QuizSettings {
  enabled: boolean;
  passingScore: number;
  showScore: boolean;
  showCorrectAnswers: boolean;
  allowRetake: boolean;
  timeLimit?: number;
  resultMessage?: {
    pass?: string;
    fail?: string;
  };
}
```

### Field-level Quiz Settings

```typescript
interface QuizFieldSettings {
  isQuizField: boolean;
  correctAnswer: string;
  points: number;
  showCorrectAnswer: boolean;
  explanation?: string;
}
```

## Multi-step Form Integration

For multi-step forms, the quiz system automatically tracks progress across steps:

```tsx
import { MultiStepQuizProgress } from "@/components/quiz";

<MultiStepQuizProgress
  steps={[
    {
      id: "step1",
      title: "Basic Info",
      isCompleted: true,
      hasQuizQuestions: false,
    },
    {
      id: "step2",
      title: "Quiz Section",
      isCompleted: false,
      hasQuizQuestions: true,
      score: 8,
      totalPoints: 10,
    },
  ]}
  currentStepIndex={1}
/>;
```

## Scoring Logic

The scoring system provides flexible calculation:

```typescript
import {
  calculateQuizScore,
  generateQuizResultMessage,
} from "@/lib/quiz/scoring";

// Calculate score for a submission
const result = calculateQuizScore(formSchema, submissionData);

// Generate custom result message
const message = generateQuizResultMessage(result, formSchema);

console.log({
  score: result.score,
  totalPossible: result.totalPossible,
  percentage: result.percentage,
  passed: result.passed,
  fieldResults: result.fieldResults,
});
```

## Analytics and Insights

Get detailed analytics for quiz performance:

```typescript
import { getQuizStatistics } from "@/lib/quiz/scoring";

const stats = getQuizStatistics(formSchema, submissions);

console.log({
  averageScore: stats.averageScore,
  passRate: stats.passRate,
  totalAttempts: stats.totalAttempts,
  questionStats: stats.questionStats,
});
```

## Best Practices

1. **Question Design**: Make sure questions are clear and have unambiguous correct answers
2. **Point Distribution**: Consider weighting more difficult questions with higher points
3. **Time Limits**: Set reasonable time limits that don't pressure users unnecessarily
4. **Feedback**: Provide helpful explanations for incorrect answers
5. **Pass/Fail Threshold**: Set appropriate passing scores based on your quiz's purpose
6. **Analytics**: Regularly review question performance to identify areas for improvement

## API Integration

The quiz system integrates seamlessly with the existing form submission API. Quiz results are automatically calculated and can be stored alongside regular form submissions.

## Accessibility

All quiz components are built with accessibility in mind:

- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader compatible
- Color contrast compliance
- Focus management during transitions

## Browser Support

The quiz system supports all modern browsers and is optimized for:

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+
