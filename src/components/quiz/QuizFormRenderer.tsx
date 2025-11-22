import { useCallback, useEffect } from "react";
import { FormFieldRenderer } from "@/components/form-builder/form-field-renderer";
import { QuizProgress } from "@/components/quiz/QuizProgress";
import { QuizResults } from "@/components/quiz/QuizResults";
import { QuizScoreDisplay } from "@/components/quiz/QuizScoreDisplay";
import { useQuizState } from "@/hooks/quiz/use-quiz-state";
import type { FormField, FormSchema } from "@/lib/database";

interface QuizFormRendererProps {
	schema: FormSchema;
	fields: FormField[];
	values: Record<string, any>;
	errors: Record<string, string>;
	onChange: (fieldId: string, value: any) => void;
	onSubmit?: () => void;
	disabled?: boolean;
	currentStep?: number;
	totalSteps?: number;
}

export function QuizFormRenderer({
	schema,
	fields,
	values,
	errors,
	onChange,
	onSubmit,
	disabled = false,
	currentStep = 1,
	totalSteps = 1,
}: QuizFormRendererProps) {
	const { quizState, submitQuiz, resetQuiz } = useQuizState(schema, values);

	useEffect(() => {
		if (quizState.timeRemaining === 0 && !quizState.isSubmitted) {
			submitQuiz();
			onSubmit?.();
		}
	}, [quizState.timeRemaining, quizState.isSubmitted, submitQuiz, onSubmit]);

	const handleRetakeQuiz = useCallback(() => {
		resetQuiz();

		Object.keys(values).forEach((fieldId) => {
			onChange(fieldId, "");
		});
	}, [resetQuiz, values, onChange]);

	const getCurrentQuestionNumber = () => {
		if (!quizState.isQuizMode) return currentStep;

		const quizFields = fields.filter((field) => field.settings?.isQuizField);
		const currentFieldIndex = quizFields.findIndex(
			(field) => field.id in errors || !values[field.id],
		);

		return currentFieldIndex >= 0 ? currentFieldIndex + 1 : quizFields.length;
	};

	if (
		quizState.isSubmitted &&
		quizState.result &&
		schema.settings?.quiz?.showScore
	) {
		const showDetailedResults =
			schema.settings?.quiz?.showCorrectAnswers !== false;
		const allowRetake = schema.settings?.quiz?.allowRetake;

		return (
			<div className="flex flex-col gap-6">
				<QuizResults
					allowRetake={allowRetake}
					customMessage={quizState.resultMessage}
					onRetake={allowRetake ? handleRetakeQuiz : undefined}
					result={quizState.result}
					showDetailedResults={showDetailedResults}
				/>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			{}
			{quizState.isQuizMode && (
				<QuizProgress
					answeredQuestions={quizState.answeredQuestions}
					currentQuestion={getCurrentQuestionNumber()}
					timeRemaining={quizState.timeRemaining}
					totalQuestions={quizState.totalQuestions}
				/>
			)}

			{}
			{quizState.isQuizMode &&
				schema.settings?.quiz?.showScore &&
				!quizState.isSubmitted &&
				quizState.answeredQuestions > 0 && (
					<QuizScoreDisplay
						className="border-blue-200 bg-blue-50"
						result={{
							score: quizState.currentScore,
							totalPossible: quizState.totalPossible,
							percentage:
								quizState.totalPossible > 0
									? Math.round(
											(quizState.currentScore / quizState.totalPossible) * 100,
										)
									: 0,
							passed: false,
							answeredQuestions: quizState.answeredQuestions,
							totalQuestions: quizState.totalQuestions,
							fieldResults: [],
						}}
					/>
				)}

			{}
			<div className="flex flex-col gap-4">
				{fields.map((field) => (
					<FormFieldRenderer
						disabled={disabled || quizState.isSubmitted}
						error={errors[field.id]}
						field={field}
						key={field.id}
						onChange={(value) => onChange(field.id, value)}
						value={values[field.id]}
					/>
				))}
			</div>

			{}
			{quizState.isQuizMode &&
				quizState.timeRemaining !== undefined &&
				quizState.timeRemaining < 300 &&
				quizState.timeRemaining > 0 && (
					<div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
						<div className="flex items-center">
							<div className="text-yellow-800">
								<strong>Time Warning:</strong> Only{" "}
								{Math.floor(quizState.timeRemaining / 60)} minutes and{" "}
								{quizState.timeRemaining % 60} seconds remaining!
							</div>
						</div>
					</div>
				)}
		</div>
	);
}
