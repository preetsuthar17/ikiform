import { CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { WebhookConfig } from "../hooks/useWebhookManagement";

interface TestWebhookDialogProps {
	webhook: WebhookConfig | null;
	open: boolean;
	onClose: () => void;
}

export function TestWebhookDialog({
	webhook,
	open,
	onClose,
}: TestWebhookDialogProps) {
	const t = useTranslations("product.formBuilder.formSettings.webhooks.testDialog");
	const getEventLabel = (event: string) => {
		if (event === "form_submitted") return t("events.formSubmitted");
		if (event === "form_viewed") return t("events.formViewed");
		if (event === "form_started") return t("events.formStarted");
		return event;
	};
	const [isTesting, setIsTesting] = useState(false);
	const [testResult, setTestResult] = useState<{
		success: boolean;
		message: string;
	} | null>(null);
	const [mode, setMode] = useState<"real" | "success" | "failure">("real");

	if (!webhook) return null;

	const handleTest = async () => {
		setIsTesting(true);
		setTestResult(null);

		try {
			const res = await fetch(`/api/webhook/${webhook.id}/test`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body:
					mode === "real"
						? undefined
						: JSON.stringify({
								simulate: mode === "success" ? "success" : "failure",
							}),
			});
			const data = await res.json();

			if (res.ok) {
				setTestResult({
					success: true,
					message: data.message || t("testSent"),
				});
			} else {
				setTestResult({
					success: false,
					message: data.error || t("testFailed"),
				});
			}
		} catch (error) {
			setTestResult({
				success: false,
				message: t("testFailedNetwork"),
			});
		} finally {
			setIsTesting(false);
		}
	};

	const handleClose = () => {
		setTestResult(null);
		setIsTesting(false);
		setMode("real");
		onClose();
	};

	return (
		<Dialog onOpenChange={handleClose} open={open}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>{t("title")}</DialogTitle>
					<DialogDescription>
						{t("description")}
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-6">
					<section className="flex flex-col gap-2">
						<h3 className="font-medium text-sm">{t("endpointTitle")}</h3>
						<div className="rounded-md border bg-accent/40">
							<div className="grid gap-3 p-4 sm:grid-cols-2">
								<div className="flex flex-col gap-1">
									<Label className="text-muted-foreground text-xs">
										{t("nameLabel")}
									</Label>
									<div className="truncate text-sm">
										{webhook.name || t("untitledWebhook")}
									</div>
								</div>
								{webhook.description ? (
									<div className="flex flex-col gap-1">
										<Label className="text-muted-foreground text-xs">
											{t("descriptionLabel")}
										</Label>
										<div className="truncate text-muted-foreground text-xs">
											{webhook.description}
										</div>
									</div>
								) : null}
								<div className="flex flex-col gap-1 sm:col-span-2">
									<Label className="text-muted-foreground text-xs">
										{t("urlLabel")}
									</Label>
									<ScrollArea className="max-h-16 rounded border bg-background p-2">
										<code className="block break-all font-mono text-muted-foreground text-xs">
											{webhook.url}
										</code>
									</ScrollArea>
								</div>
								<div className="flex items-center gap-2">
									<Label className="text-muted-foreground text-xs">
										{t("methodLabel")}
									</Label>
									<Badge className="font-mono">{webhook.method}</Badge>
								</div>
							</div>
						</div>
					</section>

					<section className="flex flex-col gap-2">
						<h3 className="font-medium text-sm">{t("triggersTitle")}</h3>
						<div className="rounded-md border p-3">
							<ScrollArea className="max-h-24">
								<div className="flex flex-wrap gap-2">
									{webhook.events.map((event) => (
										<Badge key={event} variant="secondary">
											{getEventLabel(event)}
										</Badge>
									))}
								</div>
							</ScrollArea>
						</div>
					</section>

					<Separator />

					<section className="flex flex-col gap-2">
						<h3 className="font-medium text-sm">{t("modeTitle")}</h3>
						<RadioGroup
							className="grid grid-cols-3 gap-2"
							onValueChange={(v) => setMode(v as any)}
							value={mode}
						>
							<Label
								className="flex cursor-pointer items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-accent/50"
								htmlFor="mode-real"
							>
								<RadioGroupItem id="mode-real" value="real" /> {t("mode.real")}
							</Label>
							<Label
								className="flex cursor-pointer items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-accent/50"
								htmlFor="mode-success"
							>
								<RadioGroupItem id="mode-success" value="success" />{" "}
								{t("mode.success")}
							</Label>
							<Label
								className="flex cursor-pointer items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-accent/50"
								htmlFor="mode-failure"
							>
								<RadioGroupItem id="mode-failure" value="failure" />{" "}
								{t("mode.failure")}
							</Label>
						</RadioGroup>
					</section>

					{testResult && (
						<section>
							<div
								className={`rounded-md border p-4 ${testResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
							>
								<div className="flex items-center gap-2">
									{testResult.success ? (
										<CheckCircle className="size-4 text-green-600" />
									) : (
										<XCircle className="size-4 text-red-600" />
									)}
									<span
										className={`font-medium text-sm ${testResult.success ? "text-green-800" : "text-red-800"}`}
									>
										{testResult.success ? t("success") : t("failed")}
									</span>
								</div>
								<p
									className={`mt-1 text-sm ${testResult.success ? "text-green-700" : "text-red-700"}`}
								>
									{testResult.message}
								</p>
							</div>
						</section>
					)}

					<DialogFooter>
						<Button
							disabled={isTesting}
							onClick={handleClose}
							variant="outline"
						>
							{t("close")}
						</Button>
						<Button
							disabled={isTesting}
							loading={isTesting}
							onClick={handleTest}
						>
							{t("sendTest")}
						</Button>
					</DialogFooter>
				</div>
			</DialogContent>
		</Dialog>
	);
}
