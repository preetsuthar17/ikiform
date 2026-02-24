import Link from "next/link";
import { useTranslations } from "next-intl";
import type React from "react";
import { QuizResults } from "@/components/quiz/results/quiz-results";
import { Card } from "@/components/ui/card";

import type { FormSchema } from "@/lib/database";
import type { QuizResult } from "@/lib/quiz/scoring";

interface SingleStepSuccessScreenProps {
	schema: FormSchema;
	quizResults?: QuizResult | null;
}

export const SingleStepSuccessScreen: React.FC<
	SingleStepSuccessScreenProps
> = ({ schema, quizResults }) => {
	const t = useTranslations("product.formBuilder.formRenderer.successScreen");
	const shouldShowQuizResults =
		schema.settings.quiz?.enabled &&
		(schema.settings.quiz?.showScore !== false ||
			schema.settings.quiz?.showCorrectAnswers !== false) &&
		quizResults;

	return (
		<div className="flex min-h-screen items-center justify-center bg-background">
			<div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
				{shouldShowQuizResults ? (
					<QuizResults
						allowRetake={false}
						result={quizResults}
						showDetailedResults={
							schema.settings.quiz?.showCorrectAnswers !== false
						}
					/>
				) : (
					<Card
						className="flex w-full grow flex-col gap-6 border p-8 shadow-none"
						style={{ border: "1px solid hsl(var(--border))" }}
					>
						<div className="flex flex-col items-center gap-4">
							<div className="flex size-16 items-center justify-center rounded-2xl bg-accent">
								<svg
									className="size-8 text-accent-foreground"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										d="M5 13l4 4L19 7"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
									/>
								</svg>
							</div>
							<h2 className="font-bold text-2xl text-foreground">
								{t("title")}
							</h2>
							<p className="text-center text-muted-foreground">
								{schema.settings.successMessage ||
									t("defaultMessage")}
							</p>
							{schema.settings.redirectUrl && (
								<p className="text-muted-foreground text-sm">
									{t("redirecting")}
								</p>
							)}
						</div>
					</Card>
				)}

				<div className="text-center">
					{Boolean(
						schema.settings.branding &&
							(schema.settings.branding as any).showIkiformBranding !== false
					) && (
						<p className="text-muted-foreground text-sm">
							{t("poweredBy")}{" "}
							<span className="font-medium text-foreground underline">
								<Link href="https://www.ikiform.com">Ikiform</Link>
							</span>
						</p>
					)}
				</div>
			</div>
		</div>
	);
};
