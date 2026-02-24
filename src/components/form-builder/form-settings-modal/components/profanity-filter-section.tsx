import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

import type { ProfanityFilterSectionProps } from "../types";

export function ProfanityFilterSection({
	localSettings,
	updateProfanityFilter,
	formId,
	schema,
	onSchemaUpdate,
}: ProfanityFilterSectionProps & {
	onSchemaUpdate?: (updates: Partial<any>) => void;
}) {
	const t = useTranslations(
		"product.formBuilder.formSettings.profanityFilterSection"
	);
	const tCommon = useTranslations("product.formBuilder.formSettings.common");
	const [profanityFilterSettings, setProfanityFilterSettings] = useState({
		enabled: localSettings.profanityFilter?.enabled,
		strictMode: true,
		replaceWithAsterisks: localSettings.profanityFilter?.replaceWithAsterisks,
		customMessage: localSettings.profanityFilter?.customMessage || "",
		customWords: localSettings.profanityFilter?.customWords || [],
		whitelistedWords: localSettings.profanityFilter?.whitelistedWords || [],
	});

	const [saving, setSaving] = useState(false);
	const [saved, setSaved] = useState(false);
	const [hasChanges, setHasChanges] = useState(false);

	const profanityFilterRef = useRef<HTMLDivElement>(null);

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

	const handleProfanityFilterChange = (field: string, value: any) => {
		setProfanityFilterSettings((prev) => ({ ...prev, [field]: value }));
		setSaved(false);
		setHasChanges(true);
	};

	const resetSettings = () => {
		setProfanityFilterSettings({
			enabled: localSettings.profanityFilter?.enabled,
			strictMode: true,
			replaceWithAsterisks: localSettings.profanityFilter?.replaceWithAsterisks,
			customMessage: localSettings.profanityFilter?.customMessage || "",
			customWords: localSettings.profanityFilter?.customWords || [],
			whitelistedWords: localSettings.profanityFilter?.whitelistedWords || [],
		});
		setHasChanges(false);
	};

	const saveProfanityFilter = async () => {
		if (!formId) {
			toast.error(tCommon("formIdRequiredToSaveSettings"));
			return;
		}

		setSaving(true);
		try {
			const trimmed = {
				...profanityFilterSettings,
				customMessage: (profanityFilterSettings.customMessage || "").trim(),
				customWords: (profanityFilterSettings.customWords || [])
					.map((word) => word.trim())
					.filter((word) => word.length > 0),
				whitelistedWords: (profanityFilterSettings.whitelistedWords || [])
					.map((word) => word.trim())
					.filter((word) => word.length > 0),
			};
			if (onSchemaUpdate) {
				await onSchemaUpdate({
					settings: {
						...schema.settings,
						profanityFilter: trimmed,
					},
				});
			}
			updateProfanityFilter(trimmed);
			setSaved(true);
			setHasChanges(false);
			toast.success(t("saved"));

			setTimeout(() => setSaved(false), 2000);
		} catch (error) {
			console.error("Error saving profanity filter:", error);
			toast.error(t("saveFailed"));
		} finally {
			setSaving(false);
		}
	};

	useEffect(() => {
		if (profanityFilterRef.current) {
			const firstInput = profanityFilterRef.current.querySelector(
				"input, textarea"
			) as HTMLElement;
			firstInput?.focus();
		}
	}, []);

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
					saveProfanityFilter();
				}
			}}
			role="main"
			style={{
				overscrollBehavior: "contain",
			}}
		>
			<Card
				aria-labelledby="profanity-filter-title"
				className="shadow-none"
				ref={profanityFilterRef}
				role="region"
			>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle
								className="flex items-center gap-2 text-lg tracking-tight"
								id="profanity-filter-title"
							>
								{t("title")}{" "}
								{hasChanges && (
									<Badge className="gap-2" variant="secondary">
										<div className="size-2 rounded-full bg-orange-500" />
										{tCommon("unsavedChanges")}
									</Badge>
								)}
							</CardTitle>
							<CardDescription id="profanity-filter-description">
								{t("description")}
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent className="flex flex-col gap-6">
					<div className="flex items-center justify-between">
						<div className="flex flex-col gap-1">
							<Label
								className="font-medium text-sm"
								htmlFor="profanity-filter-enabled"
							>
								{t("enableLabel")}
							</Label>
							<p
								className="text-muted-foreground text-xs"
								id="profanity-filter-enabled-description"
							>
								{t("enableDescription")}
							</p>
						</div>
						<Switch
							aria-describedby="profanity-filter-enabled-description"
							checked={profanityFilterSettings.enabled}
							id="profanity-filter-enabled"
							onCheckedChange={(checked) =>
								handleProfanityFilterChange("enabled", checked)
							}
						/>
					</div>

					{profanityFilterSettings.enabled && (
						<div className="flex flex-col gap-6">
							<div className="flex flex-col gap-4">
								<FilterModeSection
									profanityFilter={profanityFilterSettings}
									t={t}
									updateProfanityFilter={handleProfanityFilterChange}
								/>
								<CustomMessageSection
									profanityFilter={profanityFilterSettings}
									t={t}
									updateProfanityFilter={handleProfanityFilterChange}
								/>
								<WordManagementSection
									type="custom"
									t={t}
									updateWords={(words) =>
										handleProfanityFilterChange("customWords", words)
									}
									words={profanityFilterSettings.customWords}
								/>
								<WordManagementSection
									type="whitelist"
									t={t}
									updateWords={(words) =>
										handleProfanityFilterChange("whitelistedWords", words)
									}
									words={profanityFilterSettings.whitelistedWords}
								/>
							</div>

							<div
								aria-live="polite"
								className="rounded-lg border border-muted bg-muted/50 p-4"
								role="status"
							>
								<div className="flex flex-col gap-2">
									<h4 className="font-medium text-foreground text-sm">
										{t("currentConfiguration")}
									</h4>
									<p className="text-muted-foreground text-sm">
										{t("summaryPrefix")}{" "}
										<span className="font-semibold text-foreground">
											{t("enabled")}
										</span>{" "}
										{t("summaryIn")}{" "}
										<span className="font-semibold text-foreground">
											{profanityFilterSettings.strictMode
												? t("strictMode")
												: t("replaceMode")}
										</span>
										{t("summaryPeriod")}
										{profanityFilterSettings.customWords.length > 0 && (
											<span>
												{" "}
												{t("customWordsConfigured", {
													count: profanityFilterSettings.customWords.length,
												})}
											</span>
										)}
										{profanityFilterSettings.whitelistedWords.length > 0 && (
											<span>
												{" "}
												{t("whitelistedWordsConfigured", {
													count:
														profanityFilterSettings.whitelistedWords.length,
												})}
											</span>
										)}
									</p>
								</div>
							</div>
						</div>
					)}

					{!profanityFilterSettings.enabled && (
						<div className="rounded-lg bg-muted/30 p-4">
							<p className="text-muted-foreground text-sm">
								{t("disabledDescription")}
							</p>
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
									onClick={resetSettings}
									size="sm"
									variant="ghost"
								>
									{tCommon("reset")}
								</Button>
							)}
						</div>
						<div className="flex items-center gap-2">
							<Button
								aria-describedby="profanity-filter-description"
								aria-label={t("saveAria")}
								disabled={saving || !hasChanges}
								loading={saving}
								onClick={saveProfanityFilter}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										saveProfanityFilter();
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

function FilterModeSection({
	profanityFilter,
	t,
	updateProfanityFilter,
}: {
	profanityFilter: any;
	t: ReturnType<typeof useTranslations>;
	updateProfanityFilter: (field: string, value: any) => void;
}) {
	return (
		<div className="flex flex-col gap-2">
			<Label className="font-medium text-sm">{t("filterModeLabel")}</Label>
			<RadioGroup
				onValueChange={(value: "replace" | "strict") => {
					if (value === "replace") {
						updateProfanityFilter("strictMode", false);
						updateProfanityFilter("replaceWithAsterisks", true);
					} else {
						updateProfanityFilter("strictMode", true);
						updateProfanityFilter("replaceWithAsterisks", false);
					}
				}}
				orientation="vertical"
				value={profanityFilter.replaceWithAsterisks ? "replace" : "strict"}
			>
				<div className="flex items-center gap-2">
					<RadioGroupItem id="strict-mode" value="strict" />
					<Label htmlFor="strict-mode">{t("strictModeOption")}</Label>
				</div>
				<div className="flex items-center gap-2">
					<RadioGroupItem id="replace-mode" value="replace" />
					<Label htmlFor="replace-mode">{t("replaceModeOption")}</Label>
				</div>
			</RadioGroup>
		</div>
	);
}

function CustomMessageSection({
	profanityFilter,
	t,
	updateProfanityFilter,
}: {
	profanityFilter: any;
	t: ReturnType<typeof useTranslations>;
	updateProfanityFilter: (field: string, value: any) => void;
}) {
	return (
		<div className="flex flex-col gap-2">
			<Label className="font-medium text-sm" htmlFor="custom-message">
				{t("customMessageLabel")}
			</Label>
			<Textarea
				className="text-base shadow-none md:text-sm"
				id="custom-message"
				name="custom-message"
				onChange={(e) => updateProfanityFilter("customMessage", e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Escape") {
						(e.target as HTMLElement).blur();
					}
				}}
				placeholder={t("customMessagePlaceholder")}
				rows={2}
				value={profanityFilter.customMessage || ""}
			/>
		</div>
	);
}

function WordManagementSection({
	type,
	t,
	words,
	updateWords,
}: {
	type: "custom" | "whitelist";
	t: ReturnType<typeof useTranslations>;
	words: string[];
	updateWords: (words: string[]) => void;
}) {
	const [newWord, setNewWord] = useState("");

	const addWord = () => {
		const value = newWord.trim();
		if (!value) return;

		const wordsToAdd = value
			.split(",")
			.map((w) => w.trim())
			.filter((w) => w.length > 0);
		const newWords = wordsToAdd.filter((word) => !words.includes(word));

		if (newWords.length > 0) {
			updateWords([...words, ...newWords]);
		}
		setNewWord("");
	};

	const removeWord = (word: string) => {
		updateWords(words.filter((w) => w !== word));
	};

	const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			addWord();
			return;
		}
		if (e.key === ",") {
			e.preventDefault();
			addWord();
		}
	};

	const isWhitelist = type === "whitelist";

	return (
		<div className="flex flex-col gap-2">
			<Label className="font-medium text-sm">
				{isWhitelist ? t("whitelistedWordsTitle") : t("customWordsTitle")}
			</Label>
			<div className="flex items-center gap-2">
				<Input
					className="text-base shadow-none md:text-sm"
					name={`new-word-${isWhitelist ? "whitelist" : "filter"}`}
					onChange={(e) => setNewWord(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Escape") {
							(e.target as HTMLElement).blur();
						} else {
							onKeyDown(e);
						}
					}}
					placeholder={
						isWhitelist
							? t("whitelistPlaceholder")
							: t("customWordsPlaceholder")
					}
					value={newWord}
				/>
				<Button
					aria-label={
						isWhitelist ? t("addWhitelistedWordAria") : t("addFilteredWordAria")
					}
					onClick={addWord}
					size="sm"
					type="button"
				>
					{t("addWord")}
				</Button>
			</div>
			{words.length > 0 && (
				<div className="flex flex-wrap gap-2">
					{words.map((word) => (
						<Badge
							className="flex items-center gap-1"
							key={word}
							variant={isWhitelist ? "outline" : "secondary"}
						>
							<span>{word}</span>
							<Button
								aria-label={t("removeWordAria", { word })}
								className="size-4 p-0"
								onClick={() => removeWord(word)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										removeWord(word);
									}
								}}
								size="icon"
								type="button"
								variant="ghost"
							>
								<X aria-hidden="true" className="size-3" />
							</Button>
						</Badge>
					))}
				</div>
			)}
		</div>
	);
}
