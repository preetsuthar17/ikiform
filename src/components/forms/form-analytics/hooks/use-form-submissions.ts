"use client";

import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import type { FormSubmission } from "@/lib/database";
import { formsDb } from "@/lib/database";

export const useFormSubmissions = (formId: string) => {
	const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	const loadSubmissions = async () => {
		try {
			const formSubmissions = await formsDb.getFormSubmissions(formId);
			setSubmissions(formSubmissions);
		} catch (error) {
			console.error("Error loading submissions:", error);
			toast.error("Failed to load form submissions");
		} finally {
			setLoading(false);
		}
	};

	const refreshData = async () => {
		setRefreshing(true);
		await loadSubmissions();
		setRefreshing(false);
		toast.success("Data refreshed!");
	};

	useEffect(() => {
		loadSubmissions();
	}, [formId]);

	return {
		submissions,
		loading,
		refreshing,
		refreshData,
	};
};
