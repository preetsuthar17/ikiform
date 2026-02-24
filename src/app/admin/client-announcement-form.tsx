"use client";

import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/toast";
import { sendAnnouncementAction } from "./actions";

export function ClientAnnouncementForm() {
	const t = useTranslations("dashboard.admin.announcementForm");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const toRef = useRef<HTMLTextAreaElement | null>(null);

	const handlePrefill = async () => {
		if (!toRef.current) {
			return;
		}
		setIsSubmitting(true);
		const res = await fetch("/api/users/emails", { cache: "no-store" });
		setIsSubmitting(false);
		if (!res.ok) {
			toast.error(t("toasts.fetchEmailsFailed"));
			return;
		}
		const json = (await res.json()) as { emails: string[] };
		toRef.current.value = json.emails.join(", ");
		toast.success(t("toasts.loadedEmails", { count: json.emails.length }));
	};

	const action = async (formData: FormData) => {
		setIsSubmitting(true);
		const p = sendAnnouncementAction(formData);
		toast.promise(p, {
			loading: t("toasts.sending"),
			success: (res) =>
				res.ok
					? t("toasts.sentCount", { count: res.sent })
					: t("toasts.failedWithError", { error: res.error }),
			error: (e) =>
				e instanceof Error ? e.message : t("toasts.failedToSendFallback"),
		});
		const res = await p;
		setIsSubmitting(false);
		return res;
	};

	return (
		<form
			className="grid gap-4"
			onSubmit={async (e) => {
				e.preventDefault();
				const formData = new FormData(e.currentTarget);
				await action(formData);
			}}
		>
			<Toaster />
			<div className="grid gap-2">
				<Label htmlFor="to">{t("labels.recipientEmails")}</Label>
				<Textarea
					id="to"
					name="to"
					placeholder={t("placeholders.recipientEmails")}
					ref={toRef}
					required
					rows={4}
				/>
				<div className="flex items-center justify-between">
					<p className="text-muted-foreground text-xs">
						{t("help.recipientFormat")}
					</p>
					<Button
						disabled={isSubmitting}
						onClick={handlePrefill}
						type="button"
						variant="ghost"
					>
						{isSubmitting ? t("actions.loading") : t("actions.prefillFromUsers")}
					</Button>
				</div>
			</div>

			<div className="grid gap-2">
				<Label htmlFor="subject">{t("labels.subject")}</Label>
				<Input
					id="subject"
					name="subject"
					placeholder={t("placeholders.subject")}
					required
				/>
			</div>

			<div className="grid gap-2">
				<Label htmlFor="content">{t("labels.content")}</Label>
				<Textarea
					id="content"
					name="content"
					placeholder={t("placeholders.content")}
					required
					rows={10}
				/>
			</div>

			<div className="flex justify-end">
				<Button disabled={isSubmitting} loading={isSubmitting} type="submit">
					{t("actions.sendAnnouncement")}
				</Button>
			</div>
		</form>
	);
}
