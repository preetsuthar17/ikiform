"use client";

import * as React from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/toast";
import { sendAnnouncementAction } from "./actions";

export function ClientAnnouncementForm() {
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const toRef = React.useRef<HTMLTextAreaElement | null>(null);

	const handlePrefill = async () => {
		if (!toRef.current) return;
		setIsSubmitting(true);
		const res = await fetch("/api/users/emails", { cache: "no-store" });
		setIsSubmitting(false);
		if (!res.ok) {
			toast.error("Failed to fetch emails");
			return;
		}
		const json = (await res.json()) as { emails: string[] };
		toRef.current.value = json.emails.join(", ");
		toast.success(`Loaded ${json.emails.length} emails`);
	};

	const action = async (formData: FormData) => {
		setIsSubmitting(true);
		const p = sendAnnouncementAction(formData);
		toast.promise(p, {
			loading: "Sending announcements...",
			success: (res) =>
				res.ok ? `Sent ${res.sent} email(s)` : `Failed: ${res.error}`,
			error: (e) => (e instanceof Error ? e.message : "Failed to send"),
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
				<Label htmlFor="to">Recipient emails</Label>
				<Textarea
					id="to"
					name="to"
					placeholder={
						"one@example.com, two@example.com\nor\nthree@example.com"
					}
					ref={toRef}
					required
					rows={4}
				/>
				<div className="flex items-center justify-between">
					<p className="text-muted-foreground text-xs">
						Comma- or newline-separated.
					</p>
					<Button
						disabled={isSubmitting}
						onClick={handlePrefill}
						type="button"
						variant="ghost"
					>
						{isSubmitting ? "Loading..." : "Prefill from users"}
					</Button>
				</div>
			</div>

			<div className="grid gap-2">
				<Label htmlFor="subject">Subject</Label>
				<Input
					id="subject"
					name="subject"
					placeholder="Announcement subject"
					required
				/>
			</div>

			<div className="grid gap-2">
				<Label htmlFor="content">Content (Markdown supported)</Label>
				<Textarea
					id="content"
					name="content"
					placeholder={"# Title\n\nDetails here..."}
					required
					rows={10}
				/>
			</div>

			<div className="flex justify-end">
				<Button disabled={isSubmitting} loading={isSubmitting} type="submit">
					Send Announcement
				</Button>
			</div>
		</form>
	);
}
