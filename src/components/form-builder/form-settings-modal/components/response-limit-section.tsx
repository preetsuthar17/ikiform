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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

export function ResponseLimitSection({
	localSettings,
	updateResponseLimit,
	formId,
	schema,
	onSchemaUpdate,
}: {
	localSettings: any;
	updateResponseLimit: (updates: Partial<any>) => void;
	formId?: string;
	schema?: any;
	onSchemaUpdate?: (updates: Partial<any>) => void;
}) {
	const t = useTranslations(
		"product.formBuilder.formSettings.responseLimitSection"
	);
	const tCommon = useTranslations("product.formBuilder.formSettings.common");
	const localizeLegacyDefault = (
		value: string | undefined,
		legacyDefault: string,
		localizedDefault: string
	) => {
		if (!value || value === legacyDefault) return localizedDefault;
		return value;
	};

	const [settings, setSettings] = useState({
		enabled: !!localSettings.responseLimit?.enabled,
		maxResponses: localSettings.responseLimit?.maxResponses || 100,
		message:
			localizeLegacyDefault(
				localSettings.responseLimit?.message,
				"This form is no longer accepting responses.",
				t("defaultMessage")
			),
	});

	const [saving, setSaving] = useState(false);
	const [saved, setSaved] = useState(false);
	const [hasChanges, setHasChanges] = useState(false);

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

	const handleChange = (field: string, value: any) => {
		setSettings((prev) => ({ ...prev, [field]: value }));
		setSaved(false);
		setHasChanges(true);
	};

	const reset = () => {
		setSettings({
			enabled: !!localSettings.responseLimit?.enabled,
			maxResponses: localSettings.responseLimit?.maxResponses || 100,
			message:
				localizeLegacyDefault(
					localSettings.responseLimit?.message,
					"This form is no longer accepting responses.",
					t("defaultMessage")
				),
		});
		setHasChanges(false);
	};

	const save = async () => {
		if (!formId) {
			toast.error(tCommon("formIdRequiredToSaveSettings"));
			return;
		}
		setSaving(true);
		try {
			const trimmed = {
				...settings,
				message: (settings.message || "").trim(),
			};
			if (onSchemaUpdate) {
				await onSchemaUpdate({
					settings: {
						...schema.settings,
						responseLimit: trimmed,
					},
				});
			}
			updateResponseLimit(trimmed);
			setSaved(true);
			setHasChanges(false);
			toast.success(t("saved"));

			setTimeout(() => setSaved(false), 2000);
		} catch (error) {
			console.error("Error saving response limit:", error);
			toast.error(t("saveFailed"));
		} finally {
			setSaving(false);
		}
	};

	useEffect(() => {
		if (sectionRef.current) {
			const firstInput = sectionRef.current.querySelector(
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
		<Card
			aria-labelledby="response-limit-title"
			className="shadow-none"
			onKeyDown={(e) => {
				const target = e.target as HTMLElement;
				const isTextarea = target.tagName === "TEXTAREA";
				if (isTextarea && e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
					e.preventDefault();
					save();
				}
			}}
			ref={sectionRef}
			role="region"
			style={{
				overscrollBehavior: "contain",
			}}
		>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle
							className="flex items-center gap-2 text-lg"
							id="response-limit-title"
						>
							{t("title")}{" "}
							{hasChanges && (
								<Badge className="gap-2" variant="secondary">
									<div className="size-2 rounded-full bg-orange-500" />
									{tCommon("unsavedChanges")}
								</Badge>
							)}
						</CardTitle>
						<CardDescription>
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
							htmlFor="response-limit-enabled"
						>
							{t("enableLabel")}
						</Label>
						<p className="text-muted-foreground text-xs">
							{t("enableDescription")}
						</p>
					</div>
					<Switch
						aria-describedby="response-limit-enabled-description"
						checked={settings.enabled}
						id="response-limit-enabled"
						onCheckedChange={(checked) => handleChange("enabled", checked)}
					/>
				</div>

				{settings.enabled && (
					<div className="flex flex-col gap-6">
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<ResponseLimitField
								description={t("maxResponsesDescription")}
								id="max-responses"
								invalidMessage={tCommon("validValueBetween", {
									max: 1_000_000,
									min: 1,
								})}
								label={t("maxResponsesLabel")}
								max={1_000_000}
								min={1}
								onChange={(value) => handleChange("maxResponses", value)}
								placeholder="100"
								required
								value={settings.maxResponses}
							/>
						</div>

						<div
							aria-labelledby="response-limit-message-label"
							className="flex flex-col gap-2"
							role="group"
						>
							<Label
								className="font-medium text-sm"
								htmlFor="response-limit-message"
								id="response-limit-message-label"
							>
								{t("limitReachedLabel")}
							</Label>
							<Textarea
								className="resize-none text-base shadow-none focus:ring-2 focus:ring-ring focus:ring-offset-1 md:text-sm"
								id="response-limit-message"
								name="response-limit-message"
								onChange={(e) => handleChange("message", e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Escape") {
										(e.target as HTMLElement).blur();
									}
								}}
								placeholder={t("limitReachedPlaceholder")}
								rows={2}
								value={settings.message}
							/>
							<p className="text-muted-foreground text-xs">
								{t("limitReachedDescription")}
							</p>
						</div>
					</div>
				)}

				{!settings.enabled && (
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
								onClick={reset}
								size="sm"
								variant="ghost"
							>
								{tCommon("reset")}
							</Button>
						)}
					</div>
					<div className="flex items-center gap-2">
						<Button
							aria-label={t("saveAria")}
							disabled={saving || !hasChanges}
							loading={saving}
							onClick={save}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									save();
								}
							}}
						>
							{tCommon("save")}
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

function ResponseLimitField({
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
