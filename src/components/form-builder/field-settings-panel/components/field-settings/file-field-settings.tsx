"use client";

import { Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { FormField } from "@/lib/database";

interface FileFieldSettingsProps {
	field: FormField;
	onUpdateSettings: (updates: Partial<FormField["settings"]>) => void;
	onFieldUpdate: (field: FormField) => void;
}

interface FileFieldSettings {
	accept?: string;
	maxFiles?: number;
	maxSize?: number;
	allowedTypes?: string[];
	helpText?: string;
}

const COMMON_FILE_TYPES = [
	{
		key: "images",
		value: "image/*",
		extensions: ["jpg", "jpeg", "png", "gif", "webp"],
	},
	{
		key: "documents",
		value:
			"application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		extensions: ["pdf", "doc", "docx"],
	},
	{
		key: "spreadsheets",
		value:
			"application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		extensions: ["xls", "xlsx"],
	},
	{
		key: "videos",
		value: "video/*",
		extensions: ["mp4", "avi", "mov", "wmv"],
	},
	{
		key: "audio",
		value: "audio/*",
		extensions: ["mp3", "wav", "flac", "m4a"],
	},
	{
		key: "archives",
		value:
			"application/zip,application/x-rar-compressed,application/x-7z-compressed",
		extensions: ["zip", "rar", "7z"],
	},
];

const SIZE_PRESETS = [
	{ label: "1 MB", value: 1024 * 1024 },
	{ label: "5 MB", value: 5 * 1024 * 1024 },
	{ label: "10 MB", value: 10 * 1024 * 1024 },
	{ label: "25 MB", value: 25 * 1024 * 1024 },
	{ label: "50 MB", value: 50 * 1024 * 1024 },
];

export function FileFieldSettings({
	field,
	onUpdateSettings,
}: FileFieldSettingsProps) {
	const t = useTranslations("product.formBuilder.fieldSettings.file");
	const settings = (field.settings as FileFieldSettings) || {};
	const {
		accept = "image/*,application/pdf,video/*,audio/*,text/*,application/zip",
		maxFiles = 10,
		maxSize = 50 * 1024 * 1024,
		allowedTypes = [],
		helpText = "",
	} = settings;

	const updateSetting = (key: keyof FileFieldSettings, value: any) => {
		onUpdateSettings({
			[key]: value,
		});
	};

	const formatFileSize = (bytes: number): string => {
		if (!bytes) return `0 ${t("bytesUnit")}`;
		const k = 1024;
		const sizes = [t("bytesUnit"), "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${(bytes / k ** i).toFixed(1)} ${sizes[i]}`;
	};

	const updateAcceptAttribute = (types: string[]) => {
		const acceptTypes = types.map((type) => `.${type}`).join(",");
		const fullAccept =
			acceptTypes ||
			"image/*,application/pdf,video/*,audio/*,text/*,application/zip";
		updateSetting("accept", fullAccept);
	};

	const addFileType = (type: string) => {
		if (!allowedTypes.includes(type)) {
			const newTypes = [...allowedTypes, type];
			updateSetting("allowedTypes", newTypes);
			updateAcceptAttribute(newTypes);
		}
	};

	const removeFileType = (type: string) => {
		const newTypes = allowedTypes.filter((t) => t !== type);
		updateSetting("allowedTypes", newTypes);
		updateAcceptAttribute(newTypes);
	};

	const toggleCommonType = (typeConfig: (typeof COMMON_FILE_TYPES)[0]) => {
		const hasAllExtensions = typeConfig.extensions.every((ext) =>
			allowedTypes.includes(ext)
		);

		let newTypes: string[];
		if (hasAllExtensions) {
			newTypes = allowedTypes.filter(
				(type) => !typeConfig.extensions.includes(type)
			);
		} else {
			newTypes = [...new Set([...allowedTypes, ...typeConfig.extensions])];
		}

		updateSetting("allowedTypes", newTypes);
		updateAcceptAttribute(newTypes);
	};

	return (
		<Card className="gap-2 p-4 shadow-none">
			<CardHeader className="p-0">
				<CardTitle className="flex items-center gap-2 text-lg">
					{t("title")}
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-4 p-0">
				<div className="flex flex-col gap-2">
					<Label className="font-medium text-sm" htmlFor="maxFiles">
						{t("maxFiles")}
					</Label>
					<Input
						aria-describedby="maxFiles-help"
						autoComplete="off"
						id="maxFiles"
						max="50"
						min="1"
						name="maxFiles"
						onChange={(e) =>
							updateSetting("maxFiles", Number.parseInt(e.target.value) || 1)
						}
						onKeyDown={(e) => {
							if (e.key === "Escape") {
								e.currentTarget.blur();
							}
						}}
						placeholder={t("maxFilesPlaceholder")}
						type="number"
						value={maxFiles}
					/>
					<p className="text-muted-foreground text-xs" id="maxFiles-help">
						{t("maxFilesHelp")}
					</p>
				</div>

				<div className="flex flex-col gap-2">
					<Label className="font-medium text-sm" htmlFor="maxSize">
						{t("maxFileSize")}
					</Label>
					<div className="flex gap-2">
						<Input
							aria-describedby="maxSize-help"
							autoComplete="off"
							className="flex-1"
							id="maxSize"
							min="1"
							name="maxSize"
							onChange={(e) =>
								updateSetting(
									"maxSize",
									(Number.parseInt(e.target.value) || 1) * 1024 * 1024
								)
							}
							onKeyDown={(e) => {
								if (e.key === "Escape") {
									e.currentTarget.blur();
								}
							}}
							placeholder={t("maxFileSizePlaceholder")}
							type="number"
							value={Math.round(maxSize / (1024 * 1024))}
						/>
						<span className="flex items-center px-3 text-muted-foreground text-sm">
							{t("mbUnit")}
						</span>
					</div>
					<div className="flex flex-wrap gap-1">
						{SIZE_PRESETS.map((preset) => (
							<Button
								aria-label={t("setMaxSizePresetAria", { size: preset.label })}
								className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
								key={preset.value}
								onClick={() => updateSetting("maxSize", preset.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										updateSetting("maxSize", preset.value);
									}
								}}
								size="sm"
								variant={maxSize === preset.value ? "default" : "outline"}
							>
								{preset.label}
							</Button>
						))}
					</div>
					<p className="text-muted-foreground text-xs" id="maxSize-help">
						{t("currentSize", { size: formatFileSize(maxSize) })}
					</p>
				</div>
				<div className="flex flex-col gap-4">
					<Label className="font-medium text-sm" htmlFor="allowed-file-types">
						{t("allowedFileTypes")}
					</Label>

					<div className="flex flex-col gap-2">
						<p className="text-muted-foreground text-sm">{t("quickSelect")}</p>
						<div className="flex flex-wrap gap-2">
							{COMMON_FILE_TYPES.map((typeConfig) => {
								const hasAllExtensions = typeConfig.extensions.every((ext) =>
									allowedTypes.includes(ext)
								);
								const typeLabel = t(`commonTypes.${typeConfig.key}`);
								return (
									<Button
										aria-label={t("toggleFileTypeAria", { type: typeLabel })}
										className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
										key={typeConfig.key}
										onClick={() => toggleCommonType(typeConfig)}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ") {
												e.preventDefault();
												toggleCommonType(typeConfig);
											}
										}}
										size="sm"
										variant={hasAllExtensions ? "default" : "outline"}
									>
										{typeLabel}
									</Button>
								);
							})}
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<Label className="font-medium text-sm" htmlFor="customType">
							{t("customExtensions")}
						</Label>
						<div className="flex gap-2">
							<Input
								aria-describedby="customType-help"
								autoComplete="off"
								id="customType"
								name="customType"
								onKeyDown={(e) => {
									if (e.key === "Escape") {
										e.currentTarget.blur();
									}
								}}
								onKeyPress={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										const value = e.currentTarget.value.trim();
										if (value) {
											addFileType(value);
											e.currentTarget.value = "";
										}
									}
								}}
								placeholder={t("customExtensionsPlaceholder")}
								type="text"
							/>
							<Button
								aria-label={t("addCustomExtensionAria")}
								className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
								onClick={() => {
									const input = document.getElementById(
										"customType"
									) as HTMLInputElement;
									const value = input.value.trim();
									if (value) {
										addFileType(value);
										input.value = "";
									}
								}}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										const input = document.getElementById(
											"customType"
										) as HTMLInputElement;
										const value = input.value.trim();
										if (value) {
											addFileType(value);
											input.value = "";
										}
									}
								}}
								size="icon"
								type="button"
							>
								<Plus aria-hidden="true" className="size-4" />
							</Button>
						</div>
						<p className="text-muted-foreground text-xs" id="customType-help">
							{t("customExtensionsHelp")}
						</p>
					</div>

					{allowedTypes.length > 0 && (
						<div className="flex flex-col gap-2">
							<p className="text-muted-foreground text-sm">
								{t("selectedExtensions")}
							</p>
							<div className="flex flex-wrap gap-1">
								{allowedTypes.map((type) => (
									<Badge className="gap-1" key={type} variant="secondary">
										.{type}
										<button
											aria-label={t("removeExtensionAria", { extension: type })}
											className="ml-1 hover:text-destructive focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
											onClick={() => removeFileType(type)}
											onKeyDown={(e) => {
												if (e.key === "Enter" || e.key === " ") {
													e.preventDefault();
													removeFileType(type);
												}
											}}
										>
											<X aria-hidden="true" className="size-3" />
										</button>
									</Badge>
								))}
							</div>
						</div>
					)}

					<div className="flex flex-col gap-2">
						<Label className="font-medium text-sm" htmlFor="accept">
							{t("htmlAccept")}
						</Label>
						<Input
							aria-describedby="accept-help"
							className="font-mono text-xs"
							id="accept"
							name="accept"
							readOnly
							value={accept}
						/>
						<p className="text-muted-foreground text-xs" id="accept-help">
							{t("htmlAcceptHelp")}
						</p>
					</div>
				</div>

				<div className="flex flex-col gap-2">
					<Label className="font-medium text-sm" htmlFor="helpText">
						{t("helpText")}
					</Label>
					<Textarea
						aria-describedby="helpText-help"
						className="resize-none"
						id="helpText"
						name="helpText"
						onChange={(e) => updateSetting("helpText", e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Escape") {
								e.currentTarget.blur();
							} else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
								e.preventDefault();
								e.currentTarget.blur();
							}
						}}
						placeholder={t("helpTextPlaceholder")}
						rows={2}
						value={helpText}
					/>
					<p className="text-muted-foreground text-xs" id="helpText-help">
						{t("helpTextHelp")}
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
