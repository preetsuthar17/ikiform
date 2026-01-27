import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import type {
	WebhookConfig,
	WebhookMethod,
} from "../hooks/useWebhookManagement";

const EVENT_OPTIONS = [
	{ label: "Form Submitted", value: "form_submitted" },
	{ label: "Form Viewed", value: "form_viewed" },
	{ label: "Form Started", value: "form_started" },
];

const HTTP_METHODS: {
	value: WebhookMethod;
	label: string;
	description: string;
}[] = [
	{ value: "GET", label: "GET", description: "Retrieve data (no body)" },
	{ value: "POST", label: "POST", description: "Create or submit data" },
	{ value: "PUT", label: "PUT", description: "Update entire resource" },
	{ value: "PATCH", label: "PATCH", description: "Update partial resource" },
	{ value: "DELETE", label: "DELETE", description: "Remove resource" },
	{ value: "HEAD", label: "HEAD", description: "Get headers only" },
];

export function WebhookFormModal({
	open,
	onClose,
	onSave,
	initialWebhook,
	loading,
}: {
	open: boolean;
	onClose: () => void;
	onSave: (webhook: Partial<WebhookConfig>) => void;
	initialWebhook?: WebhookConfig;
	loading?: boolean;
}) {
	const steps = [
		{ id: "details", label: "Details", required: false },
		{ id: "basics", label: "Basics", required: true },
		{ id: "events", label: "Events", required: true },
		{ id: "headers", label: "Headers", required: false },
		{ id: "payload", label: "Payload", required: false },
		{ id: "notifications", label: "Notifications", required: false },
	] as const;

	const [currentStep, setCurrentStep] = useState(0);
	const [name, setName] = useState(initialWebhook?.name || "");
	const [description, setDescription] = useState(
		initialWebhook?.description || ""
	);
	const [url, setUrl] = useState(initialWebhook?.url || "");
	const [events, setEvents] = useState<string[]>(initialWebhook?.events || []);
	const [method, setMethod] = useState<WebhookMethod>(
		initialWebhook?.method || "POST"
	);
	const [headers, setHeaders] = useState<{ name: string; value: string }[]>(
		initialWebhook?.headers
			? Object.entries(initialWebhook.headers).map(([name, value]) => ({
					name,
					value,
				}))
			: []
	);
	const [payloadTemplate, setPayloadTemplate] = useState(
		initialWebhook?.payloadTemplate || ""
	);

	const [notificationEmail, setNotificationEmail] = useState(
		initialWebhook?.notificationEmail || ""
	);
	const [notifyOnSuccess, setNotifyOnSuccess] = useState(
		initialWebhook?.notifyOnSuccess ?? false
	);
	const [notifyOnFailure, setNotifyOnFailure] = useState(
		initialWebhook?.notifyOnFailure ?? true
	);

	const [formError, setFormError] = useState<string | null>(null);
	const urlInputRef = useRef<HTMLInputElement | null>(null);
	const nameInputRef = useRef<HTMLInputElement | null>(null);
	const firstEventCheckboxRef = useRef<HTMLButtonElement | null>(null);
	const firstHeaderInputRef = useRef<HTMLInputElement | null>(null);
	const payloadTextareaRef = useRef<HTMLTextAreaElement | null>(null);
	const notificationEmailRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		setName(initialWebhook?.name || "");
		setDescription(initialWebhook?.description || "");
		setUrl(initialWebhook?.url || "");
		setEvents(initialWebhook?.events || []);
		setMethod(initialWebhook?.method || "POST");
		setHeaders(
			initialWebhook?.headers
				? Object.entries(initialWebhook.headers).map(([name, value]) => ({
						name,
						value,
					}))
				: []
		);
		setPayloadTemplate(initialWebhook?.payloadTemplate || "");
		setNotificationEmail(initialWebhook?.notificationEmail || "");
		setNotifyOnSuccess(initialWebhook?.notifyOnSuccess ?? false);
		setNotifyOnFailure(initialWebhook?.notifyOnFailure ?? true);
	}, [initialWebhook, open]);

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setFormError(null);

		if (!(url && Array.isArray(events)) || events.length === 0 || !method) {
			setFormError(
				"Please provide a Webhook URL, select at least one event, and choose a method."
			);
			requestAnimationFrame(() => {
				urlInputRef.current?.focus();
			});
			return;
		}
		onSave({
			name: name || undefined,
			description: description || undefined,
			url,
			events,
			method,
			headers: Object.fromEntries(
				headers
					.filter((h) => h.name.trim() && h.value.trim())
					.map((h) => [h.name, h.value])
			),
			payloadTemplate,
			notificationEmail: notificationEmail || undefined,
			notifyOnSuccess,
			notifyOnFailure,
		});
	}

	function handleClose() {
		onClose();
		setName("");
		setDescription("");
		setUrl("");
		setEvents([]);
		setMethod("POST");
		setHeaders([]);
		setPayloadTemplate("");
		setNotificationEmail("");
		setNotifyOnSuccess(false);
		setNotifyOnFailure(true);
		setFormError(null);
	}

	const headerEntries = useMemo(() => {
		const entries = headers.map((h) => [h.name, h.value] as [string, string]);
		return entries.length > 0 ? entries : ([["", ""]] as [string, string][]);
	}, [headers]);

	const hasHeaders = useMemo(() => headers.length > 0, [headers]);

	function updateHeaderAt(index: number, key: string, value: string) {
		const newHeaders = [...headers];
		if (index < newHeaders.length) {
			newHeaders[index] = { name: key, value };
		} else {
			newHeaders.push({ name: key, value });
		}
		const cleaned = newHeaders.filter(
			(h) => h.name.trim() !== "" || h.value.trim() !== ""
		);
		setHeaders(cleaned);
	}

	function addHeaderRow() {
		setHeaders([...headers, { name: "", value: "" }]);
	}

	function removeHeaderAt(index: number) {
		const newHeaders = headers.filter((_, i) => i !== index);
		setHeaders(newHeaders);
	}

	function toggleAllEvents(selectAll: boolean) {
		setEvents(selectAll ? EVENT_OPTIONS.map((e) => e.value) : []);
	}

	useEffect(() => {
		const content = document.querySelector(
			'[data-slot="scroll-area-viewport"]'
		) as HTMLElement | null;
		content?.scrollTo({ top: 0, behavior: "smooth" });

		const stepId = steps[currentStep]?.id;
		if (stepId === "basics") {
			urlInputRef.current?.focus();
			return;
		}
		if (stepId === "details") {
			nameInputRef.current?.focus();
			return;
		}
		if (stepId === "events") {
			firstEventCheckboxRef.current?.focus();
			return;
		}
		if (stepId === "headers") {
			firstHeaderInputRef.current?.focus();
			return;
		}
		if (stepId === "payload") {
			payloadTextareaRef.current?.focus();
			return;
		}
		if (stepId === "notifications") {
			notificationEmailRef.current?.focus();
			return;
		}
	}, [currentStep]);

	function canProceedFromStep(stepIndex: number) {
		const stepId = steps[stepIndex]?.id;
		if (stepId === "basics" && !(url && method)) {
			setFormError("Please provide a Webhook URL and select a method.");
			requestAnimationFrame(() => {
				urlInputRef.current?.focus();
			});
			return false;
		}
		if (
			stepId === "events" &&
			(!Array.isArray(events) || events.length === 0)
		) {
			setFormError("Please select at least one event.");
			return false;
		}
		setFormError(null);
		return true;
	}

	function goNext() {
		if (!canProceedFromStep(currentStep)) return;
		setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
	}

	function goBack() {
		setFormError(null);
		setCurrentStep((s) => Math.max(s - 1, 0));
	}

	return (
		<Dialog onOpenChange={handleClose} open={open}>
			<DialogContent className="flex w-full max-w-4xl grow flex-col gap-0 p-0">
				<div className="px-6 pt-5 pb-3">
					<DialogHeader className="flex flex-row items-center justify-between p-0">
						<DialogTitle>
							{initialWebhook ? "Edit Webhook" : "Add Webhook"}
						</DialogTitle>
					</DialogHeader>
					{formError ? (
						<div
							aria-live="polite"
							className="mt-3 rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-destructive text-sm"
						>
							{formError}
						</div>
					) : null}
				</div>
				<Separator />
				<form
					className="flex min-h-0 flex-1 flex-col justify-between"
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
							const target = e.target as HTMLElement | null;
							const tag = target?.tagName?.toLowerCase();
							const isTextarea = tag === "textarea";
							const isButton = tag === "button";
							if (isButton) return;
							if (isTextarea) return;
							if (currentStep < steps.length - 1) {
								e.preventDefault();
								goNext();
							}
						}
					}}
					onSubmit={handleSubmit}
				>
					<div className="flex items-center gap-3 px-6 py-3">
						<ol aria-label="Steps" className="flex items-center gap-2 text-sm">
							{steps.map((step, idx) => {
								const isCurrent = idx === currentStep;
								const isCompleted = idx < currentStep;
								return (
									<li className="flex items-center gap-2" key={step.id}>
										<div
											aria-current={isCurrent ? "step" : undefined}
											className={
												"grid size-6 place-items-center rounded-full border" +
												(isCurrent
													? "border-primary bg-primary text-primary-foreground"
													: isCompleted
														? "border-accent bg-accent text-foreground"
														: "border-muted-foreground/20 bg-muted text-muted-foreground")
											}
										>
											{idx + 1}
										</div>
										<span
											className={
												"hidden sm:block" +
												(isCurrent ? "font-medium" : "text-muted-foreground")
											}
										>
											{step.label}
										</span>
										{idx < steps.length - 1 ? (
											<span className="text-muted-foreground/50">›</span>
										) : null}
									</li>
								);
							})}
						</ol>
					</div>
					<Separator />
					<ScrollArea className="flex-1">
						<div className="flex flex-col gap-6 px-6 py-5">
							{steps[currentStep]?.id === "details" ? (
								<div className="flex flex-col gap-3">
									<div className="grid gap-4 md:grid-cols-2">
										<div className="flex flex-col gap-2">
											<Label htmlFor="webhook-name">Name (optional)</Label>
											<Input
												autoComplete="off"
												id="webhook-name"
												onChange={(e) => setName(e.target.value)}
												placeholder="Production Webhook"
												ref={nameInputRef}
												value={name}
											/>
										</div>
										<div className="flex flex-col gap-2">
											<Label htmlFor="webhook-description">
												Description (optional)
											</Label>
											<Input
												autoComplete="off"
												id="webhook-description"
												onChange={(e) => setDescription(e.target.value)}
												placeholder="Sends submissions to our backend"
												value={description}
											/>
										</div>
									</div>
								</div>
							) : null}
							{steps[currentStep]?.id === "basics" ? (
								<div className="flex flex-col gap-3">
									<div className="grid gap-4 md:grid-cols-2">
										<div className="flex flex-col gap-2">
											<Label htmlFor="webhook-url">Webhook URL</Label>
											<Input
												autoFocus
												id="webhook-url"
												inputMode="url"
												onChange={(e) => setUrl(e.target.value)}
												placeholder="https://example.com/webhook"
												ref={urlInputRef}
												required
												type="url"
												value={url}
											/>
										</div>
										<div className="flex flex-col gap-2">
											<Label htmlFor="webhook-method">HTTP Method</Label>
											<Select
												onValueChange={(val) => setMethod(val as WebhookMethod)}
												value={method}
											>
												<SelectTrigger
													aria-label="Select HTTP method"
													className="text-left"
													id="webhook-method"
												>
													<SelectValue
														className="flex items-center"
														placeholder="Select method"
													/>
												</SelectTrigger>
												<SelectContent>
													<div className="max-h-64 overflow-y-auto">
														{HTTP_METHODS.map((httpMethod) => (
															<SelectItem
																className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 outline-none transition-colors focus:bg-accent focus:text-accent-foreground"
																description={httpMethod.description}
																key={httpMethod.value}
																value={httpMethod.value}
															>
																<span className="font-medium">
																	{httpMethod.label}
																</span>
															</SelectItem>
														))}
													</div>
												</SelectContent>
											</Select>
										</div>
									</div>
								</div>
							) : null}

							{steps[currentStep]?.id === "events" ? (
								<div className="flex flex-col gap-3">
									<div className="flex items-center justify-between gap-2">
										<p
											className="text-muted-foreground text-xs"
											id="events-help"
										>
											Choose when to trigger this webhook.
										</p>
										<div className="flex gap-2">
											<Button
												onClick={() => toggleAllEvents(true)}
												size="sm"
												type="button"
												variant="outline"
											>
												Select all
											</Button>
											<Button
												onClick={() => toggleAllEvents(false)}
												size="sm"
												type="button"
												variant="outline"
											>
												Clear
											</Button>
										</div>
									</div>
									<fieldset
										aria-describedby="events-help"
										className="grid grid-cols-1 gap-3 sm:grid-cols-2"
									>
										{EVENT_OPTIONS.map((opt) => {
											const checked = events.includes(opt.value);
											return (
												<Label
													className="flex cursor-pointer items-center gap-3 rounded-md border p-3 hover:bg-accent/30"
													key={opt.value}
												>
													<Checkbox
														aria-label={opt.label}
														checked={checked}
														onCheckedChange={(v) =>
															setEvents((prev) =>
																v
																	? Array.from(new Set([...prev, opt.value]))
																	: prev.filter((e) => e !== opt.value)
															)
														}
														ref={
															opt.value === EVENT_OPTIONS[0].value
																? firstEventCheckboxRef
																: undefined
														}
													/>
													<span className="text-sm">{opt.label}</span>
												</Label>
											);
										})}
									</fieldset>
								</div>
							) : null}

							{steps[currentStep]?.id === "headers" ? (
								<div className="flex flex-col gap-3">
									<p className="text-muted-foreground text-xs">
										Optional HTTP headers sent with each request.
									</p>
									<div className="flex flex-col gap-3">
										{headerEntries.map(([k, v], i) => (
											<div
												className="grid grid-cols-12 items-end gap-2"
												key={i}
											>
												<div className="col-span-5 flex flex-col gap-2">
													<Label htmlFor={`header-name-${i}`}>
														Header name
													</Label>
													<Input
														aria-label={`Header ${i + 1} name`}
														id={`header-name-${i}`}
														onChange={(e) =>
															updateHeaderAt(i, e.target.value, v)
														}
														placeholder="Header name (e.g., Authorization)"
														ref={i === 0 ? firstHeaderInputRef : undefined}
														value={k}
													/>
												</div>
												<div className="col-span-6 flex flex-col gap-2">
													<Label htmlFor={`header-value-${i}`}>
														Header value
													</Label>
													<Input
														aria-label={`Header ${i + 1} value`}
														id={`header-value-${i}`}
														onChange={(e) =>
															updateHeaderAt(i, k, e.target.value)
														}
														placeholder="Header value"
														value={v}
													/>
												</div>
												<div className="col-span-1 flex justify-end">
													<Button
														aria-label={`Remove header ${i + 1}`}
														onClick={() => removeHeaderAt(i)}
														type="button"
														variant="outline"
													>
														−
													</Button>
												</div>
											</div>
										))}
										<div>
											<Button
												onClick={addHeaderRow}
												type="button"
												variant="secondary"
											>
												Add header
											</Button>
										</div>
									</div>
								</div>
							) : null}

							{steps[currentStep]?.id === "payload" ? (
								<div className="flex flex-col gap-4">
									<div className="flex flex-col gap-4">
										<div className="flex min-w-[250px] flex-1 flex-col gap-2">
											<Label htmlFor="webhook-payload">
												Payload Template (optional)
											</Label>
											<Textarea
												className="min-h-[140px] font-mono"
												id="webhook-payload"
												onChange={(e) => setPayloadTemplate(e.target.value)}
												placeholder='{"event": "{{event}}", "formId": "{{formId}}", "fields": {{formatted.fields}} }'
												ref={payloadTextareaRef}
												value={payloadTemplate}
											/>
										</div>
										<div className="min-w-[250px] flex-1">
											<div className="flex flex-col gap-2 rounded border p-3 text-sm">
												<b>Available Variables:</b>
												<ul className="flex flex-col gap-2 text-xs">
													<li>
														<code>{"{{event}}"}</code> - Event type (e.g.,
														form_submitted)
													</li>
													<li>
														<code>{"{{formId}}"}</code> - Form ID
													</li>
													<li>
														<code>{"{{formData}}"}</code> - Raw form data
													</li>
													<li>
														<code>{"{{formatted}}"}</code> - Human-friendly
														formatted data
													</li>
													<li>
														<code>{"{{timestamp}}"}</code> - ISO timestamp
													</li>
													<li>
														<code>{"{{submissionId}}"}</code> - Submission ID
													</li>
												</ul>
											</div>
										</div>
									</div>
								</div>
							) : null}

							{steps[currentStep]?.id === "notifications" ? (
								<div className="flex flex-col gap-4">
									<div className="flex flex-col gap-4">
										<div className="flex flex-col gap-2">
											<Label htmlFor="notification-email">
												Notification Email (optional)
											</Label>
											<Input
												autoComplete="email"
												id="notification-email"
												inputMode="email"
												onChange={(e) => setNotificationEmail(e.target.value)}
												placeholder="you@example.com"
												ref={notificationEmailRef}
												type="email"
												value={notificationEmail}
											/>
										</div>
										<div className="flex items-end gap-4">
											<Label className="flex cursor-pointer items-center gap-2">
												<Checkbox
													checked={notifyOnSuccess}
													onCheckedChange={(checked) =>
														setNotifyOnSuccess(!!checked)
													}
												/>
												<span className="text-sm">Email on success</span>
											</Label>
											<Label className="flex cursor-pointer items-center gap-2">
												<Checkbox
													checked={notifyOnFailure}
													onCheckedChange={(checked) =>
														setNotifyOnFailure(!!checked)
													}
												/>
												<span className="text-sm">Email on failure</span>
											</Label>
										</div>
									</div>
								</div>
							) : null}
						</div>
					</ScrollArea>

					<Separator />
					<div className="flex items-center justify-between gap-2 px-6 py-4">
						<div className="flex items-center gap-2">
							<Button onClick={handleClose} type="button" variant="outline">
								Cancel
							</Button>
						</div>
						<div className="flex items-center gap-2">
							<Button
								disabled={currentStep === 0}
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									goBack();
								}}
								type="button"
								variant="outline"
							>
								Back
							</Button>
							{currentStep < steps.length - 1 ? (
								<Button
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										goNext();
									}}
									type="button"
								>
									{steps[currentStep]?.required
										? "Next"
										: (steps[currentStep]?.id === "details" &&
													(name.trim() || description.trim())) ||
												(steps[currentStep]?.id === "headers" && hasHeaders) ||
												(steps[currentStep]?.id === "payload" &&
													payloadTemplate.trim())
											? "Next"
											: "Skip"}
								</Button>
							) : (
								<Button disabled={loading} loading={loading} type="submit">
									{initialWebhook ? "Update" : "Create"} Webhook
								</Button>
							)}
						</div>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
