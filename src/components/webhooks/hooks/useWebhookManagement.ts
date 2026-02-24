import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export type WebhookMethod =
	| "DELETE"
	| "GET"
	| "HEAD"
	| "PATCH"
	| "POST"
	| "PUT";

export interface WebhookConfig {
	id: string;
	name?: string | null;
	description?: string | null;
	url: string;
	events: string[];
	method: WebhookMethod;
	headers?: Record<string, string>;
	payloadTemplate?: string;
	enabled: boolean;
	notificationEmail?: string | null;
	notifyOnSuccess?: boolean;
	notifyOnFailure?: boolean;
	createdAt: string;
	updatedAt: string;
	formId?: string;
}

export function useWebhookManagement(options?: { formId?: string }) {
	const t = useTranslations("product.formBuilder.formSettings.webhooks.hook");
	const formId = options?.formId;
	const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function fetchWebhooks() {
		setLoading(true);
		setError(null);
		try {
			const url = formId
				? `/api/webhook?formId=${encodeURIComponent(formId)}`
				: "/api/webhook";
			const res = await fetch(url);
			if (!res.ok) throw new Error(t("fetchFailed"));
			const data = await res.json();
			setWebhooks(data);
		} catch (e: any) {
			setError(e.message);
			toast.error(e.message || t("fetchFailed"));
		} finally {
			setLoading(false);
		}
	}

	async function createWebhook(webhook: Partial<WebhookConfig>) {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch("/api/webhook", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...webhook, formId }),
			});
			if (!res.ok) throw new Error(t("createFailed"));
			toast.success(t("created"));
			await fetchWebhooks();
		} catch (e: any) {
			setError(e.message);
			toast.error(e.message || t("createFailed"));
		} finally {
			setLoading(false);
		}
	}

	async function updateWebhook(id: string, webhook: Partial<WebhookConfig>) {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch(`/api/webhook/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...webhook, formId }),
			});
			if (!res.ok) throw new Error(t("updateFailed"));
			toast.success(t("updated"));
			await fetchWebhooks();
		} catch (e: any) {
			setError(e.message);
			toast.error(e.message || t("updateFailed"));
		} finally {
			setLoading(false);
		}
	}

	async function deleteWebhook(id: string) {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch(`/api/webhook/${id}`, { method: "DELETE" });
			if (!res.ok) throw new Error(t("deleteFailed"));
			toast.success(t("deleted"));
			await fetchWebhooks();
		} catch (e: any) {
			setError(e.message);
			toast.error(e.message || t("deleteFailed"));
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		fetchWebhooks();
	}, [formId]);

	return {
		webhooks,
		loading,
		error,
		fetchWebhooks,
		createWebhook,
		updateWebhook,
		deleteWebhook,
	};
}
