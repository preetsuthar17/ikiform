import { useEffect, useState } from "react";
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
import type { LocalSettings, NotificationSettings } from "../types";

interface NotificationsSectionProps {
	localSettings: LocalSettings;
	updateNotifications: (updates: Partial<NotificationSettings>) => void;
	formId?: string;
	schema?: any;
}

export function NotificationsSection({
	localSettings,
	updateNotifications,
	formId,
	schema,
	onSchemaUpdate,
}: NotificationsSectionProps & {
	onSchemaUpdate?: (updates: Partial<any>) => void;
}) {
	const notifications = localSettings.notifications || {};
	const customLinks = notifications.customLinks || [];
	const [newLink, setNewLink] = useState({ label: "", url: "" });
	const [hasChanges, setHasChanges] = useState(false as boolean);
	const [saving, setSaving] = useState(false as boolean);
	const [saved, setSaved] = useState(false as boolean);

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

	const wrappedUpdate = (updates: Partial<NotificationSettings>) => {
		updateNotifications(updates);
		setHasChanges(true);
		setSaved(false);
	};

	const handleAddLink = () => {
		if (newLink.label && newLink.url) {
			wrappedUpdate({ customLinks: [...customLinks, newLink] });
			setNewLink({ label: "", url: "" });
		}
	};

	const handleRemoveLink = (idx: number) => {
		const updated = customLinks.filter((_, i) => i !== idx);
		wrappedUpdate({ customLinks: updated });
	};

	const resetNotifications = () => {
		const original = (schema?.settings as any)?.notifications || {};
		updateNotifications(original);
		setHasChanges(false);
	};

	const saveNotifications = async () => {
		if (!formId) {
			toast.error("Form ID is required to save settings");
			return;
		}
		setSaving(true);
		try {
			const trimmed = {
				...localSettings.notifications,
				email: (localSettings.notifications?.email || "").trim(),
				subject: (localSettings.notifications?.subject || "").trim(),
				message: (localSettings.notifications?.message || "").trim(),
				customLinks: (localSettings.notifications?.customLinks || []).map(
					(link) => ({
						label: link.label.trim(),
						url: link.url.trim(),
					})
				),
			};
			if (onSchemaUpdate) {
				await onSchemaUpdate({
					settings: {
						...schema.settings,
						notifications: trimmed,
					},
				});
			}
			setSaved(true);
			setHasChanges(false);
			toast.success("Notification settings saved successfully");
			setTimeout(() => setSaved(false), 2000);
		} catch (e) {
			console.error(e);
			toast.error("Failed to save notification settings");
		} finally {
			setSaving(false);
		}
	};

	useEffect(() => {
		if (saved) {
			const announcement = document.createElement("div");
			announcement.setAttribute("aria-live", "polite");
			announcement.setAttribute("aria-atomic", "true");
			announcement.className = "sr-only";
			announcement.textContent = "Notification settings saved successfully";
			document.body.appendChild(announcement);
			setTimeout(() => {
				document.body.removeChild(announcement);
			}, 1000);
		}
	}, [saved]);

	return (
		<Card
			aria-labelledby="notifications-title"
			className="shadow-none"
			onKeyDown={(e) => {
				const target = e.target as HTMLElement;
				const isTextarea = target.tagName === "TEXTAREA";
				if (isTextarea && e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
					e.preventDefault();
					saveNotifications();
				}
			}}
			role="region"
			style={{
				overscrollBehavior: "contain",
			}}
		>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle
							className="flex items-center gap-2 text-lg tracking-tight"
							id="notifications-title"
						>
							Notifications{" "}
							{hasChanges && (
								<Badge className="gap-2" variant="secondary">
									<div className="size-2 rounded-full bg-orange-500" />
									Unsaved changes
								</Badge>
							)}
						</CardTitle>
						<CardDescription id="notifications-description">
							Configure email alerts for new form submissions
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent className="flex flex-col gap-6">
				<div className="flex items-center justify-between">
					<div className="flex flex-col gap-1">
						<Label
							className="font-medium text-sm"
							htmlFor="notifications-enabled"
						>
							Email Notifications
						</Label>
						<p className="text-muted-foreground text-xs">
							Enable email notifications for new submissions
						</p>
					</div>
					<Switch
						checked={!!notifications.enabled}
						id="notifications-enabled"
						onCheckedChange={(checked) => wrappedUpdate({ enabled: checked })}
					/>
				</div>
				{notifications.enabled && (
					<div className="flex flex-col gap-2">
						<Label htmlFor="notification-email">Notification Email</Label>
						<Input
							autoComplete="email"
							disabled={!notifications.enabled}
							id="notification-email"
							name="notification-email"
							onChange={(e) => wrappedUpdate({ email: e.target.value })}
							onKeyDown={(e) => {
								if (e.key === "Escape") {
									(e.target as HTMLElement).blur();
								}
							}}
							placeholder="owner@email.com"
							type="email"
							value={notifications.email || ""}
						/>
					</div>
				)}
				{notifications.enabled && (
					<div className="flex flex-col gap-2">
						<Label htmlFor="notification-subject">Email Subject</Label>
						<Input
							disabled={!notifications.enabled}
							id="notification-subject"
							name="notification-subject"
							onChange={(e) => wrappedUpdate({ subject: e.target.value })}
							onKeyDown={(e) => {
								if (e.key === "Escape") {
									(e.target as HTMLElement).blur();
								}
							}}
							placeholder="New Form Submission"
							value={notifications.subject || "New Form Submission"}
						/>
					</div>
				)}
				{notifications.enabled && (
					<div className="flex flex-col gap-2">
						<Label htmlFor="notification-message">Email Message</Label>
						<Textarea
							disabled={!notifications.enabled}
							id="notification-message"
							name="notification-message"
							onChange={(e) => wrappedUpdate({ message: e.target.value })}
							onKeyDown={(e) => {
								if (e.key === "Escape") {
									(e.target as HTMLElement).blur();
								}
							}}
							placeholder="You have received a new submission on your form."
							rows={3}
							value={
								notifications.message ||
								"You have received a new submission on your form."
							}
						/>
					</div>
				)}
				{notifications.enabled && (
					<div className="flex flex-col gap-2">
						<Label>Custom Links</Label>
						<div className="flex flex-col gap-2">
							{customLinks.map((link, idx) => (
								<div className="flex items-center gap-2" key={idx}>
									<Input
										disabled={!notifications.enabled}
										name={`custom-link-label-${idx}`}
										onChange={(e) => {
											const updated = [...customLinks];
											updated[idx] = { ...updated[idx], label: e.target.value };
											wrappedUpdate({ customLinks: updated });
										}}
										onKeyDown={(e) => {
											if (e.key === "Escape") {
												(e.target as HTMLElement).blur();
											}
										}}
										placeholder="Label"
										value={link.label}
									/>
									<Input
										autoComplete="url"
										disabled={!notifications.enabled}
										inputMode="url"
										name={`custom-link-url-${idx}`}
										onChange={(e) => {
											const updated = [...customLinks];
											updated[idx] = { ...updated[idx], url: e.target.value };
											wrappedUpdate({ customLinks: updated });
										}}
										onKeyDown={(e) => {
											if (e.key === "Escape") {
												(e.target as HTMLElement).blur();
											}
										}}
										placeholder="https://example.com"
										type="url"
										value={link.url}
									/>
									<Button
										disabled={!notifications.enabled}
										onClick={() => handleRemoveLink(idx)}
										size="sm"
										type="button"
										variant="destructive"
									>
										Remove
									</Button>
								</div>
							))}
						</div>
						<div className="flex gap-2">
							<Input
								disabled={!notifications.enabled}
								name="new-link-label"
								onChange={(e) =>
									setNewLink((l) => ({ ...l, label: e.target.value }))
								}
								onKeyDown={(e) => {
									if (e.key === "Escape") {
										(e.target as HTMLElement).blur();
									}
								}}
								placeholder="Label"
								value={newLink.label}
							/>
							<Input
								autoComplete="url"
								disabled={!notifications.enabled}
								inputMode="url"
								name="new-link-url"
								onChange={(e) =>
									setNewLink((l) => ({ ...l, url: e.target.value }))
								}
								onKeyDown={(e) => {
									if (e.key === "Escape") {
										(e.target as HTMLElement).blur();
									}
								}}
								placeholder="https://example.com"
								type="url"
								value={newLink.url}
							/>
							<Button
								disabled={!notifications.enabled}
								onClick={handleAddLink}
								type="button"
							>
								Add
							</Button>
						</div>
					</div>
				)}

				<div
					aria-label="Notification settings actions"
					className="flex items-center justify-between"
					role="group"
				>
					<div className="flex items-center gap-2">
						{hasChanges && (
							<Button
								className="gap-2 text-muted-foreground hover:text-foreground"
								onClick={resetNotifications}
								size="sm"
								variant="ghost"
							>
								Reset
							</Button>
						)}
					</div>
					<div className="flex items-center gap-2">
						<Button
							aria-describedby="notifications-description"
							aria-label="Save notification settings"
							disabled={saving || !hasChanges}
							loading={saving}
							onClick={saveNotifications}
						>
							Save
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
