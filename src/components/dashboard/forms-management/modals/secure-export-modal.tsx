"use client";

import { Download, Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import type { Form } from "@/lib/database";
import { exportFormSecure } from "@/lib/forms/secure-transfer";

interface SecureExportModalProps {
	form: Form | null;
	isOpen: boolean;
	onClose: () => void;
}

const MIN_PASSPHRASE_LENGTH = 8;
const MODAL_SCROLL_AREA_CLASS =
	"h-full [&_[data-slot='scroll-area-scrollbar']]:w-2 [&_[data-slot='scroll-area-scrollbar']]:p-0.5 [&_[data-slot='scroll-area-thumb']]:bg-muted-foreground/30 hover:[&_[data-slot='scroll-area-thumb']]:bg-muted-foreground/50";

interface PassphraseInputFieldProps {
	error?: string;
	helperText?: string;
	id: string;
	isVisible: boolean;
	label: string;
	onChange: (value: string) => void;
	onToggleVisibility: () => void;
	placeholder: string;
	value: string;
	visibilityAriaLabel: string;
}

function sanitizeFilenameSegment(value: string): string {
	const normalized = value
		.trim()
		.replace(/\s+/g, "_")
		.replace(/[^a-zA-Z0-9_-]/g, "");
	return normalized.length > 0 ? normalized : "form";
}

function formatTimestampForFilename(date: Date): string {
	const yyyy = date.getFullYear();
	const mm = String(date.getMonth() + 1).padStart(2, "0");
	const dd = String(date.getDate()).padStart(2, "0");
	const hh = String(date.getHours()).padStart(2, "0");
	const min = String(date.getMinutes()).padStart(2, "0");
	return `${yyyy}${mm}${dd}-${hh}${min}`;
}

function PassphraseInputField({
	error,
	helperText,
	id,
	isVisible,
	label,
	onChange,
	onToggleVisibility,
	placeholder,
	value,
	visibilityAriaLabel,
}: PassphraseInputFieldProps) {
	const message = error || helperText || " ";

	return (
		<div className="flex flex-col gap-2">
			<Label htmlFor={id}>{label}</Label>
			<InputGroup>
				<InputGroupInput
					aria-invalid={!!error}
					id={id}
					onChange={(event) => onChange(event.target.value)}
					placeholder={placeholder}
					type={isVisible ? "text" : "password"}
					value={value}
				/>
				<InputGroupAddon align="inline-end">
					<InputGroupButton
						aria-label={visibilityAriaLabel}
						onClick={onToggleVisibility}
						tabIndex={-1}
						size="icon-xs"
						variant="ghost"
					>
						{isVisible ? (
							<EyeOff className="size-4" />
						) : (
							<Eye className="size-4" />
						)}
					</InputGroupButton>
				</InputGroupAddon>
			</InputGroup>
			<p
				aria-live="polite"
				className={`min-h-5 text-xs ${
					error ? "text-destructive" : "text-muted-foreground"
				}`}
			>
				{message}
			</p>
		</div>
	);
}

export function SecureExportModal({
	form,
	isOpen,
	onClose,
}: SecureExportModalProps) {
	const t = useTranslations("dashboard.formsManagement.secureExport");
	const [passphrase, setPassphrase] = useState("");
	const [confirmPassphrase, setConfirmPassphrase] = useState("");
	const [showPassphrase, setShowPassphrase] = useState(false);
	const [showConfirmPassphrase, setShowConfirmPassphrase] = useState(false);
	const [exporting, setExporting] = useState(false);

	useEffect(() => {
		if (!isOpen) {
			setPassphrase("");
			setConfirmPassphrase("");
			setShowPassphrase(false);
			setShowConfirmPassphrase(false);
			setExporting(false);
		}
	}, [isOpen]);

	const exportTitle = useMemo(() => {
		if (!form) {
			return "";
		}
		return form.schema?.settings?.title || form.title || t("untitledForm");
	}, [form, t]);

	const canExport =
		passphrase.trim().length >= MIN_PASSPHRASE_LENGTH &&
		confirmPassphrase.trim().length >= MIN_PASSPHRASE_LENGTH &&
		passphrase === confirmPassphrase &&
		!!form;

	const passphraseError =
		passphrase.length > 0 && passphrase.trim().length < MIN_PASSPHRASE_LENGTH
			? t("errors.passphraseMinChars", { count: MIN_PASSPHRASE_LENGTH })
			: "";

	const confirmPassphraseError =
		confirmPassphrase.length > 0 &&
		confirmPassphrase.trim().length < MIN_PASSPHRASE_LENGTH
			? t("errors.confirmPassphraseMinChars", { count: MIN_PASSPHRASE_LENGTH })
			: "";

	const mismatchError =
		passphrase.length > 0 &&
		confirmPassphrase.length > 0 &&
		passphrase !== confirmPassphrase
			? t("errors.passphrasesDoNotMatch")
			: "";

	const passphraseStrength = useMemo(() => {
		const length = passphrase.trim().length;
		if (length === 0) {
			return {
				label: t("strength.notSet"),
				colorClass: "bg-muted text-muted-foreground",
			};
		}
		if (length < MIN_PASSPHRASE_LENGTH) {
			return {
				label: t("strength.weak"),
				colorClass: "bg-destructive/10 text-destructive",
			};
		}
		if (length < 12) {
			return {
				label: t("strength.good"),
				colorClass: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
			};
		}
		return {
			label: t("strength.strong"),
			colorClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
		};
	}, [passphrase, t]);

	const handleExport = async () => {
		if (!form) {
			toast.error(t("errors.noFormSelected"));
			return;
		}

		if (!canExport) {
			toast.error(t("errors.enterValidPassphrase"));
			return;
		}

		setExporting(true);
		try {
			const encryptedBlob = await exportFormSecure(form, passphrase);
			const title = sanitizeFilenameSegment(exportTitle);
			const timestamp = formatTimestampForFilename(new Date());
			const filename = `${title}-${timestamp}.ikiform`;

			const url = URL.createObjectURL(encryptedBlob);
			const anchor = document.createElement("a");
			anchor.href = url;
			anchor.download = filename;
			document.body.appendChild(anchor);
			anchor.click();
			document.body.removeChild(anchor);
			URL.revokeObjectURL(url);

			toast.success(t("toasts.exportCreated"));
			onClose();
		} catch (error) {
			const message =
				error instanceof Error ? error.message : t("errors.failedExport");
			toast.error(message);
		} finally {
			setExporting(false);
		}
	};

	return (
		<Dialog onOpenChange={onClose} open={isOpen}>
			<DialogContent className="max-h-[90vh] sm:max-w-xl">
				<DialogHeader className="shrink-0">
					<DialogTitle>{t("title")}</DialogTitle>
					<DialogDescription>
						{t("description")}
					</DialogDescription>
				</DialogHeader>

				<div className="flex min-h-[430px] max-h-[75vh] flex-col">
					<ScrollArea className={`flex-1 ${MODAL_SCROLL_AREA_CLASS}`}>
						<div className="space-y-4 pr-3">
							<div className="rounded-lg border bg-muted/30 p-3 text-sm">
								<div className="font-medium">{t("formLabel")}</div>
								<div className="text-muted-foreground">
									{exportTitle || t("unknownForm")}
								</div>
							</div>

							<div className="rounded-lg border p-3">
								<div className="mb-3 flex items-center justify-between gap-2">
									<p className="font-medium text-sm">{t("passphraseSetup")}</p>
									<span
										className={`rounded-full px-2 py-0.5 font-medium text-xs ${passphraseStrength.colorClass}`}
									>
										{passphraseStrength.label}
									</span>
								</div>

								<div className="flex flex-col gap-2">
									<PassphraseInputField
										error={passphraseError || mismatchError}
										helperText={t("passphraseHelper")}
										id="export-passphrase"
										isVisible={showPassphrase}
										label={t("passphraseLabel")}
										onChange={setPassphrase}
										onToggleVisibility={() =>
											setShowPassphrase((prev) => !prev)
										}
										placeholder={t("passphrasePlaceholder", {
											count: MIN_PASSPHRASE_LENGTH,
										})}
										value={passphrase}
										visibilityAriaLabel={
											showPassphrase
												? t("hidePassphrase")
												: t("viewPassphrase")
										}
									/>

									<PassphraseInputField
										error={confirmPassphraseError || mismatchError}
										helperText={t("confirmPassphraseHelper")}
										id="export-confirm-passphrase"
										isVisible={showConfirmPassphrase}
										label={t("confirmPassphraseLabel")}
										onChange={setConfirmPassphrase}
										onToggleVisibility={() =>
											setShowConfirmPassphrase((prev) => !prev)
										}
										placeholder={t("confirmPassphrasePlaceholder")}
										value={confirmPassphrase}
										visibilityAriaLabel={
											showConfirmPassphrase
												? t("hideConfirmPassphrase")
												: t("viewConfirmPassphrase")
										}
									/>
								</div>
							</div>
						</div>
					</ScrollArea>

					<div className="mt-4 flex shrink-0 flex-col gap-2 border-t pt-4 sm:flex-row sm:justify-end">
						<Button onClick={onClose} variant="outline">
							{t("cancel")}
						</Button>
						<Button
							className="min-w-44"
							disabled={!canExport || exporting}
							onClick={handleExport}
						>
							<Download className="size-4" />
							{exporting ? t("exporting") : t("exportEncryptedFile")}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
