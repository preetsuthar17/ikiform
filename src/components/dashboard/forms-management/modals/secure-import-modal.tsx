"use client";

import { Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { FormPreview } from "@/components/form-builder/form-preview";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import {
	applySensitiveImportPolicy,
	type NormalizedImportedFormData,
	normalizeImportedFormPayload,
	type SensitiveImportOptions,
} from "@/lib/forms/import-normalize";
import { decryptImportedFormFile } from "@/lib/forms/secure-transfer";

interface SecureImportModalProps {
	isOpen: boolean;
	onClose: () => void;
	onImport: (data: NormalizedImportedFormData) => Promise<void>;
}

const DEFAULT_SENSITIVE_OPTIONS: SensitiveImportOptions = {
	preserveApiSettings: false,
	preservePasswordProtection: false,
	preserveNotificationEmail: false,
};

const MIN_PASSPHRASE_LENGTH = 8;
const MODAL_SCROLL_AREA_CLASS =
	"h-full [&_[data-slot='scroll-area-scrollbar']]:w-2 [&_[data-slot='scroll-area-scrollbar']]:p-0.5 [&_[data-slot='scroll-area-thumb']]:bg-muted-foreground/30 hover:[&_[data-slot='scroll-area-thumb']]:bg-muted-foreground/50";

function formatFileSize(bytes: number): string {
	if (bytes < 1024) {
		return `${bytes} B`;
	}
	if (bytes < 1024 * 1024) {
		return `${(bytes / 1024).toFixed(1)} KB`;
	}
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function SecureImportModal({
	isOpen,
	onClose,
	onImport,
}: SecureImportModalProps) {
	const t = useTranslations("dashboard.formsManagement.secureImport");
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [passphrase, setPassphrase] = useState("");
	const [fileError, setFileError] = useState("");
	const [passphraseError, setPassphraseError] = useState("");
	const [decrypting, setDecrypting] = useState(false);
	const [importing, setImporting] = useState(false);
	const [importData, setImportData] =
		useState<NormalizedImportedFormData | null>(null);
	const [sensitiveOptions, setSensitiveOptions] =
		useState<SensitiveImportOptions>(DEFAULT_SENSITIVE_OPTIONS);

	useEffect(() => {
		if (!isOpen) {
			setSelectedFile(null);
			setPassphrase("");
			setFileError("");
			setPassphraseError("");
			setDecrypting(false);
			setImporting(false);
			setImportData(null);
			setSensitiveOptions(DEFAULT_SENSITIVE_OPTIONS);
		}
	}, [isOpen]);

	const canDecrypt = useMemo(
		() =>
			!!selectedFile &&
			passphrase.trim().length >= MIN_PASSPHRASE_LENGTH &&
			!decrypting,
		[selectedFile, passphrase, decrypting]
	);

	const previewSchema = useMemo(() => {
		if (!importData) {
			return null;
		}

		return applySensitiveImportPolicy(importData.schema, sensitiveOptions);
	}, [importData, sensitiveOptions]);

	const selectedFileSummary = useMemo(() => {
		if (!selectedFile) {
			return "";
		}
		return `${selectedFile.name} (${formatFileSize(selectedFile.size)})`;
	}, [selectedFile]);

	const handleDecrypt = async () => {
		let hasError = false;

		if (!selectedFile) {
			setFileError(t("errors.chooseFile"));
			hasError = true;
		} else {
			setFileError("");
		}

		if (passphrase.trim().length < MIN_PASSPHRASE_LENGTH) {
			setPassphraseError(
				t("errors.passphraseMinChars", { count: MIN_PASSPHRASE_LENGTH })
			);
			hasError = true;
		} else {
			setPassphraseError("");
		}

		if (hasError) {
			toast.error(t("toasts.fixHighlightedFields"));
			return;
		}

		const fileToDecrypt = selectedFile;
		if (!fileToDecrypt) {
			return;
		}

		setDecrypting(true);
		try {
			const decryptedPayload = await decryptImportedFormFile(
				fileToDecrypt,
				passphrase
			);
			const normalized = normalizeImportedFormPayload(decryptedPayload);
			setImportData(normalized);
			toast.success(t("toasts.fileDecrypted"));
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: t("errors.failedDecrypt");
			toast.error(message);
			setPassphraseError(t("errors.wrongPassphrase"));
			setImportData(null);
		} finally {
			setDecrypting(false);
		}
	};

	const handleImport = async () => {
		if (!importData) {
			toast.error(t("errors.decryptBeforeImport"));
			return;
		}

		setImporting(true);
		try {
			const schemaWithPolicy = applySensitiveImportPolicy(
				importData.schema,
				sensitiveOptions
			);

			await onImport({
				...importData,
				schema: schemaWithPolicy,
			});

			onClose();
		} catch (error) {
			const message =
				error instanceof Error ? error.message : t("errors.failedImport");
			toast.error(message);
		} finally {
			setImporting(false);
		}
	};

	return (
		<Dialog onOpenChange={onClose} open={isOpen}>
			<DialogContent className="max-h-[92vh] gap-0 overflow-hidden p-0 sm:max-w-6xl">
				<DialogHeader className="shrink-0 border-b px-5 py-4 sm:px-6">
					<DialogTitle>{t("title")}</DialogTitle>
					<DialogDescription>
						{t("description")}
					</DialogDescription>
				</DialogHeader>

				<div className="grid min-h-0 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
					<div className="min-h-0 border-b lg:border-r lg:border-b-0">
						<div className="flex h-full min-h-[360px] max-h-[76vh] flex-col px-5 py-4 sm:px-6">
							<ScrollArea className={`h-full flex-1 ${MODAL_SCROLL_AREA_CLASS}`}>
								<div className="space-y-4 pr-3">
									<div className="flex flex-col gap-2">
										<Label htmlFor="secure-import-file">{t("encryptedFileLabel")}</Label>
										<Input
											accept=".ikiform,application/json"
											aria-invalid={!!fileError}
											id="secure-import-file"
											onChange={(event) => {
												const file = event.target.files?.[0] || null;
												setSelectedFile(file);
												setFileError("");
												setImportData(null);
											}}
											type="file"
										/>
										<p
											aria-live="polite"
											className={`min-h-5 text-xs ${
												fileError
													? "text-destructive"
													: "text-muted-foreground"
											}`}
										>
											{fileError ||
												selectedFileSummary ||
												t("encryptedFileHelp")}
										</p>
									</div>

									<div className="flex flex-col gap-2">
										<Label htmlFor="secure-import-passphrase">{t("passphraseLabel")}</Label>
										<Input
											aria-invalid={!!passphraseError}
											id="secure-import-passphrase"
											onChange={(event) => {
												setPassphrase(event.target.value);
												setPassphraseError("");
												setImportData(null);
											}}
											placeholder={t("passphrasePlaceholder")}
											type="password"
											value={passphrase}
										/>
										<p
											aria-live="polite"
											className={`min-h-5 text-xs ${
												passphraseError
													? "text-destructive"
													: "text-muted-foreground"
											}`}
										>
											{passphraseError ||
												t("passphraseHelp", { count: MIN_PASSPHRASE_LENGTH })}
										</p>
									</div>

									<div className="flex flex-col justify-end sm:flex-row">
										<Button
											className="sm:min-w-40"
											disabled={!canDecrypt}
											onClick={handleDecrypt}
											variant="outline"
										>
											{decrypting ? t("decrypting") : t("decryptFile")}
										</Button>
									</div>

									<div className="flex flex-col gap-4 rounded-lg border bg-muted/20 p-4">
										<div className="min-h-[52px]">
											<div className="font-medium">{t("importedForm")}</div>
											{importData ? (
												<>
													<div className="text-muted-foreground text-sm">
														{importData.title}
													</div>
													{importData.description && (
														<div className="mt-1 text-muted-foreground text-sm">
															{importData.description}
														</div>
													)}
												</>
											) : (
												<div className="text-muted-foreground text-sm">
													{t("decryptToLoadSettings")}
												</div>
											)}
										</div>

										<div className="flex flex-col gap-3">
											<div className="flex items-center justify-between gap-3">
												<Label className="text-sm" htmlFor="preserve-api">
													{t("preserveApiSettings")}
												</Label>
												<Switch
													checked={sensitiveOptions.preserveApiSettings}
													disabled={!importData}
													id="preserve-api"
													onCheckedChange={(checked) =>
														setSensitiveOptions((prev) => ({
															...prev,
															preserveApiSettings: checked,
														}))
													}
												/>
											</div>
											<div className="flex items-center justify-between gap-3">
												<Label className="text-sm" htmlFor="preserve-password">
													{t("preservePassword")}
												</Label>
												<Switch
													checked={sensitiveOptions.preservePasswordProtection}
													disabled={!importData}
													id="preserve-password"
													onCheckedChange={(checked) =>
														setSensitiveOptions((prev) => ({
															...prev,
															preservePasswordProtection: checked,
														}))
													}
												/>
											</div>
											<div className="flex items-center justify-between gap-3">
												<Label className="text-sm" htmlFor="preserve-notifications">
													{t("preserveNotificationEmail")}
												</Label>
												<Switch
													checked={sensitiveOptions.preserveNotificationEmail}
													disabled={!importData}
													id="preserve-notifications"
													onCheckedChange={(checked) =>
														setSensitiveOptions((prev) => ({
															...prev,
															preserveNotificationEmail: checked,
														}))
													}
												/>
											</div>
										</div>
									</div>
								</div>
							</ScrollArea>

							<div className="mt-4 flex shrink-0 flex-col gap-2 border-t pt-4 sm:flex-row sm:justify-end">
								<Button onClick={onClose} variant="outline">
									{t("cancel")}
								</Button>
								<Button
									className="sm:min-w-44"
									disabled={!importData || importing}
									onClick={handleImport}
								>
									<Upload className="size-4" />
									{importing ? t("importing") : t("importAsNewForm")}
								</Button>
							</div>
						</div>
					</div>

					<div className="hidden min-h-[260px] border-t bg-muted/10 lg:block lg:min-h-0 lg:border-t-0">
						<div className="h-full min-h-[260px] overflow-hidden">
							{previewSchema ? (
								<ScrollArea
									className={`h-[320px] sm:h-[360px] lg:h-full ${MODAL_SCROLL_AREA_CLASS}`}
								>
									<FormPreview
										onFieldDelete={() => {}}
										onFieldSelect={() => {}}
										onFieldsReorder={() => {}}
										schema={previewSchema}
										selectedFieldId={null}
									/>
								</ScrollArea>
							) : (
								<div className="flex h-full items-center justify-center p-6 text-center text-muted-foreground text-sm">
									{t("decryptToPreview")}
								</div>
							)}
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
