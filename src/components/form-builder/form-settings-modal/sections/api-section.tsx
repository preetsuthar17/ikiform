"use client";

import {
	Code,
	Copy,
	Download,
	Eye,
	EyeOff,
	Key,
	RefreshCw,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { getAllFields } from "@/components/form-builder/form-builder/utils";
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
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { formsDb } from "@/lib/database";
import {
	isRangeSliderMode,
	normalizeRangeSliderValue,
	normalizeSingleSliderValue,
} from "@/lib/fields/slider-utils";
import {
	generateFormApiKey,
	revokeFormApiKey,
	toggleFormApiEnabled,
} from "@/lib/forms/api-keys";
import type { ApiSectionProps } from "../types";

export function ApiSection({
	localSettings,
	updateApi,
	formId,
	schema,
}: ApiSectionProps) {
	const t = useTranslations("product.formBuilder.formSettings.apiSection");
	const tCommon = useTranslations("product.formBuilder.formSettings.common");
	const { user } = useAuth();
	const [showApiKey, setShowApiKey] = useState(false);
	const [isGenerating, setIsGenerating] = useState(false);
	const [isRevoking, setIsRevoking] = useState(false);
	const [showCodeGenerator, setShowCodeGenerator] = useState(false);
	const [draftEnabled, setDraftEnabled] = useState<boolean>(
		!!localSettings.api?.enabled
	);
	const [saving, setSaving] = useState(false);
	const [saved, setSaved] = useState(false);
	const [hasChanges, setHasChanges] = useState(false);
	const sectionRef = useRef<HTMLDivElement>(null);

	const apiSettings = localSettings.api || {};

	const hasApiKey = !!apiSettings.apiKey;

	const onToggleEnabled = (enabled: boolean) => {
		setDraftEnabled(enabled);
		setSaved(false);
		setHasChanges(true);
	};

	const resetChanges = () => {
		setDraftEnabled(!!localSettings.api?.enabled);
		setHasChanges(false);
	};

	const saveChanges = async () => {
		if (!formId) {
			toast.error(tCommon("formIdRequiredToSaveSettings"));
			return;
		}
		setSaving(true);
		try {
			await toggleFormApiEnabled(formId, draftEnabled);
			updateApi({ enabled: draftEnabled });
			setSaved(true);
			setHasChanges(false);
			toast.success(t("settingsSaved"));
		} catch (error) {
			toast.error(t("settingsSaveFailed"));
		} finally {
			setSaving(false);
		}
	};

	const handleGenerateApiKey = async () => {
		if (!formId) return;
		if (!user) {
			toast.error(t("authRequired"));
			return;
		}

		setIsGenerating(true);
		try {
			const result = await generateFormApiKey(formId);
			if (result.success && result.apiKey) {
				const newSchema = {
					...schema,
					settings: {
						...schema?.settings,
						api: {
							...(schema?.settings?.api || {}),
							apiKey: result.apiKey,
							enabled: true,
						},
					},
				};
				await formsDb.updateForm(formId, user.id, { schema: newSchema as any });
				updateApi({ apiKey: result.apiKey, enabled: true });
				setDraftEnabled(true);
				setSaved(true);
				toast.success(t("keyGenerated"));
			} else {
				toast.error(result.error || t("keyGenerateFailed"));
			}
		} catch (error) {
			toast.error(t("keyGenerateFailed"));
		} finally {
			setIsGenerating(false);
		}
	};

	const handleRevokeApiKey = async () => {
		if (!formId) return;
		if (!user) {
			toast.error(t("authRequired"));
			return;
		}

		setIsRevoking(true);
		try {
			const result = await revokeFormApiKey(formId);
			if (result.success) {
				const newSchema = {
					...schema,
					settings: {
						...schema?.settings,
						api: {
							...(schema?.settings?.api || {}),
							apiKey: undefined,
							enabled: false,
						},
					},
				};
				await formsDb.updateForm(formId, user.id, { schema: newSchema as any });
				updateApi({ apiKey: undefined, enabled: false });
				setDraftEnabled(false);
				setSaved(true);
				toast.success(t("keyRevoked"));
			} else {
				toast.error(result.error || t("keyRevokeFailed"));
			}
		} catch (error) {
			toast.error(t("keyRevokeFailed"));
		} finally {
			setIsRevoking(false);
		}
	};

	const handleCopyApiKey = () => {
		if (apiSettings.apiKey) {
			navigator.clipboard.writeText(apiSettings.apiKey);
			toast.success(t("keyCopied"));
		}
	};

	const handleCopyEndpoint = () => {
		if (formId) {
			const endpoint = `${window.location.origin}/api/forms/${formId}/api-submit`;
			navigator.clipboard.writeText(endpoint);
			toast.success(t("endpointCopied"));
		}
	};

	const generateCodeExamples = () => {
		if (!(formId && apiSettings.apiKey)) return {};

		const endpoint = `${window.location.origin}/api/forms/${formId}/api-submit`;
		const apiKey = apiSettings.apiKey;

		const formFields = schema ? getAllFields(schema) : [];
		const sampleData: Record<string, any> = {};

		formFields.forEach((field: any) => {
			switch (field.type) {
				case "text":
				case "email":
					sampleData[field.id] =
						field.type === "email" ? t("sampleEmail") : t("sampleName");
					break;
				case "textarea":
					sampleData[field.id] = t("sampleMessage");
					break;
				case "number":
					sampleData[field.id] = 42;
					break;
				case "select":
				case "radio":
					sampleData[field.id] = field.options?.[0]?.value || "option1";
					break;
				case "checkbox":
					sampleData[field.id] = field.options?.[0]?.value || "option1";
					break;
				case "date":
					sampleData[field.id] = "2024-01-15";
					break;
				case "time":
					sampleData[field.id] = "14:30";
					break;
				case "rating":
					sampleData[field.id] = 5;
					break;
				case "slider":
					if (isRangeSliderMode(field.settings)) {
						const rangeSample = normalizeRangeSliderValue(field.settings);
						sampleData[field.id] = {
							min: rangeSample.min,
							max: rangeSample.max,
						};
					} else {
						sampleData[field.id] = normalizeSingleSliderValue(field.settings);
					}
					break;
				default:
					sampleData[field.id] = t("sampleValue");
			}
		});

		const dataString = JSON.stringify(sampleData, null, 2);
		const dataStringSingleLine = JSON.stringify(sampleData);

		return {
			curl: `curl -X POST "${endpoint}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -d '{
    "data": ${dataStringSingleLine}
  }'`,

			javascript: `const response = await fetch('${endpoint}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${apiKey}'
  },
  body: JSON.stringify({
    data: ${dataString}
  })
});

const result = await response.json();
console.log(result);`,

			python: `import requests

url = '${endpoint}'
headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${apiKey}'
}
data = {
    'data': ${dataString}
}

response = requests.post(url, json=data, headers=headers)
result = response.json()
print(result)`,

			php: `<?php
$url = '${endpoint}';
$headers = [
    'Content-Type: 'application/json',
    'Authorization': 'Bearer ${apiKey}'
];
$data = [
    'data' => ${dataString.replace(/"/g, '"')}
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);
print_r($result);
?>`,
		};
	};

	const handleDownloadCode = (language: string, code: string) => {
		const blob = new Blob([code], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `form-api-${language}.${language === "javascript" ? "js" : language === "curl" ? "sh" : language}`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);

		toast.success(t("codeDownloaded", { language }));
	};

	useEffect(() => {
		if (saved) {
			const announcement = document.createElement("div");
			announcement.setAttribute("aria-live", "polite");
			announcement.setAttribute("aria-atomic", "true");
			announcement.className = "sr-only";
			announcement.textContent = t("settingsSaved");
			document.body.appendChild(announcement);

			setTimeout(() => {
				document.body.removeChild(announcement);
			}, 1000);
		}
	}, [saved, t]);

	useEffect(() => {
		if (sectionRef.current) {
			const firstInteractive = sectionRef.current.querySelector(
				"input, textarea, select, button, [tabindex]:not([tabindex='-1'])"
			) as HTMLElement | null;
			firstInteractive?.focus();
		}
	}, []);

	return (
		<Card
			aria-labelledby="api-access-title"
			className="shadow-none"
			ref={sectionRef}
			role="region"
		>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle
							className="flex items-center gap-2 text-lg tracking-tight"
							id="api-access-title"
						>
							{t("title")}{" "}
							{hasChanges && (
								<Badge className="gap-2" variant="secondary">
									<div className="size-2 rounded-full bg-orange-500" />
									{tCommon("unsavedChanges")}
								</Badge>
							)}
							<Badge variant="secondary">{t("betaBadge")}</Badge>
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
						<Label className="font-medium text-sm" htmlFor="api-enabled">
							{t("enableSupportLabel")}
						</Label>
						<p
							className="text-muted-foreground text-xs"
							id="api-enabled-description"
						>
							{t("enableSupportDescription")}
						</p>
					</div>
					<Switch
						aria-describedby="api-enabled-description"
						checked={draftEnabled}
						disabled={isGenerating || isRevoking}
						id="api-enabled"
						onCheckedChange={onToggleEnabled}
					/>
				</div>

				{draftEnabled && (
					<div className="flex flex-col gap-6">
						{hasApiKey ? (
							<>
								<div className="flex flex-col gap-2">
									<Label className="font-medium text-sm" htmlFor="api-key">
										{t("apiKeyLabel")}
									</Label>
									<div className="flex items-center gap-2">
										<Input
											aria-describedby="api-key-help"
											className="font-mono text-sm shadow-none"
											id="api-key"
											readOnly
											type={showApiKey ? "text" : "password"}
											value={apiSettings.apiKey || ""}
										/>
										<Button
											aria-label={
												showApiKey ? t("hideApiKeyAria") : t("showApiKeyAria")
											}
											onClick={() => setShowApiKey(!showApiKey)}
											size="icon"
											variant="outline"
										>
											{showApiKey ? (
												<EyeOff className="size-4" />
											) : (
												<Eye className="size-4" />
											)}
										</Button>
										<Button
											aria-label={t("copyApiKeyAria")}
											onClick={handleCopyApiKey}
											size="icon"
											variant="outline"
										>
											<Copy className="size-4" />
										</Button>
									</div>
									<p
										className="text-muted-foreground text-xs"
										id="api-key-help"
									>
										{t("apiKeySecretHint")}
									</p>
								</div>

								<div className="flex flex-col gap-2">
									<Label className="font-medium text-sm" htmlFor="api-endpoint">
										{t("apiEndpointLabel")}
									</Label>
									<div className="flex items-center gap-2">
										<Input
											className="font-mono text-sm shadow-none"
											id="api-endpoint"
											readOnly
											value={formId ? `/api/forms/${formId}/api-submit` : ""}
										/>
										<Button
											aria-label={t("copyEndpointAria")}
											onClick={handleCopyEndpoint}
											size="icon"
											variant="outline"
										>
											<Copy className="size-4" />
										</Button>
									</div>
								</div>

								<div className="flex flex-wrap gap-2">
									<Button
										aria-busy={isRevoking}
										disabled={isRevoking || isGenerating}
										onClick={async () => {
											if (!(isRevoking || isGenerating)) {
												await handleRevokeApiKey();
											}
										}}
										size="sm"
										variant="outline"
									>
										<Key aria-hidden className="size-4" />
										<span>{isRevoking ? t("revoking") : t("revokeKey")}</span>
									</Button>
									<Button
										aria-busy={isGenerating}
										disabled={isGenerating || isRevoking}
										onClick={async () => {
											if (!(isGenerating || isRevoking)) {
												await handleGenerateApiKey();
											}
										}}
										size="sm"
										variant="outline"
									>
										<RefreshCw
											aria-hidden
											className={`size-4 transition-transform ${isGenerating ? "animate-spin" : ""}`}
										/>
										<span>
											{isGenerating ? t("generating") : t("regenerateKey")}
										</span>
									</Button>
									<Button
										aria-pressed={showCodeGenerator}
										onClick={() => setShowCodeGenerator((prev) => !prev)}
										size="sm"
										variant="outline"
									>
										<Code aria-hidden className="size-4" />
										<span>
											{showCodeGenerator
												? t("hideCodeExamples")
												: t("showCodeExamples")}
										</span>
									</Button>
								</div>

								{showCodeGenerator && (
									<div className="flex flex-col gap-4">
										{Object.entries(generateCodeExamples()).map(
											([language, code]) => (
												<div className="flex flex-col gap-2" key={language}>
													<div className="flex items-center justify-between">
														<Label className="font-medium text-sm capitalize">
															{language === "javascript"
																? t("javascriptNodeLabel")
																: language}
														</Label>
														<div className="flex items-center gap-2">
															<Button
																aria-label={t("copyCodeAria", { language })}
																onClick={() => {
																	navigator.clipboard.writeText(code);
																	toast.success(
																		t("codeCopied", { language })
																	);
																}}
																size="sm"
																variant="outline"
															>
																<Copy className="size-4" />
															</Button>
															<Button
																aria-label={t("downloadCodeAria", { language })}
																onClick={() =>
																	handleDownloadCode(language, code)
																}
																size="sm"
																variant="outline"
															>
																<Download className="size-4" />
															</Button>
														</div>
													</div>
													<div className="rounded-lg border bg-muted">
														<ScrollArea className="h-48">
															<div className="p-4 font-mono">
																<pre className="font-mono text-sm">
																	<code className="wrap-break-word whitespace-pre-wrap">
																		{code}
																	</code>
																</pre>
															</div>
														</ScrollArea>
													</div>
												</div>
											)
										)}
									</div>
								)}
							</>
						) : (
							<div className="rounded-lg border bg-muted/40 p-4 text-center">
								<p className="mb-4 text-muted-foreground text-sm">
									{t("emptyStateDescription")}
								</p>
								<Button
									disabled={isGenerating}
									loading={isGenerating}
									onClick={handleGenerateApiKey}
								>
									{isGenerating ? <></> : <Key className="size-4" />}
									{isGenerating ? t("generating") : t("generateApiKey")}
								</Button>
							</div>
						)}

						<div className="flex flex-col gap-2">
							<div className="flex items-center gap-2">
								<Badge variant="secondary">{t("integrationRateLimiting")}</Badge>
								<span className="text-muted-foreground text-sm">
									{t("integrationRateLimitingDescription")}
								</span>
							</div>
							<div className="flex items-center gap-2">
								<Badge variant="secondary">{t("integrationProfanityFilter")}</Badge>
								<span className="text-muted-foreground text-sm">
									{t("integrationProfanityFilterDescription")}
								</span>
							</div>
							<div className="flex items-center gap-2">
								<Badge variant="secondary">
									{t("integrationDuplicatePrevention")}
								</Badge>
								<span className="text-muted-foreground text-sm">
									{t("integrationDuplicatePreventionDescription")}
								</span>
							</div>
							<div className="flex items-center gap-2">
								<Badge variant="secondary">{t("integrationResponseLimits")}</Badge>
								<span className="text-muted-foreground text-sm">
									{t("integrationResponseLimitsDescription")}
								</span>
							</div>
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
								aria-label={t("resetAria")}
								className="gap-2 text-muted-foreground hover:text-foreground"
								onClick={resetChanges}
								size="sm"
								variant="ghost"
							>
								{tCommon("reset")}
							</Button>
						)}
					</div>
					<div className="flex items-center gap-2">
						<Button
							aria-describedby="api-enabled-description"
							aria-label={t("saveAria")}
							disabled={saving || !hasChanges}
							loading={saving}
							onClick={saveChanges}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									saveChanges();
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
