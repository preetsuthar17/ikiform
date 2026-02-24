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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import type { RateLimitSectionProps } from "../types";

export function RateLimitSection({
	localSettings,
	updateRateLimit,
	formId,
	schema,
	onSchemaUpdate,
}: RateLimitSectionProps & {
	onSchemaUpdate?: (updates: Partial<any>) => void;
}) {
	const t = useTranslations("product.formBuilder.formSettings.rateLimitSection");
	const tCommon = useTranslations("product.formBuilder.formSettings.common");
	const localizeLegacyDefault = (
		value: string | undefined,
		legacyDefault: string,
		localizedDefault: string
	) => {
		if (!value || value === legacyDefault) return localizedDefault;
		return value;
	};

	const [rateLimitSettings, setRateLimitSettings] = useState({
		enabled: localSettings.rateLimit?.enabled,
		maxSubmissions: localSettings.rateLimit?.maxSubmissions || 5,
		timeWindow: localSettings.rateLimit?.timeWindow || 10,
		blockDuration: localSettings.rateLimit?.blockDuration || 60,
		message:
			localizeLegacyDefault(
				localSettings.rateLimit?.message,
				"Too many submissions. Please try again later.",
				t("defaultMessage")
			),
	});

	const [saving, setSaving] = useState(false);
	const [saved, setSaved] = useState(false);
	const [hasChanges, setHasChanges] = useState(false);

	const rateLimitRef = useRef<HTMLDivElement>(null);

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

	const handleRateLimitChange = (field: string, value: any) => {
		setRateLimitSettings((prev) => ({ ...prev, [field]: value }));
		setSaved(false);
		setHasChanges(true);
	};

	const resetSettings = () => {
		setRateLimitSettings({
			enabled: localSettings.rateLimit?.enabled,
			maxSubmissions: localSettings.rateLimit?.maxSubmissions || 5,
			timeWindow: localSettings.rateLimit?.timeWindow || 10,
			blockDuration: localSettings.rateLimit?.blockDuration || 60,
			message:
				localizeLegacyDefault(
					localSettings.rateLimit?.message,
					"Too many submissions. Please try again later.",
					t("defaultMessage")
				),
		});
		setHasChanges(false);
	};

	const saveRateLimit = async () => {
		if (!formId) {
			toast.error(tCommon("formIdRequiredToSaveSettings"));
			return;
		}

		setSaving(true);
		try {
			const trimmed = {
				...rateLimitSettings,
				message: (rateLimitSettings.message || "").trim(),
			};
			if (onSchemaUpdate) {
				await onSchemaUpdate({
					settings: {
						...schema.settings,
						rateLimit: trimmed,
					},
				});
			}
			updateRateLimit(trimmed);
			setSaved(true);
			setHasChanges(false);
			toast.success(t("saved"));

			setTimeout(() => setSaved(false), 2000);
		} catch (error) {
			console.error("Error saving rate limit:", error);
			toast.error(t("saveFailed"));
		} finally {
			setSaving(false);
		}
	};

	useEffect(() => {
		if (rateLimitRef.current) {
			const firstInput = rateLimitRef.current.querySelector(
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
		<ScrollArea
			className="size-full h-full"
			style={{
				overscrollBehavior: "contain",
			}}
		>
			<div
				aria-label={t("ariaSettings")}
				className="flex flex-col gap-4"
				onKeyDown={(e) => {
					const target = e.target as HTMLElement;
					const isTextarea = target.tagName === "TEXTAREA";
					if (isTextarea && e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
						e.preventDefault();
						saveRateLimit();
					}
				}}
				role="main"
			>
				<Card
					aria-labelledby="rate-limit-title"
					className="shadow-none"
					ref={rateLimitRef}
					role="region"
				>
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle
									className="flex items-center gap-2 text-lg"
									id="rate-limit-title"
								>
									{t("title")}{" "}
									{hasChanges && (
										<Badge className="gap-2" variant="secondary">
											<div className="size-2 rounded-full bg-orange-500" />
											{tCommon("unsavedChanges")}
										</Badge>
									)}
								</CardTitle>
								<CardDescription id="rate-limit-description">
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
									htmlFor="rate-limit-enabled"
								>
									{t("enableLabel")}
								</Label>
								<p className="text-muted-foreground text-xs">
									{t("enableDescription")}
								</p>
							</div>
							<Switch
								aria-describedby="rate-limit-description"
								checked={rateLimitSettings.enabled}
								id="rate-limit-enabled"
								onCheckedChange={(checked) =>
									handleRateLimitChange("enabled", checked)
								}
							/>
						</div>

						{rateLimitSettings.enabled && (
							<div className="flex flex-col gap-6">
								<div className="flex flex-col gap-4">
									<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
										<RateLimitField
											description={t("maxSubmissionsDescription")}
											id="max-submissions"
											invalidMessage={tCommon("validValueBetween", {
												max: 100,
												min: 1,
											})}
											label={t("maxSubmissionsLabel")}
											max={100}
											min={1}
											onChange={(value) =>
												handleRateLimitChange("maxSubmissions", value)
											}
											placeholder="5"
											required
											value={rateLimitSettings.maxSubmissions}
										/>
										<RateLimitField
											description={t("timeWindowDescription")}
											id="time-window"
											invalidMessage={tCommon("validValueBetween", {
												max: 1440,
												min: 1,
											})}
											label={t("timeWindowLabel")}
											max={1440}
											min={1}
											onChange={(value) =>
												handleRateLimitChange("timeWindow", value)
											}
											placeholder="10"
											required
											value={rateLimitSettings.timeWindow}
										/>
									</div>

									<RateLimitField
										description={t("blockDurationDescription")}
										id="block-duration"
										invalidMessage={tCommon("validValueBetween", {
											max: 10_080,
											min: 1,
										})}
										label={t("blockDurationLabel")}
										max={10_080}
										min={1}
										onChange={(value) =>
											handleRateLimitChange("blockDuration", value)
										}
										placeholder="60"
										required
										value={rateLimitSettings.blockDuration}
									/>

									<div
										aria-labelledby="rate-limit-message-label"
										className="flex flex-col gap-2"
										role="group"
									>
										<Label
											className="font-medium text-sm"
											htmlFor="rate-limit-message"
											id="rate-limit-message-label"
										>
											{t("messageLabel")}
										</Label>
										<Textarea
											className="resize-none text-base shadow-none focus:ring-2 focus:ring-ring focus:ring-offset-1 md:text-sm"
											id="rate-limit-message"
											name="rate-limit-message"
											onChange={(e) =>
												handleRateLimitChange("message", e.target.value)
											}
											onKeyDown={(e) => {
												if (e.key === "Escape") {
													(e.target as HTMLElement).blur();
												}
											}}
											placeholder={t("messagePlaceholder")}
											rows={2}
											value={rateLimitSettings.message}
										/>
										<p className="text-muted-foreground text-xs">
											{t("messageDescription")}
										</p>
									</div>
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
											{t("summarySentence", {
												blockDuration: rateLimitSettings.blockDuration,
												maxSubmissions: rateLimitSettings.maxSubmissions,
												timeWindow: rateLimitSettings.timeWindow,
											})}
										</p>
										<div className="text-muted-foreground text-xs">
											<p>
												{t("summaryExample", {
													blockDuration: rateLimitSettings.blockDuration,
													maxSubmissions: rateLimitSettings.maxSubmissions,
													timeWindow: rateLimitSettings.timeWindow,
												})}
											</p>
										</div>
									</div>
								</div>
							</div>
						)}

						{!rateLimitSettings.enabled && (
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
									aria-describedby="rate-limit-description"
									aria-label={t("saveAria")}
									disabled={saving || !hasChanges}
									loading={saving}
									onClick={saveRateLimit}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											e.preventDefault();
											saveRateLimit();
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
		</ScrollArea>
	);
}

function RateLimitField({
	id,
	label,
	value,
	min,
	max,
	placeholder,
	description,
	invalidMessage,
	onChange,
	required = false,
}: {
	id: string;
	label: string;
	value: number;
	min: number;
	max: number;
	placeholder: string;
	description: string;
	invalidMessage: string;
	onChange: (value: number) => void;
	required?: boolean;
}) {
	const fieldId = `${id}-field`;
	const descriptionId = `${id}-description`;

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Escape") {
			(e.target as HTMLElement).blur();
		}
	};

	return (
		<div
			aria-labelledby={`${fieldId}-label`}
			className="flex flex-col gap-2"
			role="group"
		>
			<Label
				className="font-medium text-sm"
				htmlFor={fieldId}
				id={`${fieldId}-label`}
			>
				{label}
				{required && (
					<span aria-label="required" className="ml-1 text-destructive">
						*
					</span>
				)}
			</Label>
			<Input
				aria-describedby={descriptionId}
				aria-invalid={required && (!value || value < min || value > max)}
				aria-required={required}
				className="text-base shadow-none focus:ring-2 focus:ring-ring focus:ring-offset-1 md:text-sm"
				id={fieldId}
				max={max}
				min={min}
				name={id}
				onChange={(e) => onChange(Number.parseInt(e.target.value) || min)}
				onKeyDown={handleKeyDown}
				placeholder={placeholder}
				required={required}
				type="number"
				value={value}
			/>
			<p className="text-muted-foreground text-xs" id={descriptionId}>
				{description}
			</p>
			{required && (!value || value < min || value > max) && (
				<p className="text-destructive text-xs" role="alert">
					{invalidMessage}
				</p>
			)}
		</div>
	);
}
