import { UserCheck } from "lucide-react";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

import type { DuplicatePreventionSectionProps } from "../types";

export function DuplicatePreventionSection({
	localSettings,
	updateDuplicatePrevention,
	formId,
	schema,
	onSchemaUpdate,
}: DuplicatePreventionSectionProps & {
	onSchemaUpdate?: (updates: Partial<any>) => void;
}) {
	const t = useTranslations(
		"product.formBuilder.formSettings.duplicatePreventionSection"
	);
	const tCommon = useTranslations("product.formBuilder.formSettings.common");
	const localizeLegacyDefault = (
		value: string | undefined,
		oneTimeFallback: string,
		timeBasedFallback: string
	) => {
		if (!value) return oneTimeFallback;
		if (value === "You have already submitted this form. Each user can only submit once.") {
			return oneTimeFallback;
		}
		if (
			value ===
			"You have already submitted this form. Please wait before submitting again."
		) {
			return timeBasedFallback;
		}
		return value;
	};
	const [duplicatePreventionSettings, setDuplicatePreventionSettings] =
		useState({
			enabled: localSettings.duplicatePrevention?.enabled,
			strategy: localSettings.duplicatePrevention?.strategy || "combined",
			mode: localSettings.duplicatePrevention?.mode || "one-time",
			message: localizeLegacyDefault(
				localSettings.duplicatePrevention?.message,
				t("defaultMessageOneTime"),
				t("defaultMessageTimeBased")
			),
			timeWindow: localSettings.duplicatePrevention?.timeWindow || 1440,
			maxAttempts: localSettings.duplicatePrevention?.maxAttempts || 1,
			allowOverride: localSettings.duplicatePrevention?.allowOverride,
		});

	const [saving, setSaving] = useState(false);
	const [saved, setSaved] = useState(false);
	const [hasChanges, setHasChanges] = useState(false);

	const duplicatePreventionRef = useRef<HTMLDivElement>(null);

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

	const handleDuplicatePreventionChange = (field: string, value: any) => {
		setDuplicatePreventionSettings((prev) => ({ ...prev, [field]: value }));
		setSaved(false);
		setHasChanges(true);
	};

	const resetSettings = () => {
		setDuplicatePreventionSettings({
			enabled: localSettings.duplicatePrevention?.enabled,
			strategy: localSettings.duplicatePrevention?.strategy || "combined",
			mode: localSettings.duplicatePrevention?.mode || "one-time",
			message: localizeLegacyDefault(
				localSettings.duplicatePrevention?.message,
				t("defaultMessageOneTime"),
				t("defaultMessageTimeBased")
			),
			timeWindow: localSettings.duplicatePrevention?.timeWindow || 1440,
			maxAttempts: localSettings.duplicatePrevention?.maxAttempts || 1,
			allowOverride: localSettings.duplicatePrevention?.allowOverride,
		});
		setHasChanges(false);
	};

	const saveDuplicatePrevention = async () => {
		if (!formId) {
			toast.error(tCommon("formIdRequiredToSaveSettings"));
			return;
		}

		setSaving(true);
		try {
			const trimmed = {
				...duplicatePreventionSettings,
				message: (duplicatePreventionSettings.message || "").trim(),
			};
			if (onSchemaUpdate) {
				await onSchemaUpdate({
					settings: {
						...schema.settings,
						duplicatePrevention: trimmed,
					},
				});
			}
			updateDuplicatePrevention(trimmed);
			setSaved(true);
			setHasChanges(false);
			toast.success(t("saved"));

			setTimeout(() => setSaved(false), 2000);
		} catch (error) {
			console.error("Error saving duplicate prevention:", error);
			toast.error(t("saveFailed"));
		} finally {
			setSaving(false);
		}
	};

	useEffect(() => {
		if (duplicatePreventionRef.current) {
			const firstInput = duplicatePreventionRef.current.querySelector(
				"input, textarea, select"
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
					saveDuplicatePrevention();
				}
			}}
			role="main"
			style={{
				overscrollBehavior: "contain",
			}}
		>
			<Card
				aria-labelledby="duplicate-prevention-title"
				className="shadow-none"
				ref={duplicatePreventionRef}
				role="region"
			>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle
								className="flex items-center gap-2 text-lg tracking-tight"
								id="duplicate-prevention-title"
							>
								{t("title")}{" "}
								{hasChanges && (
									<Badge className="gap-2" variant="secondary">
										<div className="size-2 rounded-full bg-orange-500" />
										{tCommon("unsavedChanges")}
									</Badge>
								)}
							</CardTitle>
							<CardDescription id="duplicate-prevention-description">
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
								htmlFor="duplicate-prevention-enabled"
							>
								{t("enableLabel")}
							</Label>
							<p
								className="text-muted-foreground text-xs"
								id="duplicate-prevention-enabled-description"
							>
								{t("enableDescription")}
							</p>
						</div>
						<Switch
							aria-describedby="duplicate-prevention-enabled-description"
							checked={duplicatePreventionSettings.enabled}
							id="duplicate-prevention-enabled"
							onCheckedChange={(checked) =>
								handleDuplicatePreventionChange("enabled", checked)
							}
						/>
					</div>

					{duplicatePreventionSettings.enabled && (
						<div className="flex flex-col gap-6">
							<div className="flex flex-col gap-4">
								<PreventionModeSection
									duplicatePrevention={duplicatePreventionSettings}
									t={t}
									updateSettings={handleDuplicatePreventionChange}
								/>
								<PreventionStrategySection
									duplicatePrevention={duplicatePreventionSettings}
									t={t}
									updateSettings={handleDuplicatePreventionChange}
								/>
								{duplicatePreventionSettings.mode === "time-based" && (
									<TimeBasedSettingsSection
										duplicatePrevention={duplicatePreventionSettings}
										t={t}
										updateSettings={handleDuplicatePreventionChange}
									/>
								)}
								<ErrorMessageSection
									duplicatePrevention={duplicatePreventionSettings}
									t={t}
									updateSettings={handleDuplicatePreventionChange}
								/>
								<OverrideSection
									duplicatePrevention={duplicatePreventionSettings}
									t={t}
									updateSettings={handleDuplicatePreventionChange}
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
									<DuplicatePreventionSummary
										duplicatePrevention={duplicatePreventionSettings}
										t={t}
									/>
								</div>
							</div>
						</div>
					)}

					{!duplicatePreventionSettings.enabled && (
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
								aria-describedby="duplicate-prevention-description"
								aria-label={t("saveAria")}
								disabled={saving || !hasChanges}
								loading={saving}
								onClick={saveDuplicatePrevention}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										saveDuplicatePrevention();
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

function PreventionModeSection({
	duplicatePrevention,
	t,
	updateSettings,
}: {
	duplicatePrevention: any;
	t: ReturnType<typeof useTranslations>;
	updateSettings: (field: string, value: any) => void;
}) {
	return (
		<div className="flex flex-col gap-2">
			<Label className="font-medium text-sm">{t("preventionModeLabel")}</Label>
			<RadioGroup
				onValueChange={(value) => {
					updateSettings("mode", value as "time-based" | "one-time");
					updateSettings(
						"message",
						value === "one-time"
							? t("defaultMessageOneTime")
							: t("defaultMessageTimeBased")
					);
				}}
				value={duplicatePrevention.mode || "one-time"}
			>
				<div className="flex flex-col gap-2">
					<div className="flex items-center gap-2">
						<RadioGroupItem id="one-time" value="one-time" />
						<Label className="text-sm" htmlFor="one-time">
							{t("oneTimeLabel")}
						</Label>
					</div>
					<div className="flex items-start gap-2">
						<div className="size-4" />
						<p className="text-muted-foreground text-xs">
							{t("oneTimeDescription")}
						</p>
					</div>

					<div className="flex items-center gap-2">
						<RadioGroupItem id="time-based" value="time-based" />
						<Label className="text-sm" htmlFor="time-based">
							{t("timeBasedLabel")}
						</Label>
					</div>
					<div className="flex items-start gap-2">
						<div className="size-4" />
						<p className="text-muted-foreground text-xs">
							{t("timeBasedDescription")}
						</p>
					</div>
				</div>
			</RadioGroup>
		</div>
	);
}

function PreventionStrategySection({
	duplicatePrevention,
	t,
	updateSettings,
}: {
	duplicatePrevention: any;
	t: ReturnType<typeof useTranslations>;
	updateSettings: (field: string, value: any) => void;
}) {
	return (
		<div className="flex flex-col gap-2">
			<Label className="font-medium text-sm">{t("preventionStrategyLabel")}</Label>
			<Select
				onValueChange={(value: "ip" | "email" | "session" | "combined") =>
					updateSettings("strategy", value)
				}
				value={duplicatePrevention.strategy || "combined"}
			>
				<SelectTrigger>
					<SelectValue placeholder={t("selectStrategyPlaceholder")} />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="combined">{t("strategyCombinedLabel")}</SelectItem>
					<SelectItem value="email">{t("strategyEmailLabel")}</SelectItem>
					<SelectItem value="ip">{t("strategyIpLabel")}</SelectItem>
					<SelectItem value="session">{t("strategySessionLabel")}</SelectItem>
				</SelectContent>
			</Select>
			<p className="text-muted-foreground text-xs">
				{duplicatePrevention.strategy === "combined" &&
					t("strategyCombinedDescription")}
				{duplicatePrevention.strategy === "email" &&
					t("strategyEmailDescription")}
				{duplicatePrevention.strategy === "ip" && t("strategyIpDescription")}
				{duplicatePrevention.strategy === "session" &&
					t("strategySessionDescription")}
			</p>
		</div>
	);
}

function TimeBasedSettingsSection({
	duplicatePrevention,
	t,
	updateSettings,
}: {
	duplicatePrevention: any;
	t: ReturnType<typeof useTranslations>;
	updateSettings: (field: string, value: any) => void;
}) {
	return (
		<div className="grid grid-cols-2 gap-4">
			<DuplicatePreventionInput
				description={t("timeWindowDescription")}
				id="time-window"
				label={t("timeWindowLabel")}
				max={10_080}
				min={1}
				onChange={(value) => updateSettings("timeWindow", value)}
				placeholder={t("timeWindowPlaceholder")}
				value={duplicatePrevention.timeWindow || 1440}
			/>
			<DuplicatePreventionInput
				description={t("maxAttemptsDescription")}
				id="max-attempts"
				label={t("maxAttemptsLabel")}
				max={10}
				min={1}
				onChange={(value) => updateSettings("maxAttempts", value)}
				placeholder={t("maxAttemptsPlaceholder")}
				value={duplicatePrevention.maxAttempts || 1}
			/>
		</div>
	);
}

function ErrorMessageSection({
	duplicatePrevention,
	t,
	updateSettings,
}: {
	duplicatePrevention: any;
	t: ReturnType<typeof useTranslations>;
	updateSettings: (field: string, value: any) => void;
}) {
	return (
		<div className="flex flex-col gap-2">
			<Label htmlFor="duplicate-message">{t("errorMessageLabel")}</Label>
			<Textarea
				autoComplete="off"
				id="duplicate-message"
				name="duplicate-message"
				onChange={(e) => updateSettings("message", e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Escape") {
						(e.target as HTMLElement).blur();
					}
				}}
				placeholder={
					duplicatePrevention.mode === "one-time"
						? t("defaultMessageOneTime")
						: t("defaultMessageTimeBased")
				}
				rows={2}
				value={
					duplicatePrevention.message ||
					(duplicatePrevention.mode === "one-time"
						? t("defaultMessageOneTime")
						: t("defaultMessageTimeBased"))
				}
			/>
			<p className="text-muted-foreground text-xs">
				{t("errorMessageDescription")}
			</p>
		</div>
	);
}

function OverrideSection({
	duplicatePrevention,
	t,
	updateSettings,
}: {
	duplicatePrevention: any;
	t: ReturnType<typeof useTranslations>;
	updateSettings: (field: string, value: any) => void;
}) {
	return (
		<div className="flex items-start gap-2">
			<Switch
				checked={duplicatePrevention.allowOverride}
				id="duplicate-allow-override"
				onCheckedChange={(checked) => updateSettings("allowOverride", checked)}
			/>
			<div className="flex flex-col gap-1">
				<Label
					className="font-medium text-sm"
					htmlFor="duplicate-allow-override"
				>
					{t("allowOverrideLabel")}
				</Label>
				<p className="text-muted-foreground text-xs">
					{t("allowOverrideDescription")}
				</p>
			</div>
		</div>
	);
}

function DuplicatePreventionInput({
	id,
	label,
	value,
	min,
	max,
	placeholder,
	description,
	onChange,
}: {
	id: string;
	label: string;
	value: number;
	min: number;
	max: number;
	placeholder: string;
	description: string;
	onChange: (value: number) => void;
}) {
	return (
		<div className="flex flex-col gap-2">
			<Label htmlFor={id}>{label}</Label>
			<Input
				id={id}
				max={max}
				min={min}
				name={id}
				onChange={(e) => onChange(Number.parseInt(e.target.value) || min)}
				onKeyDown={(e) => {
					if (e.key === "Escape") {
						(e.target as HTMLElement).blur();
					}
				}}
				placeholder={placeholder}
				type="number"
				value={value}
			/>
			<p className="text-muted-foreground text-xs">{description}</p>
		</div>
	);
}

function DuplicatePreventionSummary({
	duplicatePrevention,
	t,
}: {
	duplicatePrevention: any;
	t: ReturnType<typeof useTranslations>;
}) {
	const modeText =
		duplicatePrevention.mode === "one-time"
			? t("summaryModeOneTime")
			: t("summaryModeTimeBased", {
					maxAttempts: duplicatePrevention.maxAttempts || 1,
					timeWindow: duplicatePrevention.timeWindow || 1440,
				});

	const strategyText =
		duplicatePrevention.strategy === "combined"
			? t("summaryStrategyCombined")
			: duplicatePrevention.strategy === "email"
				? t("summaryStrategyEmail")
				: duplicatePrevention.strategy === "ip"
					? t("summaryStrategyIp")
					: t("summaryStrategySession");

	return (
		<div className="rounded-2xl bg-muted/50 p-4">
			<div className="flex items-center gap-2">
				<UserCheck className="size-4 text-muted-foreground" />
				<span className="font-medium text-sm">{t("currentSettings")}</span>
			</div>
			<p className="text-muted-foreground text-sm">
				{t("summarySentence", { mode: modeText, strategy: strategyText })}
				{duplicatePrevention.allowOverride && (
					<span className="text-orange-600">
						{" "}
						{t("summaryOverrideEnabled")}
					</span>
				)}
			</p>
		</div>
	);
}
