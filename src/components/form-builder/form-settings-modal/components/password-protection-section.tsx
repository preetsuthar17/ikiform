import { Eye, EyeOff } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface PasswordProtectionSectionProps {
	localSettings: any;
	updatePasswordProtection: (updates: any) => void;
	formId?: string;
	schema?: any;
}

export function PasswordProtectionSection({
	localSettings,
	updatePasswordProtection,
	formId,
	schema,
	onSchemaUpdate,
}: PasswordProtectionSectionProps & {
	onSchemaUpdate?: (updates: Partial<any>) => void;
}) {
	const t = useTranslations(
		"product.formBuilder.formSettings.passwordProtectionSection"
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
	const [showPassword, setShowPassword] = useState(false);
	const [passwordProtectionSettings, setPasswordProtectionSettings] = useState({
		enabled: localSettings.passwordProtection?.enabled,
		password: localSettings.passwordProtection?.password || "",
		message: localizeLegacyDefault(
			localSettings.passwordProtection?.message,
			"This form is password protected. Please enter the password to continue.",
			t("defaultMessage")
		),
	});

	const [saving, setSaving] = useState(false);
	const [saved, setSaved] = useState(false);
	const [hasChanges, setHasChanges] = useState(false);

	const passwordProtectionRef = useRef<HTMLDivElement>(null);

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

	const handlePasswordProtectionChange = (field: string, value: any) => {
		setPasswordProtectionSettings((prev) => ({ ...prev, [field]: value }));
		setSaved(false);
		setHasChanges(true);
	};

	const resetSettings = () => {
		setPasswordProtectionSettings({
			enabled: localSettings.passwordProtection?.enabled,
			password: localSettings.passwordProtection?.password || "",
			message: localizeLegacyDefault(
				localSettings.passwordProtection?.message,
				"This form is password protected. Please enter the password to continue.",
				t("defaultMessage")
			),
		});
		setHasChanges(false);
	};

	const savePasswordProtection = async () => {
		if (!formId) {
			toast.error(tCommon("formIdRequiredToSaveSettings"));
			return;
		}

		setSaving(true);
		try {
			const trimmed = {
				...passwordProtectionSettings,
				password: passwordProtectionSettings.password.trim(),
				message: passwordProtectionSettings.message.trim(),
			};
			if (onSchemaUpdate) {
				await onSchemaUpdate({
					settings: {
						...schema.settings,
						passwordProtection: trimmed,
					},
				});
			}
			updatePasswordProtection(trimmed);
			setSaved(true);
			setHasChanges(false);
			toast.success(t("saved"));

			setTimeout(() => setSaved(false), 2000);
		} catch (error) {
			console.error("Error saving password protection:", error);
			toast.error(t("saveFailed"));
		} finally {
			setSaving(false);
		}
	};

	useEffect(() => {
		if (passwordProtectionRef.current) {
			const firstInput = passwordProtectionRef.current.querySelector(
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
					savePasswordProtection();
				}
			}}
			role="main"
			style={{
				overscrollBehavior: "contain",
			}}
		>
			<Card
				aria-labelledby="password-protection-title"
				className="shadow-none"
				ref={passwordProtectionRef}
				role="region"
			>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle
								className="flex items-center gap-2 text-lg tracking-tight"
								id="password-protection-title"
							>
								{t("title")}{" "}
								{hasChanges && (
									<Badge className="gap-2" variant="secondary">
										<div className="size-2 rounded-full bg-orange-500" />
										{tCommon("unsavedChanges")}
									</Badge>
								)}
							</CardTitle>
							<CardDescription id="password-protection-description">
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
								htmlFor="password-protection-enabled"
							>
								{t("enableLabel")}
							</Label>
							<p
								className="text-muted-foreground text-xs"
								id="password-protection-enabled-description"
							>
								{t("enableDescription")}
							</p>
						</div>
						<Switch
							aria-describedby="password-protection-enabled-description"
							checked={passwordProtectionSettings.enabled}
							id="password-protection-enabled"
							onCheckedChange={(checked) =>
								handlePasswordProtectionChange("enabled", checked)
							}
						/>
					</div>

					{passwordProtectionSettings.enabled && (
						<div className="flex flex-col gap-6">
							<div className="flex flex-col gap-4">
								<div className="flex flex-col gap-2">
									<Label
										className="font-medium text-sm"
										htmlFor="form-password"
									>
										{t("passwordLabel")}
									</Label>
									<div className="relative">
										<Input
											autoComplete="new-password"
											className="pr-10 text-base shadow-none focus:ring-2 focus:ring-ring focus:ring-offset-1 md:text-sm"
											id="form-password"
											name="form-password"
											onChange={(e) =>
												handlePasswordProtectionChange(
													"password",
													e.target.value
												)
											}
											onKeyDown={(e) => {
												if (e.key === "Escape") {
													(e.target as HTMLElement).blur();
												}
											}}
											placeholder={t("passwordPlaceholder")}
											type={showPassword ? "text" : "password"}
											value={passwordProtectionSettings.password}
										/>
										<Button
											aria-label={
												showPassword
													? t("hidePasswordAria")
													: t("showPasswordAria")
											}
											className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
											onClick={() => setShowPassword(!showPassword)}
											size="sm"
											type="button"
											variant="ghost"
										>
											{showPassword ? (
												<EyeOff aria-hidden="true" className="size-4" />
											) : (
												<Eye aria-hidden="true" className="size-4" />
											)}
										</Button>
									</div>
									<p className="text-muted-foreground text-xs">
										{t("passwordDescription")}
									</p>
								</div>

								<div className="flex flex-col gap-2">
									<Label
										className="font-medium text-sm"
										htmlFor="password-message"
									>
										{t("customMessageLabel")}
									</Label>
									<Textarea
										className="resize-none text-base shadow-none focus:ring-2 focus:ring-ring focus:ring-offset-1 md:text-sm"
										id="password-message"
										name="password-message"
										onChange={(e) =>
											handlePasswordProtectionChange("message", e.target.value)
										}
										onKeyDown={(e) => {
											if (e.key === "Escape") {
												(e.target as HTMLElement).blur();
											}
										}}
										placeholder={t("customMessagePlaceholder")}
										rows={2}
										value={passwordProtectionSettings.message}
									/>
									<p className="text-muted-foreground text-xs">
										{t("customMessageDescription")}
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
										{t("summaryPrefix")}{" "}
										<span className="font-semibold text-foreground">
											{t("enabled")}
										</span>
										{t("summarySuffix")}
									</p>
								</div>
							</div>
						</div>
					)}

					{!passwordProtectionSettings.enabled && (
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
								aria-describedby="password-protection-description"
								aria-label={t("saveAria")}
								disabled={saving || !hasChanges}
								loading={saving}
								onClick={savePasswordProtection}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										savePasswordProtection();
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
