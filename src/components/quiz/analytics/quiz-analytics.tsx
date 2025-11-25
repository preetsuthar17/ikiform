import {
	AlertCircle,
	BarChart3,
	CheckCircle,
	Target,
	TrendingUp,
	Trophy,
	Users,
	XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { FormSchema, FormSubmission } from "@/lib/database";
import { getQuizStatistics } from "@/lib/quiz/scoring";

interface QuizAnalyticsProps {
	schema: FormSchema;
	submissions: FormSubmission[];
	className?: string;
}

export function QuizAnalytics({
	schema,
	submissions,
	className = "",
}: QuizAnalyticsProps) {
	const stats = getQuizStatistics(schema, submissions);

	if (!schema.settings?.quiz?.enabled) {
		return null;
	}

	return (
		<div className={`flex flex-col gap-6 ${className}`}>
			<div className="flex items-center gap-3">
				<Trophy className="size-6 text-yellow-500" />
				<h2 className="font-semibold text-xl">Quiz Analytics</h2>
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
				<Card className="p-4">
					<div className="flex items-center gap-3">
						<Users className="size-8 text-blue-500" />
						<div>
							<div className="font-semibold text-2xl">
								{stats.totalAttempts}
							</div>
							<div className="text-muted-foreground text-sm">
								Total Attempts
							</div>
						</div>
					</div>
				</Card>

				<Card className="p-4">
					<div className="flex items-center gap-3">
						<TrendingUp className="size-8 text-green-500" />
						<div>
							<div className="font-semibold text-2xl">
								{stats.averageScore}%
							</div>
							<div className="text-muted-foreground text-sm">Average Score</div>
						</div>
					</div>
				</Card>

				<Card className="p-4">
					<div className="flex items-center gap-3">
						<Target className="size-8 text-purple-500" />
						<div>
							<div className="font-semibold text-2xl">{stats.passRate}%</div>
							<div className="text-muted-foreground text-sm">Pass Rate</div>
						</div>
					</div>
				</Card>

				<Card className="p-4">
					<div className="flex items-center gap-3">
						<BarChart3 className="size-8 text-orange-500" />
						<div>
							<div className="font-semibold text-2xl">
								{schema.settings?.quiz?.passingScore || 70}%
							</div>
							<div className="text-muted-foreground text-sm">Passing Score</div>
						</div>
					</div>
				</Card>
			</div>

			{}
			{stats.questionStats.length > 0 && (
				<div className="flex flex-col gap-4">
					<div className="flex items-center gap-2">
						<CheckCircle className="size-5 text-green-500" />
						<h3 className="font-semibold text-lg">Question Performance</h3>
					</div>

					{}
					<Card className="bg-muted/30 p-4">
						<div className="flex items-center justify-between">
							<div className="text-muted-foreground text-sm">
								Analyzing {stats.questionStats.length} question
								{stats.questionStats.length !== 1 ? "s" : ""} across{" "}
								{stats.totalAttempts} attempt
								{stats.totalAttempts !== 1 ? "s" : ""}
							</div>
							<div className="flex items-center gap-4 text-xs">
								<div className="flex items-center gap-1">
									<div className="size-3 rounded-full bg-green-500" />
									<span>High accuracy (≥80%)</span>
								</div>
								<div className="flex items-center gap-1">
									<div className="size-3 rounded-full bg-yellow-500" />
									<span>Moderate (50-79%)</span>
								</div>
								<div className="flex items-center gap-1">
									<div className="size-3 rounded-full bg-red-500" />
									<span>Low (&lt;50%)</span>
								</div>
							</div>
						</div>
					</Card>

					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
						{stats.questionStats.map((questionStat, index) => (
							<Card className="p-4" key={questionStat.fieldId}>
								<div className="flex flex-col gap-3">
									{}
									<div>
										<div className="mb-2 flex items-start justify-between gap-2">
											<span className="inline-flex size-6 items-center justify-center rounded-full bg-primary/10 font-medium text-primary text-xs">
												{index + 1}
											</span>
											<Badge
												className="text-xs"
												variant={
													questionStat.correctRate >= 70
														? "default"
														: "destructive"
												}
											>
												{questionStat.correctRate.toFixed(1)}%
											</Badge>
										</div>
										<h4 className="mb-1 font-medium text-sm leading-tight">
											{questionStat.fieldLabel}
										</h4>
										<p className="text-muted-foreground text-xs">
											{questionStat.totalAnswers} response
											{questionStat.totalAnswers !== 1 ? "s" : ""}
										</p>
									</div>

									{}
									<div className="flex flex-col gap-2">
										<Progress
											className="h-2"
											value={questionStat.correctRate}
										/>

										<div className="flex justify-between text-xs">
											<span className="font-medium text-green-600">
												{Math.round(
													(questionStat.correctRate / 100) *
														questionStat.totalAnswers,
												)}{" "}
												correct
											</span>
											<span className="font-medium text-red-600">
												{questionStat.totalAnswers -
													Math.round(
														(questionStat.correctRate / 100) *
															questionStat.totalAnswers,
													)}{" "}
												incorrect
											</span>
										</div>
									</div>

									{}
									<div className="flex items-center gap-2 pt-1">
										{questionStat.correctRate >= 80 ? (
											<div className="flex items-center gap-1 text-green-600">
												<CheckCircle className="size-3" />
												<span className="font-medium text-xs">
													High accuracy
												</span>
											</div>
										) : questionStat.correctRate >= 50 ? (
											<div className="flex items-center gap-1 text-yellow-600">
												<AlertCircle className="size-3" />
												<span className="font-medium text-xs">
													Moderate accuracy
												</span>
											</div>
										) : (
											<div className="flex items-center gap-1 text-red-600">
												<XCircle className="size-3" />
												<span className="font-medium text-xs">
													Low accuracy
												</span>
											</div>
										)}
									</div>
								</div>
							</Card>
						))}
					</div>
				</div>
			)}

			{}
			<Card className="p-6">
				<div className="mb-4 flex items-center gap-2">
					<TrendingUp className="size-5 text-blue-500" />
					<h3 className="font-semibold text-lg">Performance Insights</h3>
				</div>

				<div className="flex flex-col gap-3">
					{stats.passRate >= 80 && (
						<div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-3">
							<CheckCircle className="mt-0.5 size-5 text-green-600" />
							<div>
								<p className="font-medium text-green-800 text-sm">
									Excellent Performance
								</p>
								<p className="text-green-700 text-xs">
									High pass rate indicates well-designed questions and good
									understanding.
								</p>
							</div>
						</div>
					)}

					{stats.passRate < 50 && (
						<div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3">
							<XCircle className="mt-0.5 size-5 text-red-600" />
							<div>
								<p className="font-medium text-red-800 text-sm">
									Low Pass Rate
								</p>
								<p className="text-red-700 text-xs">
									Consider reviewing question difficulty or providing additional
									learning resources.
								</p>
							</div>
						</div>
					)}

					{stats.averageScore < 60 && (
						<div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
							<Target className="mt-0.5 size-5 text-yellow-600" />
							<div>
								<p className="font-medium text-sm text-yellow-800">
									Low Average Score
								</p>
								<p className="text-xs text-yellow-700">
									The average score suggests questions might be too challenging.
								</p>
							</div>
						</div>
					)}

					{stats.totalAttempts === 0 && (
						<div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
							<Users className="mt-0.5 size-5 text-blue-600" />
							<div>
								<p className="font-medium text-blue-800 text-sm">
									No Attempts Yet
								</p>
								<p className="text-blue-700 text-xs">
									Share your quiz to start collecting performance data.
								</p>
							</div>
						</div>
					)}
				</div>
			</Card>
		</div>
	);
}
