"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import type { FormSubmission } from "@/lib/database";
import { formsDb } from "@/lib/database";

export const useFormSubmissions = (formId: string) => {
	const { user } = useAuth();
	const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	const loadSubmissions = useCallback(async () => {
		if (!user) return;
		try {
			const formSubmissions = await formsDb.getFormSubmissions(formId, user.id);
			setSubmissions(formSubmissions);
		} catch (error) {
			console.error("Error loading submissions:", error);
			toast.error("Failed to load form submissions");
		} finally {
			setLoading(false);
		}
	}, [formId, user]);

	const refreshData = useCallback(async () => {
		setRefreshing(true);
		await loadSubmissions();
		setRefreshing(false);
		toast.success("Data refreshed!");
	}, [loadSubmissions]);

	useEffect(() => {
		loadSubmissions();
	}, [loadSubmissions]);

	return {
		submissions,
		loading,
		refreshing,
		refreshData,
	};
};
