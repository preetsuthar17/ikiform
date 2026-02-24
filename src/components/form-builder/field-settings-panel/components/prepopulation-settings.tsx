import { Copy, ExternalLink, Globe, History, User, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import type { FormField } from "@/lib/database";

interface PrepopulationSettingsProps {
	field: FormField;
	onFieldUpdate: (field: FormField) => void;
}

export function PrepopulationSettings({
	field,
	onFieldUpdate,
}: PrepopulationSettingsProps) {
	const t = useTranslations("product.formBuilder.fieldSettings.prepopulation");
	const [previewUrl, setPreviewUrl] = useState("");

	const prepopulation = field.prepopulation || {
		enabled: false,
		source: "url" as const,
		config: {},
	};

	const updatePrepopulation = (updates: Partial<typeof prepopulation>) => {
		onFieldUpdate({
			...field,
			prepopulation: { ...prepopulation, ...updates },
		});
	};

	const updateConfig = (
		configUpdates: Partial<typeof prepopulation.config>
	) => {
		updatePrepopulation({
			config: { ...prepopulation.config, ...configUpdates },
		});
	};

	const generatePreviewUrl = async () => {
		if (!prepopulation.config.urlParam) {
			toast.error(t("toasts.missingUrlParam"));
			return;
		}

		const baseUrl =
			typeof window !== "undefined"
				? window.location.origin + "/form/123"
				: "https://yoursite.com/form/123";

		const exampleValue = `Sample ${field.label}`;
		const params = new URLSearchParams();
		params.set(prepopulation.config.urlParam, exampleValue);
		const url = `${baseUrl}?${params.toString()}`;

		setPreviewUrl(url);

		const { copyWithToast } = await import("@/lib/utils/clipboard");
		await copyWithToast(
			url,
			t("toasts.previewUrlCopied"),
			t("toasts.previewUrlCopyFailed")
		);
	};

	const testApiEndpoint = async () => {
		if (!prepopulation.config.apiEndpoint) {
			toast.error(t("toasts.missingApiEndpoint"));
			return;
		}

		try {
			const response = await fetch(prepopulation.config.apiEndpoint, {
				method: prepopulation.config.apiMethod || "GET",
				headers:
					typeof prepopulation.config.apiHeaders === "string"
						? JSON.parse(prepopulation.config.apiHeaders)
						: prepopulation.config.apiHeaders,
			});

			if (response.ok) {
				toast.success(t("toasts.apiReachable"));
			} else {
				toast.error(
					t("toasts.apiTestFailedStatus", {
						status: response.status,
						statusText: response.statusText,
					})
				);
			}
		} catch (error) {
			toast.error(
				t("toasts.apiTestFailedError", {
					error: error instanceof Error ? error.message : t("unknownError"),
				})
			);
		}
	};

	return (
		<Card className="gap-2 p-4 shadow-none">
			<CardHeader className="p-0">
				<CardTitle className="flex items-center gap-2 text-lg">
					{t("title")}
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-4 p-0">
				<div className="flex items-center justify-between">
					<div className="flex flex-col gap-1">
						<Label
							className="font-medium text-sm"
							htmlFor="prepopulation-enabled"
						>
							{t("enabled")}
						</Label>
						<p className="text-muted-foreground text-xs">
							{t("enabledHelp")}
						</p>
					</div>
					<Switch
						aria-describedby="prepopulation-enabled-help"
						checked={prepopulation.enabled}
						id="prepopulation-enabled"
						name="prepopulation-enabled"
						onCheckedChange={(enabled) => updatePrepopulation({ enabled })}
					/>
				</div>

				{prepopulation.enabled && (
					<>
						<div className="flex flex-col gap-2">
							<Label className="font-medium text-sm" htmlFor="data-source">
								{t("dataSource")}
							</Label>
							<Select
								onValueChange={(source) =>
									updatePrepopulation({ source: source as any })
								}
								value={prepopulation.source}
							>
								<SelectTrigger className="w-full" id="data-source">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="url">
										<div className="flex items-center gap-2">
											<Globe className="size-4" />
											{t("sources.url")}
										</div>
									</SelectItem>
									<SelectItem value="api">
										<div className="flex items-center gap-2">
											<Zap className="size-4" />
											{t("sources.api")}
										</div>
									</SelectItem>
									<SelectItem value="profile">
										<div className="flex items-center gap-2">
											<User className="size-4" />
											{t("sources.profile")}
										</div>
									</SelectItem>
									<SelectItem value="previous">
										<div className="flex items-center gap-2">
											<History className="size-4" />
											{t("sources.previous")}
										</div>
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{prepopulation.source === "url" && (
							<div className="flex flex-col gap-4">
								<div className="flex flex-col gap-2">
									<Label className="font-medium text-sm" htmlFor="url-param">
										{t("urlParamName")}
									</Label>
									<Input
										aria-describedby="url-param-help"
										autoComplete="off"
										id="url-param"
										name="url-param"
										onChange={(e) => updateConfig({ urlParam: e.target.value })}
										onKeyDown={(e) => {
											if (e.key === "Escape") {
												e.currentTarget.blur();
											}
										}}
										placeholder={t("urlParamPlaceholder")}
										type="text"
										value={prepopulation.config.urlParam || ""}
									/>
									<p
										className="text-muted-foreground text-xs"
										id="url-param-help"
									>
										{t("urlParamHelp")}
									</p>
								</div>

								<div className="flex flex-col gap-2">
									<Label
										className="font-medium text-sm"
										htmlFor="fallback-value"
									>
										{t("fallbackValue")}
									</Label>
									<Input
										aria-describedby="fallback-value-help"
										autoComplete="off"
										id="fallback-value"
										name="fallback-value"
										onChange={(e) =>
											updateConfig({ fallbackValue: e.target.value })
										}
										onKeyDown={(e) => {
											if (e.key === "Escape") {
												e.currentTarget.blur();
											}
										}}
										placeholder={t("fallbackValuePlaceholder")}
										type="text"
										value={prepopulation.config.fallbackValue || ""}
									/>
									<p
										className="text-muted-foreground text-xs"
										id="fallback-value-help"
									>
										{t("fallbackValueHelp")}
									</p>
								</div>

								<div className="flex items-center justify-between">
									<div className="flex flex-col gap-1">
										<Label
											className="font-medium text-sm"
											htmlFor="overwrite-existing"
										>
											{t("overwriteExisting")}
										</Label>
										<p className="text-muted-foreground text-xs">
											{t("overwriteExistingHelp")}
										</p>
									</div>
									<Switch
										aria-describedby="overwrite-existing-help"
										checked={prepopulation.config.overwriteExisting}
										id="overwrite-existing"
										name="overwrite-existing"
										onCheckedChange={(overwriteExisting) =>
											updateConfig({ overwriteExisting })
										}
									/>
								</div>

								{prepopulation.config.urlParam && (
									<div className="flex gap-2">
										<Button
											aria-label={t("generatePreviewAria")}
											className="flex items-center gap-2"
											onClick={generatePreviewUrl}
											onKeyDown={(e) => {
												if (e.key === "Enter" || e.key === " ") {
													e.preventDefault();
													generatePreviewUrl();
												}
											}}
											size="sm"
											variant="outline"
										>
											<Copy aria-hidden="true" className="size-4" />
											{t("generatePreview")}
										</Button>
									</div>
								)}

								{previewUrl && (
									<div className="flex flex-col gap-2 rounded border border-blue-200 bg-blue-50 p-3 text-blue-900 text-sm">
										<strong>{t("previewUrlLabel")}</strong>
										<code className="break-all text-xs">{previewUrl}</code>
										<p className="text-xs">
											{t("previewUrlHelp", {
												label: field.label,
											})}
										</p>
									</div>
								)}
							</div>
						)}

						{prepopulation.source === "api" && (
							<div className="flex flex-col gap-4">
								<div className="flex flex-col gap-2">
									<Label className="font-medium text-sm" htmlFor="api-endpoint">
										{t("apiEndpoint")}
									</Label>
									<Input
										aria-describedby="api-endpoint-help"
										autoComplete="off"
										id="api-endpoint"
										name="api-endpoint"
										onChange={(e) =>
											updateConfig({ apiEndpoint: e.target.value })
										}
										onKeyDown={(e) => {
											if (e.key === "Escape") {
												e.currentTarget.blur();
											}
										}}
										placeholder={t("apiEndpointPlaceholder")}
										type="url"
										value={prepopulation.config.apiEndpoint || ""}
									/>
									<p
										className="text-muted-foreground text-xs"
										id="api-endpoint-help"
									>
										{t("apiEndpointHelp")}
									</p>
								</div>

								<div className="flex flex-col gap-2">
									<Label className="font-medium text-sm" htmlFor="http-method">
										{t("httpMethod")}
									</Label>
									<Select
										onValueChange={(method) =>
											updateConfig({ apiMethod: method as "GET" | "POST" })
										}
										value={prepopulation.config.apiMethod || "GET"}
									>
										<SelectTrigger className="w-full" id="http-method">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="GET">GET</SelectItem>
											<SelectItem value="POST">POST</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="flex flex-col gap-2">
									<Label className="font-medium text-sm" htmlFor="api-headers">
										{t("requestHeaders")}
									</Label>
									<Textarea
										aria-describedby="api-headers-help"
										className="resize-none"
										id="api-headers"
										name="api-headers"
										onChange={(e) =>
											updateConfig({ apiHeaders: e.target.value as any })
										}
										onKeyDown={(e) => {
											if (e.key === "Escape") {
												e.currentTarget.blur();
											} else if (
												e.key === "Enter" &&
												(e.metaKey || e.ctrlKey)
											) {
												e.preventDefault();
												e.currentTarget.blur();
											}
										}}
										placeholder={
											'{\n  "Authorization": "Bearer token",\n  "Content-Type": "application/json"\n}'
										}
										rows={3}
										value={
											typeof prepopulation.config.apiHeaders === "string"
												? prepopulation.config.apiHeaders
												: JSON.stringify(
														prepopulation.config.apiHeaders || {},
														null,
														2
													)
										}
									/>
									<p
										className="text-muted-foreground text-xs"
										id="api-headers-help"
									>
										{t("requestHeadersHelp")}
									</p>
								</div>

								{prepopulation.config.apiEndpoint && (
									<Button
										aria-label={t("testApiAria")}
										className="flex items-center gap-2"
										onClick={testApiEndpoint}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ") {
												e.preventDefault();
												testApiEndpoint();
											}
										}}
										size="sm"
										variant="outline"
									>
										<ExternalLink aria-hidden="true" className="size-4" />
										{t("testApi")}
									</Button>
								)}
							</div>
						)}

						{prepopulation.source === "profile" && (
							<div
								aria-live="polite"
								className="rounded border border-orange-200 bg-orange-50 p-3 text-orange-900 text-sm"
								role="status"
							>
								<strong>{t("comingSoonLabel")}</strong>{" "}
								{t("profileComingSoon")}
							</div>
						)}

						{prepopulation.source === "previous" && (
							<div
								aria-live="polite"
								className="rounded border border-orange-200 bg-orange-50 p-3 text-orange-900 text-sm"
								role="status"
							>
								<strong>{t("comingSoonLabel")}</strong>{" "}
								{t("previousComingSoon")}
							</div>
						)}
					</>
				)}
			</CardContent>
		</Card>
	);
}
