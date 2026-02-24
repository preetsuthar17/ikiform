import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import type { LocalSettings } from "../types";

interface QuizSectionProps {
	localSettings: LocalSettings;
	updateSettings: (updates: Partial<LocalSettings>) => void;
	formId?: string;
	schema?: any;
}

export function QuizSection({
	localSettings,
	updateSettings,
	formId,
	schema,
	onSchemaUpdate,
}: QuizSectionProps & { onSchemaUpdate?: (updates: Partial<any>) => void }) {
	const t = useTranslations("product.formBuilder.formSettings.quizSection");
	const tCommon = useTranslations("product.formBuilder.formSettings.common");
	const initialQuiz = localSettings.quiz || {};
	const [quizSettings, setQuizSettings] = useState({
		enabled: initialQuiz.enabled,
		passingScore: initialQuiz.passingScore ?? 70,
		showScore: initialQuiz.showScore !== false,
		showCorrectAnswers: initialQuiz.showCorrectAnswers !== false,
		allowRetake: initialQuiz.allowRetake ?? false,
		timeLimit: initialQuiz.timeLimit ?? "",
		resultMessage: {
			pass: initialQuiz.resultMessage?.pass || "",
			fail: initialQuiz.resultMessage?.fail || "",
		},
	});
	const [hasChanges, setHasChanges] = useState(false);
	const [saving, setSaving] = useState(false);
	const [saved, setSaved] = useState(false);

	const sectionRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const onBeforeUnload = (e: BeforeUnloadEvent) => {
			if (hasChanges) {
				e.preventDefault();
				e.returnValue = "";
			}
		};
		window.addEventListener("beforeunload", onBeforeUnload);
		return () =>
			window.removeEventListener(
				"beforeunload",
				onBeforeUnload as unknown as EventListener
			);
	}, [hasChanges]);

	useEffect(() => {
		if (sectionRef.current) {
			const firstInput = sectionRef.current.querySelector(
				"input, textarea"
			) as HTMLElement;
			firstInput?.focus();
		}
	}, []);

	const updateQuizLocal = (updates: Partial<typeof quizSettings>) => {
		setQuizSettings((prev) => ({ ...prev, ...updates }));
		setHasChanges(true);
		setSaved(false);
	};

	const saveQuiz = async () => {
		if (!formId) {
			toast.error(tCommon("formIdRequiredToSaveSettings"));
			return;
		}
		setSaving(true);
		try {
			const trimmed = {
				...quizSettings,
				resultMessage: {
					pass: (quizSettings.resultMessage?.pass || "").trim(),
					fail: (quizSettings.resultMessage?.fail || "").trim(),
				},
				timeLimit:
					quizSettings.timeLimit === "" || quizSettings.timeLimit === undefined
						? undefined
						: Number(quizSettings.timeLimit),
			} as any;
			if (onSchemaUpdate) {
				await onSchemaUpdate({
					settings: {
						...schema.settings,
						quiz: trimmed,
					},
				});
			}
			updateSettings({ quiz: trimmed });
			setHasChanges(false);
			setSaved(true);
			toast.success(t("savedToast"));
			setTimeout(() => setSaved(false), 2000);
		} catch (e) {
			console.error(e);
			toast.error(t("saveFailed"));
		} finally {
			setSaving(false);
		}
	};

	const resetQuiz = () => {
		setQuizSettings({
			enabled: initialQuiz.enabled,
			passingScore: initialQuiz.passingScore ?? 70,
			showScore: initialQuiz.showScore !== false,
			showCorrectAnswers: initialQuiz.showCorrectAnswers !== false,
			allowRetake: initialQuiz.allowRetake ?? false,
			timeLimit: initialQuiz.timeLimit ?? "",
			resultMessage: {
				pass: initialQuiz.resultMessage?.pass || "",
				fail: initialQuiz.resultMessage?.fail || "",
			},
		});
		setHasChanges(false);
	};

	useEffect(() => {
		if (saved) {
			const announcement = document.createElement("div");
			announcement.setAttribute("aria-live", "polite");
			announcement.setAttribute("aria-atomic", "true");
			announcement.className = "sr-only";
			announcement.textContent = t("saved");
			document.body.appendChild(announcement);
			setTimeout(() => {
				document.body.removeChild(announcement);
			}, 1000);
		}
	}, [saved, t]);

	return (
		<div
			aria-label={t("ariaSettings")}
			className="flex flex-col gap-4"
			onKeyDown={(e) => {
				const target = e.target as HTMLElement;
				const isTextarea = target.tagName === "TEXTAREA";
				if (isTextarea && e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
					e.preventDefault();
					saveQuiz();
				}
			}}
			role="main"
			style={{
				overscrollBehavior: "contain",
			}}
		>
			<Card
				aria-labelledby="quiz-title"
				className="shadow-none"
				ref={sectionRef}
				role="region"
			>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle
								className="flex items-center gap-2 text-lg tracking-tight"
								id="quiz-title"
							>
								{t("title")}{" "}
								{hasChanges && (
									<Badge className="gap-2" variant="secondary">
										<div className="size-2 rounded-full bg-orange-500" />
										{tCommon("unsavedChanges")}
									</Badge>
								)}
							</CardTitle>
							<CardDescription id="quiz-description">
								{t("description")}
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent className="flex flex-col gap-6">
					<div className="flex items-center justify-between">
						<div className="flex flex-col gap-1">
							<Label className="font-medium text-sm" htmlFor="quiz-enabled">
								{t("enableLabel")}
							</Label>
							<p
								className="text-muted-foreground text-xs"
								id="quiz-enabled-description"
							>
								{t("enableDescription")}
							</p>
						</div>
						<Switch
							aria-describedby="quiz-enabled-description"
							checked={quizSettings.enabled}
							id="quiz-enabled"
							onCheckedChange={(enabled) => updateQuizLocal({ enabled })}
						/>
					</div>

					{quizSettings.enabled && (
						<div className="flex flex-col gap-6">
							<QuizField
								description={t("passingScoreDescription")}
								id="passing-score"
								label={t("passingScoreLabel")}
								max={100}
								min={0}
								onChange={(value) => updateQuizLocal({ passingScore: value })}
								step={5}
								type="slider"
								value={quizSettings.passingScore || 70}
							/>

							<QuizToggleField
								checked={quizSettings.showScore}
								description={t("showScoreDescription")}
								id="show-score"
								label={t("showScoreLabel")}
								onChange={(showScore) => updateQuizLocal({ showScore })}
							/>

							<QuizToggleField
								checked={quizSettings.showCorrectAnswers}
								description={t("showCorrectAnswersDescription")}
								id="show-correct"
								label={t("showCorrectAnswersLabel")}
								onChange={(showCorrectAnswers) =>
									updateQuizLocal({ showCorrectAnswers })
								}
							/>

							<QuizToggleField
								checked={quizSettings.allowRetake}
								description={t("allowRetakeDescription")}
								id="allow-retake"
								label={t("allowRetakeLabel")}
								onChange={(allowRetake) => updateQuizLocal({ allowRetake })}
							/>

							<QuizField
								description={t("timeLimitDescription")}
								id="time-limit"
								label={t("timeLimitLabel")}
								max={180}
								min={1}
								onChange={(timeLimit) => {
									updateQuizLocal({ timeLimit });
								}}
								placeholder={t("timeLimitPlaceholder")}
								type="number"
								value={quizSettings.timeLimit}
							/>

							<div className="flex flex-col gap-4">
								<Label className="font-medium text-sm">
									{t("customMessagesLabel")}
								</Label>

								<QuizField
									description={t("messagePlaceholderHelp")}
									id="pass-message"
									label={t("successMessageLabel")}
									onChange={(pass) =>
										updateQuizLocal({
											resultMessage: {
												...quizSettings.resultMessage,
												pass,
											},
										})
									}
									placeholder={t("successMessagePlaceholder")}
									rows={3}
									type="textarea"
									value={quizSettings.resultMessage?.pass || ""}
								/>

								<QuizField
									description={t("messagePlaceholderHelp")}
									id="fail-message"
									label={t("improvementMessageLabel")}
									onChange={(fail) =>
										updateQuizLocal({
											resultMessage: {
												...quizSettings.resultMessage,
												fail,
											},
										})
									}
									placeholder={t("improvementMessagePlaceholder")}
									rows={3}
									type="textarea"
									value={quizSettings.resultMessage?.fail || ""}
								/>
							</div>
						</div>
					)}

					<div
						aria-label={t("actionsAria")}
						className="flex items-center justify-between"
						role="group"
					>
						<div className="flex items-center gap-2">
							{hasChanges && (
								<Button
									className="gap-2 text-muted-foreground hover:text-foreground"
									onClick={resetQuiz}
									size="sm"
									variant="ghost"
								>
									{tCommon("reset")}
								</Button>
							)}
						</div>
						<div className="flex items-center gap-2">
							<Button
								aria-describedby="quiz-description"
								aria-label={t("saveAria")}
								disabled={saving || !hasChanges}
								loading={saving}
								onClick={saveQuiz}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										saveQuiz();
									}
								}}
							>
								{tCommon("save")}
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

function QuizField({
	id,
	label,
	description,
	value,
	onChange,
	type = "text",
	placeholder,
	rows,
	min,
	max,
	step,
}: {
	id: string;
	label: string;
	description?: string;
	value: any;
	onChange: (value: any) => void;
	type?: "text" | "number" | "textarea" | "slider";
	placeholder?: string;
	rows?: number;
	min?: number;
	max?: number;
	step?: number;
}) {
	return (
		<div className="flex flex-col gap-2">
			<Label htmlFor={id}>{label}</Label>
			{type === "slider" ? (
				<div className="flex flex-col gap-2">
					<div className="flex items-center justify-between">
						<span className="text-muted-foreground text-sm">{description}</span>
						<span className="font-medium text-sm">{value}%</span>
					</div>
					<Slider
						className="w-full"
						id={id}
						max={max}
						min={min}
						onValueChange={([newValue]) => onChange(newValue)}
						step={step}
						value={[value]}
					/>
				</div>
			) : type === "textarea" ? (
				<>
					<Textarea
						className="text-base shadow-none md:text-sm"
						id={id}
						name={id}
						onChange={(e) => onChange(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Escape") {
								(e.target as HTMLElement).blur();
							}
						}}
						placeholder={placeholder}
						rows={rows}
						value={value}
					/>
					{description && (
						<p className="text-muted-foreground text-xs">{description}</p>
					)}
				</>
			) : (
				<>
					<Input
						className="text-base shadow-none md:text-sm"
						id={id}
						max={max}
						min={min}
						name={id}
						onChange={(e) => onChange(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Escape") {
								(e.target as HTMLElement).blur();
							}
						}}
						placeholder={placeholder}
						type={type}
						value={value}
					/>
					{description && (
						<p className="text-muted-foreground text-xs">{description}</p>
					)}
				</>
			)}
		</div>
	);
}

function QuizToggleField({
	id,
	label,
	description,
	checked,
	onChange,
}: {
	id: string;
	label: string;
	description: string;
	checked: boolean;
	onChange: (checked: boolean) => void;
}) {
	return (
		<div className="flex items-start gap-3">
			<Switch checked={checked} id={id} onCheckedChange={onChange} />
			<div className="flex flex-1 flex-col gap-2">
				<Label className="cursor-pointer font-medium text-sm" htmlFor={id}>
					{label}
				</Label>
				<p className="text-muted-foreground text-xs">{description}</p>
			</div>
		</div>
	);
}
