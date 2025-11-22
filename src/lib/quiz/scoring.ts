import type { FormField, FormSchema, FormSubmission } from "@/lib/database";

export interface QuizResult {
	score: number;
	totalPossible: number;
	percentage: number;
	passed: boolean;
	answeredQuestions: number;
	totalQuestions: number;
	fieldResults: QuizFieldResult[];
}

export interface QuizFieldResult {
	fieldId: string;
	fieldLabel: string;
	userAnswer: string | string[];
	correctAnswer: string | string[];
	isCorrect: boolean;
	points: number;
	maxPoints: number;
	explanation?: string;
}

export function calculateQuizScore(
	schema: FormSchema,
	submissionData: Record<string, any>,
): QuizResult {
	const allFields = getAllFields(schema);
	const quizFields = allFields.filter((field) => field.settings?.isQuizField);

	if (quizFields.length === 0) {
		return {
			score: 0,
			totalPossible: 0,
			percentage: 0,
			passed: true,
			answeredQuestions: 0,
			totalQuestions: 0,
			fieldResults: [],
		};
	}

	let totalScore = 0;
	let totalPossible = 0;
	let answeredQuestions = 0;
	const fieldResults: QuizFieldResult[] = [];

	for (const field of quizFields) {
		const userAnswer = submissionData[field.id];
		const correctAnswer = field.settings?.correctAnswer;
		const points = field.settings?.points || 1;
		const explanation = field.settings?.explanation;

		totalPossible += points;

		const isAnswered =
			userAnswer !== undefined && userAnswer !== null && userAnswer !== "";
		if (isAnswered) {
			answeredQuestions++;
		}

		const isCorrect =
			isAnswered &&
			correctAnswer !== undefined &&
			isAnswerCorrect(userAnswer, correctAnswer);

		if (isCorrect) {
			totalScore += points;
		}

		fieldResults.push({
			fieldId: field.id,
			fieldLabel: field.label,
			userAnswer: userAnswer || "",
			correctAnswer: correctAnswer || "",
			isCorrect,
			points: isCorrect ? points : 0,
			maxPoints: points,
			explanation,
		});
	}

	const percentage =
		totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;
	const passingScore = schema.settings.quiz?.passingScore || 70;
	const passed = percentage >= passingScore;

	return {
		score: totalScore,
		totalPossible,
		percentage,
		passed,
		answeredQuestions,
		totalQuestions: quizFields.length,
		fieldResults,
	};
}

function isAnswerCorrect(
	userAnswer: any,
	correctAnswer: string | string[],
): boolean {
	if (typeof correctAnswer === "string") {
		return (
			String(userAnswer).toLowerCase().trim() ===
			correctAnswer.toLowerCase().trim()
		);
	}

	if (Array.isArray(correctAnswer)) {
		if (!Array.isArray(userAnswer)) {
			return false;
		}

		if (userAnswer.length !== correctAnswer.length) {
			return false;
		}

		const normalizedUser = userAnswer
			.map((ans) => String(ans).toLowerCase().trim())
			.sort();
		const normalizedCorrect = correctAnswer
			.map((ans) => String(ans).toLowerCase().trim())
			.sort();

		return normalizedUser.every(
			(ans, index) => ans === normalizedCorrect[index],
		);
	}

	return false;
}

function getAllFields(schema: FormSchema): FormField[] {
	const fieldsFromBlocks =
		schema.blocks?.flatMap((block) => block.fields || []) || [];
	const fieldsFromArray = schema.fields || [];

	if (fieldsFromBlocks.length > 0) {
		return fieldsFromBlocks;
	}

	return fieldsFromArray;
}

export function generateQuizResultMessage(
	result: QuizResult,
	schema: FormSchema,
): string {
	const { passed, percentage, score, totalPossible } = result;
	const quizSettings = schema.settings.quiz;

	if (passed && quizSettings?.resultMessage?.pass) {
		return quizSettings.resultMessage.pass
			.replace("{score}", String(score))
			.replace("{percentage}", String(percentage))
			.replace("{total}", String(totalPossible));
	}

	if (!passed && quizSettings?.resultMessage?.fail) {
		return quizSettings.resultMessage.fail
			.replace("{score}", String(score))
			.replace("{percentage}", String(percentage))
			.replace("{total}", String(totalPossible));
	}

	if (passed) {
		return `Congratulations! You passed with ${percentage}% (${score}/${totalPossible} points).`;
	}
	const passingScore = quizSettings?.passingScore || 70;
	return `You scored ${percentage}% (${score}/${totalPossible} points). You need ${passingScore}% to pass.`;
}

export function isQuizForm(schema: FormSchema): boolean {
	return Boolean(schema.settings.quiz?.enabled);
}

export function getQuizStatistics(
	schema: FormSchema,
	submissions: FormSubmission[],
): {
	averageScore: number;
	passRate: number;
	totalAttempts: number;
	questionStats: Array<{
		fieldId: string;
		fieldLabel: string;
		correctRate: number;
		totalAnswers: number;
	}>;
} {
	if (!isQuizForm(schema) || submissions.length === 0) {
		return {
			averageScore: 0,
			passRate: 0,
			totalAttempts: 0,
			questionStats: [],
		};
	}

	let totalScore = 0;
	let passedCount = 0;
	const questionCorrectCounts: Record<
		string,
		{ correct: number; total: number; label: string }
	> = {};

	const allFields = getAllFields(schema);
	const quizFields = allFields.filter((field) => field.settings?.isQuizField);

	for (const field of quizFields) {
		questionCorrectCounts[field.id] = {
			correct: 0,
			total: 0,
			label: field.label,
		};
	}

	for (const submission of submissions) {
		const result = calculateQuizScore(schema, submission.submission_data);
		totalScore += result.percentage;

		if (result.passed) {
			passedCount++;
		}

		for (const fieldResult of result.fieldResults) {
			if (questionCorrectCounts[fieldResult.fieldId]) {
				questionCorrectCounts[fieldResult.fieldId].total++;
				if (fieldResult.isCorrect) {
					questionCorrectCounts[fieldResult.fieldId].correct++;
				}
			}
		}
	}

	const averageScore =
		submissions.length > 0 ? Math.round(totalScore / submissions.length) : 0;
	const passRate =
		submissions.length > 0
			? Math.round((passedCount / submissions.length) * 100)
			: 0;

	const questionStats = Object.entries(questionCorrectCounts).map(
		([fieldId, stats]) => ({
			fieldId,
			fieldLabel: stats.label,
			correctRate:
				stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
			totalAnswers: stats.total,
		}),
	);

	return {
		averageScore,
		passRate,
		totalAttempts: submissions.length,
		questionStats,
	};
}
