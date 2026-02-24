"use client";

import {
	Archive,
	FileText,
	Image as ImageIcon,
	Music,
	Video,
	X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";

import type { BaseFieldProps } from "../types";

interface FileUploadSettings {
	accept?: string;
	maxFiles?: number;
	maxSize?: number;
	allowedTypes?: string[];
}

interface UploadedFile {
	id: string;
	name: string;
	size: number;
	type: string;
	url: string;
	signedUrl: string;
}

export function FileUploadField(props: BaseFieldProps) {
	const { field, value, onChange, error, disabled, formId } = props;
	const t = useTranslations("product.formBuilder.fieldRenderer.fileUpload");
	const builderMode = props.builderMode;
	const [isUploading, setIsUploading] = useState(false);
	const [uploadError, setUploadError] = useState<string | null>(null);

	const getFallbackFormId = () => {
		if (formId) return formId;
		if (typeof window !== "undefined") {
			const path = window.location.pathname;
			const match = path.match(/^\/f\/([^/]+)/);
			return match?.[1] || null;
		}
		return null;
	};

	const getFileUploadSettings = () => field.settings as FileUploadSettings;

	const getMaxFileSize = () => {
		const settings = getFileUploadSettings();
		return settings?.maxSize || 50 * 1024 * 1024;
	};

	const getMaxFiles = () => {
		const settings = getFileUploadSettings();
		return settings?.maxFiles || 10;
	};

	const getAcceptedFileTypes = () => {
		const settings = getFileUploadSettings();
		return (
			settings?.accept ||
			"image/*,application/pdf,video/*,audio/*,text/*,application/zip"
		);
	};

	const getUploadedFiles = () => (Array.isArray(value) ? value : []);

	const getFileIcon = useCallback((type: string) => {
		if (type.startsWith("image/")) return ImageIcon;
		if (type.startsWith("video/")) return Video;
		if (type.startsWith("audio/")) return Music;
		if (type.includes("pdf") || type.includes("document")) return FileText;
		if (type.includes("zip") || type.includes("archive")) return Archive;
		return FileText;
	}, []);

	const formatFileSize = useCallback((bytes: number): string => {
		if (!bytes) return `0 ${t("bytesUnit")}`;
		const k = 1024;
		const sizes = [t("bytesUnit"), "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${(bytes / k ** i).toFixed(1)} ${sizes[i]}`;
	}, [t]);

	const createMockFile = (file: File, index: number) => ({
		id: `preview-${Date.now()}-${index}`,
		name: file.name,
		size: file.size,
		type: file.type,
		url: `preview/${file.name}`,
		signedUrl: URL.createObjectURL(file),
	});

	const handleFileUpload = useCallback(
		async (files: File[]) => {
			const actualFormId = getFallbackFormId();

			if (!actualFormId) {
				const mockFiles = files.map(createMockFile);
				const currentFiles = getUploadedFiles();
				onChange([...currentFiles, ...mockFiles]);
				return;
			}

			setIsUploading(true);
			setUploadError(null);

			try {
				const uploadPromises = files.map(async (file) => {
					const formData = new FormData();
					formData.append("file", file);
					formData.append("formId", actualFormId);
					formData.append("fieldId", field.id);

					const response = await fetch("/api/upload", {
						method: "POST",
						body: formData,
					});

					if (!response.ok) {
						const errorData = await response.json();
						throw new Error(errorData.error || t("uploadFailed"));
					}

					const result = await response.json();
					return result.file;
				});

				const newUploadedFiles = await Promise.all(uploadPromises);
				const currentFiles = getUploadedFiles();
				onChange([...currentFiles, ...newUploadedFiles]);
			} catch (error) {
				setUploadError(
					error instanceof Error ? error.message : t("uploadFailed")
				);
				throw error;
			} finally {
				setIsUploading(false);
			}
		},
		[field.id, onChange, t, value]
	);

	const handleRemoveUploadedFile = useCallback(
		(fileId: string) => {
			const currentFiles = getUploadedFiles();
			const fileToRemove = currentFiles.find((file) => file.id === fileId);

			if (fileToRemove && fileToRemove.signedUrl.startsWith("blob:")) {
				URL.revokeObjectURL(fileToRemove.signedUrl);
			}

			onChange(currentFiles.filter((file) => file.id !== fileId));
		},
		[value, onChange]
	);

	const handleRemoveButtonClick = (fileId: string) => {
		if (!builderMode) {
			handleRemoveUploadedFile(fileId);
		}
	};

	const isFileImage = (type: string) => type.startsWith("image/");

	const getFileConstraintsText = () => {
		const maxFiles = getMaxFiles();
		const maxSize = getMaxFileSize();
		const settings = getFileUploadSettings();

		return {
			maxFiles,
			maxSize: formatFileSize(maxSize),
			allowedTypes: settings?.allowedTypes,
		};
	};

	useEffect(() => {
		if (value === undefined || value === null || value === "") {
			onChange([]);
		}
	}, []);

	const uploadedFiles = getUploadedFiles();
	const maxFiles = getMaxFiles();
	const maxSize = getMaxFileSize();
	const accept = getAcceptedFileTypes();
	const fallbackFormId = getFallbackFormId();
	const constraints = getFileConstraintsText();

	return (
		<div className="flex flex-col gap-3">
			<Card className="border-0 p-0 shadow-none">
				<CardContent className="p-0">
					<FileUpload
						accept={accept}
						className="bg-transparent"
						disabled={disabled || isUploading || builderMode}
						maxFiles={maxFiles - uploadedFiles.length}
						maxSize={maxSize}
						multiple={maxFiles > 1}
						onUpload={builderMode ? undefined : handleFileUpload}
						showPreview={false}
					/>
				</CardContent>
			</Card>

			{uploadError && (
				<Alert variant="destructive">
					<p className="font-medium">{t("uploadErrorTitle")}</p>
					<p className="text-sm">{uploadError}</p>
				</Alert>
			)}

			{uploadedFiles.length > 0 && (
				<div className="flex flex-col gap-2">
					<h4 className="font-medium text-sm">
						{t("uploadedFiles", { count: uploadedFiles.length })}
					</h4>
					<div className="grid gap-2">
						{uploadedFiles.map((file) => {
							const IconComponent = getFileIcon(file.type);
							const isImage = isFileImage(file.type);

							return (
								<div
									className="flex items-center gap-3 rounded-lg border p-3"
									key={file.id}
								>
									<div className="shrink-0">
										{isImage ? (
											<img
												alt={file.name}
												className="size-10 rounded-md border border-border object-cover"
												src={file.signedUrl}
											/>
										) : (
											<div className="flex size-10 items-center justify-center rounded-md bg-accent">
												<IconComponent className="size-5 text-muted-foreground" />
											</div>
										)}
									</div>

									<div className="min-w-0 flex-1">
										<p className="truncate font-medium text-sm">{file.name}</p>
										<div className="flex items-center gap-2">
											<p className="text-muted-foreground text-xs">
												{formatFileSize(file.size)}
											</p>
											<Badge variant="secondary">{t("uploadedBadge")}</Badge>
										</div>
									</div>

									<Button
										aria-label={t("removeFileAria", { name: file.name })}
										className="shrink-0"
										disabled={disabled || builderMode}
										onClick={() => handleRemoveButtonClick(file.id)}
										size="icon"
										type="button"
										variant="ghost"
									>
										<X className="size-4" />
									</Button>
								</div>
							);
						})}
					</div>
				</div>
			)}

			<div className="text-muted-foreground text-xs">
				<p>
					{t("maxFilesAndSize", {
						maxFiles: constraints.maxFiles,
						maxSize: constraints.maxSize,
					})}
				</p>
				{constraints.allowedTypes && (
					<p>
						{t("allowedTypes")}: {constraints.allowedTypes.join(", ")}
					</p>
				)}
			</div>
		</div>
	);
}
