import { CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
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
					message: data.message || "Test sent successfully!",
				});
			} else {
				setTestResult({
					success: false,
					message: data.error || "Test failed",
				});
			}
		} catch (error) {
			setTestResult({
				success: false,
				message: "Test failed - Network error",
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
					<DialogTitle>Test Webhook</DialogTitle>
					<DialogDescription>
						Send a test request to verify your webhook configuration
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-6">
					<section className="flex flex-col gap-2">
						<h3 className="font-medium text-sm">Endpoint</h3>
						<div className="rounded-md border bg-accent/40">
							<div className="grid gap-3 p-4 sm:grid-cols-2">
								<div className="flex flex-col gap-1">
									<Label className="text-muted-foreground text-xs">Name</Label>
									<div className="truncate text-sm">
										{webhook.name || "(Untitled webhook)"}
									</div>
								</div>
								{webhook.description ? (
									<div className="flex flex-col gap-1">
										<Label className="text-muted-foreground text-xs">
											Description
										</Label>
										<div className="truncate text-muted-foreground text-xs">
											{webhook.description}
										</div>
									</div>
								) : null}
								<div className="flex flex-col gap-1 sm:col-span-2">
									<Label className="text-muted-foreground text-xs">URL</Label>
									<ScrollArea className="max-h-16 rounded border bg-background p-2">
										<code className="block break-all font-mono text-muted-foreground text-xs">
											{webhook.url}
										</code>
									</ScrollArea>
								</div>
								<div className="flex items-center gap-2">
									<Label className="text-muted-foreground text-xs">
										Method
									</Label>
									<Badge className="font-mono">{webhook.method}</Badge>
								</div>
							</div>
						</div>
					</section>

					<section className="flex flex-col gap-2">
						<h3 className="font-medium text-sm">Triggers</h3>
						<div className="rounded-md border p-3">
							<ScrollArea className="max-h-24">
								<div className="flex flex-wrap gap-2">
									{webhook.events.map((event) => (
										<Badge key={event} variant="secondary">
											{event}
										</Badge>
									))}
								</div>
							</ScrollArea>
						</div>
					</section>

					<Separator />

					<section className="flex flex-col gap-2">
						<h3 className="font-medium text-sm">Mode</h3>
						<RadioGroup
							className="grid grid-cols-3 gap-2"
							onValueChange={(v) => setMode(v as any)}
							value={mode}
						>
							<Label
								className="flex cursor-pointer items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-accent/50"
								htmlFor="mode-real"
							>
								<RadioGroupItem id="mode-real" value="real" /> Real
							</Label>
							<Label
								className="flex cursor-pointer items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-accent/50"
								htmlFor="mode-success"
							>
								<RadioGroupItem id="mode-success" value="success" /> Success
							</Label>
							<Label
								className="flex cursor-pointer items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-accent/50"
								htmlFor="mode-failure"
							>
								<RadioGroupItem id="mode-failure" value="failure" /> Failure
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
										{testResult.success ? "Success!" : "Failed"}
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
							Close
						</Button>
						<Button
							disabled={isTesting}
							loading={isTesting}
							onClick={handleTest}
						>
							Send Test
						</Button>
					</DialogFooter>
				</div>
			</DialogContent>
		</Dialog>
	);
}
