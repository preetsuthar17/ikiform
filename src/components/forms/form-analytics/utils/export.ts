import { toast } from "@/hooks/use-toast";

import type { Form, FormSubmission } from "@/lib/database";

export const exportToJSON = (form: Form, submissions: FormSubmission[]) => {
	const exportData = {
		form: {
			id: form.id,
			title: form.title,
			description: form.description,
			schema: form.schema,
			created_at: form.created_at,
			updated_at: form.updated_at,
		},
		submissions: submissions.map((submission) => ({
			id: submission.id,
			data: submission.submission_data,
			submitted_at: submission.submitted_at,
			ip_address: submission.ip_address,
		})),
	};

	const blob = new Blob([JSON.stringify(exportData, null, 2)], {
		type: "application/json",
	});

	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `${form.title
		.replace(/[^a-z0-9]/gi, "_")
		.toLowerCase()}_data.json`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);

	toast.success("Data exported successfully!");
};

export const exportToCSV = (form: Form, submissions: FormSubmission[]) => {
	if (!submissions.length) {
		toast.error("No data to export");
		return;
	}

	const allFields = new Set<string>();
	submissions.forEach((submission) =>
		Object.keys(submission.submission_data).forEach((key) => allFields.add(key))
	);

	const headers = [
		"Submission ID",
		"Submitted At",
		"IP Address",
		...Array.from(allFields),
	];
	const rows = submissions.map((submission) => {
		const row = [
			submission.id,
			new Date(submission.submitted_at).toISOString(),
			submission.ip_address || "",
		];

		Array.from(allFields).forEach((field) => {
			const value = submission.submission_data[field];
			row.push(
				Array.isArray(value)
					? value.join(", ")
					: typeof value === "object" && value !== null
						? JSON.stringify(value)
						: value || ""
			);
		});

		return row;
	});

	const csvContent = [headers, ...rows]
		.map((row) =>
			row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(",")
		)
		.join("\n");

	const blob = new Blob([csvContent], { type: "text/csv" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `${form.title
		.replace(/[^a-z0-9]/gi, "_")
		.toLowerCase()}_data.csv`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);

	toast.success("Data exported to CSV successfully!");
};
