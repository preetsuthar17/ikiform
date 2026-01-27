import { UserCheck } from "lucide-react";
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
	const [duplicatePreventionSettings, setDuplicatePreventionSettings] =
		useState({
			enabled: localSettings.duplicatePrevention?.enabled,
			strategy: localSettings.duplicatePrevention?.strategy || "combined",
			mode: localSettings.duplicatePrevention?.mode || "one-time",
			message:
				localSettings.duplicatePrevention?.message ||
				"You have already submitted this form. Each user can only submit once.",
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
			message:
				localSettings.duplicatePrevention?.message ||
				"You have already submitted this form. Each user can only submit once.",
			timeWindow: localSettings.duplicatePrevention?.timeWindow || 1440,
			maxAttempts: localSettings.duplicatePrevention?.maxAttempts || 1,
			allowOverride: localSettings.duplicatePrevention?.allowOverride,
		});
		setHasChanges(false);
	};

	const saveDuplicatePrevention = async () => {
		if (!formId) {
			toast.error("Form ID is required to save settings");
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
			toast.success("Duplicate prevention settings saved successfully");

			setTimeout(() => setSaved(false), 2000);
		} catch (error) {
			console.error("Error saving duplicate prevention:", error);
			toast.error("Failed to save duplicate prevention settings");
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
			announcement.textContent =
				"Duplicate prevention settings saved successfully";
			document.body.appendChild(announcement);

			setTimeout(() => {
				document.body.removeChild(announcement);
			}, 1000);
		}
	}, [saved]);

	return (
		<div
			aria-label="Duplicate prevention settings"
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
								Duplicate Prevention{" "}
								{hasChanges && (
									<Badge className="gap-2" variant="secondary">
										<div className="size-2 rounded-full bg-orange-500" />
										Unsaved changes
									</Badge>
								)}
							</CardTitle>
							<CardDescription id="duplicate-prevention-description">
								Prevent users from submitting the same form multiple times
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
								Enable Duplicate Prevention
							</Label>
							<p
								className="text-muted-foreground text-xs"
								id="duplicate-prevention-enabled-description"
							>
								Prevent users from submitting the same form multiple times
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
									updateSettings={handleDuplicatePreventionChange}
								/>
								<PreventionStrategySection
									duplicatePrevention={duplicatePreventionSettings}
									updateSettings={handleDuplicatePreventionChange}
								/>
								{duplicatePreventionSettings.mode === "time-based" && (
									<TimeBasedSettingsSection
										duplicatePrevention={duplicatePreventionSettings}
										updateSettings={handleDuplicatePreventionChange}
									/>
								)}
								<ErrorMessageSection
									duplicatePrevention={duplicatePreventionSettings}
									updateSettings={handleDuplicatePreventionChange}
								/>
								<OverrideSection
									duplicatePrevention={duplicatePreventionSettings}
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
										Current Configuration
									</h4>
									<DuplicatePreventionSummary
										duplicatePrevention={duplicatePreventionSettings}
									/>
								</div>
							</div>
						</div>
					)}

					{!duplicatePreventionSettings.enabled && (
						<div className="rounded-lg bg-muted/30 p-4">
							<p className="text-muted-foreground text-sm">
								Duplicate prevention helps maintain data quality by preventing
								users from submitting the same form multiple times. Choose
								between time-based prevention or one-time submission mode.
							</p>
						</div>
					)}

					<div
						aria-label="Duplicate prevention actions"
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
									Reset
								</Button>
							)}
						</div>
						<div className="flex items-center gap-2">
							<Button
								aria-describedby="duplicate-prevention-description"
								aria-label="Save duplicate prevention settings"
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
								Save
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
	updateSettings,
}: {
	duplicatePrevention: any;
	updateSettings: (field: string, value: any) => void;
}) {
	return (
		<div className="flex flex-col gap-2">
			<Label className="font-medium text-sm">Prevention Mode</Label>
			<RadioGroup
				onValueChange={(value) => {
					updateSettings("mode", value as "time-based" | "one-time");
					updateSettings(
						"message",
						value === "one-time"
							? "You have already submitted this form. Each user can only submit once."
							: "You have already submitted this form. Please wait before submitting again."
					);
				}}
				value={duplicatePrevention.mode || "one-time"}
			>
				<div className="flex flex-col gap-2">
					<div className="flex items-center gap-2">
						<RadioGroupItem id="one-time" value="one-time" />
						<Label className="text-sm" htmlFor="one-time">
							One-time submission
						</Label>
					</div>
					<div className="flex items-start gap-2">
						<div className="size-4" />
						<p className="text-muted-foreground text-xs">
							Allow only one submission per user, ever
						</p>
					</div>

					<div className="flex items-center gap-2">
						<RadioGroupItem id="time-based" value="time-based" />
						<Label className="text-sm" htmlFor="time-based">
							Time-based prevention
						</Label>
					</div>
					<div className="flex items-start gap-2">
						<div className="size-4" />
						<p className="text-muted-foreground text-xs">
							Prevent duplicate submissions within a specified time window
						</p>
					</div>
				</div>
			</RadioGroup>
		</div>
	);
}

function PreventionStrategySection({
	duplicatePrevention,
	updateSettings,
}: {
	duplicatePrevention: any;
	updateSettings: (field: string, value: any) => void;
}) {
	return (
		<div className="flex flex-col gap-2">
			<Label className="font-medium text-sm">Prevention Strategy</Label>
			<Select
				onValueChange={(value: "ip" | "email" | "session" | "combined") =>
					updateSettings("strategy", value)
				}
				value={duplicatePrevention.strategy || "combined"}
			>
				<SelectTrigger>
					<SelectValue placeholder="Select strategy" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="combined">
						Combined (IP + Email + Session) - Most Secure
					</SelectItem>
					<SelectItem value="email">
						Email Address - Best for Registration
					</SelectItem>
					<SelectItem value="ip">IP Address - Simple & Reliable</SelectItem>
					<SelectItem value="session">Session ID - Browser-based</SelectItem>
				</SelectContent>
			</Select>
			<p className="text-muted-foreground text-xs">
				{duplicatePrevention.strategy === "combined" &&
					"Track by combination of IP, email, and session for maximum accuracy"}
				{duplicatePrevention.strategy === "email" &&
					"Track by email address (requires email field in form)"}
				{duplicatePrevention.strategy === "ip" && "Track by IP address only"}
				{duplicatePrevention.strategy === "session" &&
					"Track by browser session"}
			</p>
		</div>
	);
}

function TimeBasedSettingsSection({
	duplicatePrevention,
	updateSettings,
}: {
	duplicatePrevention: any;
	updateSettings: (field: string, value: any) => void;
}) {
	return (
		<div className="grid grid-cols-2 gap-4">
			<DuplicatePreventionInput
				description="How long to prevent duplicate submissions"
				id="time-window"
				label="Time Window (minutes)"
				max={10_080}
				min={1}
				onChange={(value) => updateSettings("timeWindow", value)}
				placeholder="1440"
				value={duplicatePrevention.timeWindow || 1440}
			/>
			<DuplicatePreventionInput
				description="Maximum attempts allowed within time window"
				id="max-attempts"
				label="Max Attempts"
				max={10}
				min={1}
				onChange={(value) => updateSettings("maxAttempts", value)}
				placeholder="1"
				value={duplicatePrevention.maxAttempts || 1}
			/>
		</div>
	);
}

function ErrorMessageSection({
	duplicatePrevention,
	updateSettings,
}: {
	duplicatePrevention: any;
	updateSettings: (field: string, value: any) => void;
}) {
	return (
		<div className="flex flex-col gap-2">
			<Label htmlFor="duplicate-message">Error Message</Label>
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
						? "You have already submitted this form. Each user can only submit once."
						: "You have already submitted this form. Please wait before submitting again."
				}
				rows={2}
				value={
					duplicatePrevention.message ||
					(duplicatePrevention.mode === "one-time"
						? "You have already submitted this form. Each user can only submit once."
						: "You have already submitted this form. Please wait before submitting again.")
				}
			/>
			<p className="text-muted-foreground text-xs">
				Message shown to users when they try to submit a duplicate
			</p>
		</div>
	);
}

function OverrideSection({
	duplicatePrevention,
	updateSettings,
}: {
	duplicatePrevention: any;
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
					Allow Override
				</Label>
				<p className="text-muted-foreground text-xs">
					Allow users to bypass prevention (not recommended)
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
}: {
	duplicatePrevention: any;
}) {
	const modeText =
		duplicatePrevention.mode === "one-time"
			? "one-time submission only"
			: `${duplicatePrevention.maxAttempts || 1} submission(s) every ${duplicatePrevention.timeWindow || 1440} minutes`;

	const strategyText =
		duplicatePrevention.strategy === "combined"
			? "IP + Email + Session"
			: duplicatePrevention.strategy === "email"
				? "Email Address"
				: duplicatePrevention.strategy === "ip"
					? "IP Address"
					: "Session ID";

	return (
		<div className="rounded-2xl bg-muted/50 p-4">
			<div className="flex items-center gap-2">
				<UserCheck className="size-4 text-muted-foreground" />
				<span className="font-medium text-sm">Current Settings</span>
			</div>
			<p className="text-muted-foreground text-sm">
				<span className="font-medium">{modeText}</span> using{" "}
				<span className="font-medium">{strategyText}</span> tracking.
				{duplicatePrevention.allowOverride && (
					<span className="text-orange-600"> Override is enabled.</span>
				)}
			</p>
		</div>
	);
}
