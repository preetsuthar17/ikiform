"use client";

import {
	ArrowLeft,
	BarChart3,
	Calendar,
	ChevronLeft,
	ChevronRight,
	Download,
	Eye,
	FileText,
	Globe,
	Search,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import type { Form, FormSubmission } from "@/lib/database";
import { SubmissionDetailsModal } from "./submission-details-modal";

interface FormSubmissionsProps {
	form: Form;
	submissions: FormSubmission[];
}

const formatDate = (dateString: string) =>
	new Date(dateString).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});

const getFieldLabel = (form: Form, fieldId: string) => {
	const allFields = [
		...(form.schema.fields || []),
		...(form.schema.blocks?.flatMap((block) => block.fields || []) || []),
	];
	const field = allFields.find((f) => f.id === fieldId);
	return field?.label || fieldId;
};

const exportToCSV = (form: Form, submissions: FormSubmission[]) => {
	if (submissions.length === 0) {
		toast.error("No submissions to export");
		return;
	}

	const allFields = [
		...(form.schema.fields || []),
		...(form.schema.blocks?.flatMap((block) => block.fields || []) || []),
	];

	const headers = [
		"Submission ID",
		"Submitted At",
		"IP Address",
		...allFields.map((f) => f.label || f.id),
	];

	const csvContent = [
		headers.join(","),
		...submissions.map((submission) =>
			[
				submission.id,
				submission.submitted_at,
				submission.ip_address || "",
				...allFields.map((field) => {
					const value = submission.submission_data[field.id];
					if (value === null || value === undefined) return "";
					if (typeof value === "object") return JSON.stringify(value);
					return String(value).replace(/,/g, ";");
				}),
			].join(",")
		),
	].join("\n");

	const blob = new Blob([csvContent], { type: "text/csv" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = `${form.title}_submissions.csv`;
	link.click();
	URL.revokeObjectURL(url);

	toast.success("CSV exported successfully");
};

const exportToJSON = (form: Form, submissions: FormSubmission[]) => {
	if (submissions.length === 0) {
		toast.error("No submissions to export");
		return;
	}

	const dataStr = JSON.stringify(submissions, null, 2);
	const blob = new Blob([dataStr], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = `${form.title}_submissions.json`;
	link.click();
	URL.revokeObjectURL(url);

	toast.success("JSON exported successfully");
};

const ITEMS_PER_PAGE = 50;

export function FormSubmissions({ form, submissions }: FormSubmissionsProps) {
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedSubmission, setSelectedSubmission] =
		useState<FormSubmission | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);

	const filteredSubmissions = submissions.filter((submission) => {
		if (!searchTerm) return true;
		const searchLower = searchTerm.toLowerCase();
		return (
			submission.id.toLowerCase().includes(searchLower) ||
			submission.ip_address?.toLowerCase().includes(searchLower) ||
			Object.values(submission.submission_data).some((value) =>
				String(value).toLowerCase().includes(searchLower)
			)
		);
	});

	const allFields = [
		...(form.schema.fields || []),
		...(form.schema.blocks?.flatMap((block) => block.fields || []) || []),
	];

	const totalPages = Math.ceil(filteredSubmissions.length / ITEMS_PER_PAGE);
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const endIndex = startIndex + ITEMS_PER_PAGE;
	const paginatedSubmissions = filteredSubmissions.slice(startIndex, endIndex);

	const handleSearchChange = (value: string) => {
		setSearchTerm(value);
		setCurrentPage(1);
	};

	return (
		<div className="min-h-screen bg-background">
			<div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
				{}
				<Card
					className="border-border p-4 shadow-none md:p-6"
					id="form-submissions-header-card"
				>
					<CardHeader className="p-0">
						<div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
							<div className="flex min-w-0 flex-col gap-4">
								<Button
									aria-label="Back to Analytics"
									asChild
									className="w-fit"
									variant="outline"
								>
									<Link
										className="inline-flex items-center gap-2"
										href={`/dashboard/forms/${form.id}/analytics`}
									>
										<ArrowLeft aria-hidden="true" className="size-4 shrink-0" />
										<span className="text-sm">Back to Analytics</span>
									</Link>
								</Button>
								<div className="flex min-w-0 flex-col gap-4">
									<div className="flex flex-wrap items-center gap-3">
										<h1
											className="truncate font-bold text-2xl text-foreground sm:text-3xl"
											id="form-submissions-header"
										>
											{form.title}
										</h1>
										<Badge
											className="flex items-center gap-1.5"
											variant={form.is_published ? "default" : "secondary"}
										>
											{form.is_published ? (
												<>
													<Globe aria-hidden="true" className="size-3" />
													<span className="sr-only">Published</span>
													<span aria-live="polite">Published</span>
												</>
											) : (
												<>
													<Eye aria-hidden="true" className="size-3" />
													<span className="sr-only">Draft</span>
													<span aria-live="polite">Draft</span>
												</>
											)}
										</Badge>
									</div>
									<div className="flex items-center gap-2 text-muted-foreground">
										<FileText aria-hidden="true" className="size-4" />
										<span className="font-medium text-sm">
											Form Submissions&nbsp;({submissions.length})
										</span>
									</div>
								</div>
							</div>

							{}
							<div
								aria-label="Export Actions"
								className="flex flex-wrap items-center gap-3 sm:gap-3"
							>
								<Button
									disabled={submissions.length === 0}
									onClick={() => exportToCSV(form, submissions)}
									size="sm"
									variant="outline"
								>
									<Download className="size-4" />
									Export CSV
								</Button>
								<Button
									disabled={submissions.length === 0}
									onClick={() => exportToJSON(form, submissions)}
									size="sm"
									variant="outline"
								>
									<Download className="size-4" />
									Export JSON
								</Button>
								<Button
									aria-label="View detailed analytics"
									asChild
									className="inline-flex items-center gap-2"
									size="sm"
									variant="default"
								>
									<Link
										className="inline-flex items-center gap-2"
										href={`/dashboard/forms/${form.id}/analytics`}
									>
										<BarChart3 aria-hidden="true" className="size-4" />
										View Detailed Analytics
									</Link>
								</Button>
							</div>
						</div>
					</CardHeader>
				</Card>

				{}
				<Card className="border-border p-4 shadow-none md:p-6">
					<CardHeader className="p-0">
						<div className="flex items-center justify-between">
							<CardTitle className="flex items-center gap-2">
								<FileText className="size-5" />
								Submissions
							</CardTitle>
							<div className="flex items-center gap-2">
								<div className="relative max-w-md">
									<Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
									<Input
										className="pl-10"
										onChange={(e) => handleSearchChange(e.target.value)}
										placeholder="Search submissions..."
										value={searchTerm}
									/>
								</div>
							</div>
						</div>
					</CardHeader>
					<CardContent className="p-0">
						{paginatedSubmissions.length === 0 ? (
							<div className="flex flex-col items-center gap-6 py-16">
								<div className="gradient-bg flex size-24 items-center justify-center rounded-2xl">
									<FileText className="size-10 text-accent-foreground" />
								</div>
								<h4 className="font-semibold text-foreground text-xl">
									{searchTerm
										? "No matching submissions"
										: "No submissions yet"}
								</h4>
								<p className="max-w-md text-center text-muted-foreground">
									{searchTerm
										? "Try adjusting your search terms to find submissions."
										: "Once people start filling out your form, their responses will appear here."}
								</p>
							</div>
						) : (
							<div className="overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>ID</TableHead>
											<TableHead>Submitted</TableHead>
											<TableHead>IP Address</TableHead>
											<TableHead>Fields</TableHead>
											<TableHead>Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{paginatedSubmissions.map((submission) => (
											<TableRow key={submission.id}>
												<TableCell className="font-mono text-sm">
													{submission.id.slice(-8)}
												</TableCell>
												<TableCell>
													<div className="flex items-center gap-2">
														<Calendar className="size-4 text-muted-foreground" />
														{formatDate(submission.submitted_at)}
													</div>
												</TableCell>
												<TableCell className="font-mono text-sm">
													{submission.ip_address || "N/A"}
												</TableCell>
												<TableCell>
													<Badge variant="outline">
														{Object.keys(submission.submission_data).length}{" "}
														fields
													</Badge>
												</TableCell>
												<TableCell>
													<Button
														onClick={() => {
															setSelectedSubmission(submission);
															setIsModalOpen(true);
														}}
														size="sm"
														variant="outline"
													>
														<Eye className="size-4" />
														View
													</Button>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
								{totalPages > 1 && (
									<div className="flex items-center justify-between border-t px-4 py-3">
										<div className="text-muted-foreground text-sm">
											Showing {startIndex + 1}-
											{Math.min(endIndex, filteredSubmissions.length)} of{" "}
											{filteredSubmissions.length} submissions
										</div>
										<div className="flex items-center gap-2">
											<Button
												disabled={currentPage === 1}
												onClick={() => setCurrentPage((p) => p - 1)}
												size="sm"
												variant="outline"
											>
												<ChevronLeft className="size-4" />
												Previous
											</Button>
											<span className="px-2 text-sm">
												Page {currentPage} of {totalPages}
											</span>
											<Button
												disabled={currentPage === totalPages}
												onClick={() => setCurrentPage((p) => p + 1)}
												size="sm"
												variant="outline"
											>
												Next
												<ChevronRight className="size-4" />
											</Button>
										</div>
									</div>
								)}
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			<SubmissionDetailsModal
				form={form}
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				submission={selectedSubmission}
			/>
		</div>
	);
}
