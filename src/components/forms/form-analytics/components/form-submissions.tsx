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
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
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

const exportToCSV = (
	form: Form,
	submissions: FormSubmission[],
	messages: {
		noSubmissionsToExport: string;
		submissionId: string;
		submittedAt: string;
		ipAddress: string;
		csvExportedSuccess: string;
	}
) => {
	if (submissions.length === 0) {
		toast.error(messages.noSubmissionsToExport);
		return;
	}

	const allFields = [
		...(form.schema.fields || []),
		...(form.schema.blocks?.flatMap((block) => block.fields || []) || []),
	];

	const headers = [
		messages.submissionId,
		messages.submittedAt,
		messages.ipAddress,
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

	toast.success(messages.csvExportedSuccess);
};

const exportToJSON = (
	form: Form,
	submissions: FormSubmission[],
	messages: {
		noSubmissionsToExport: string;
		jsonExportedSuccess: string;
	}
) => {
	if (submissions.length === 0) {
		toast.error(messages.noSubmissionsToExport);
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

	toast.success(messages.jsonExportedSuccess);
};

const ITEMS_PER_PAGE = 50;

export function FormSubmissions({ form, submissions }: FormSubmissionsProps) {
	const t = useTranslations("product.analytics.submissions");
	const commonT = useTranslations("product.common");
	const locale = useLocale();
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedSubmission, setSelectedSubmission] =
		useState<FormSubmission | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const dateFormatter = useMemo(
		() =>
			new Intl.DateTimeFormat(locale, {
				year: "numeric",
				month: "short",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit",
			}),
		[locale]
	);
	const formatDate = (dateString: string) =>
		dateFormatter.format(new Date(dateString));

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
									aria-label={t("backToAnalytics")}
									asChild
									className="w-fit"
									variant="outline"
								>
									<Link
										className="inline-flex items-center gap-2"
										href={`/dashboard/forms/${form.id}/analytics`}
									>
										<ArrowLeft aria-hidden="true" className="size-4 shrink-0" />
										<span className="text-sm">{t("backToAnalytics")}</span>
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
													<span className="sr-only">{t("published")}</span>
													<span aria-live="polite">{t("published")}</span>
												</>
											) : (
												<>
													<Eye aria-hidden="true" className="size-3" />
													<span className="sr-only">{t("draft")}</span>
													<span aria-live="polite">{t("draft")}</span>
												</>
											)}
										</Badge>
									</div>
									<div className="flex items-center gap-2 text-muted-foreground">
										<FileText aria-hidden="true" className="size-4" />
										<span className="font-medium text-sm">
											{t("formSubmissions", { count: submissions.length })}
										</span>
									</div>
								</div>
							</div>

							{}
							<div
								aria-label={t("exportActions")}
								className="flex flex-wrap items-center gap-3 sm:gap-3"
							>
								<Button
									disabled={submissions.length === 0}
									onClick={() =>
										exportToCSV(form, submissions, {
											noSubmissionsToExport: t("noSubmissionsToExport"),
											submissionId: t("submissionId"),
											submittedAt: t("submittedAt"),
											ipAddress: t("ipAddress"),
											csvExportedSuccess: t("csvExportedSuccess"),
										})
									}
									size="sm"
									variant="outline"
								>
									<Download className="size-4" />
									{t("exportCsv")}
								</Button>
								<Button
									disabled={submissions.length === 0}
									onClick={() =>
										exportToJSON(form, submissions, {
											noSubmissionsToExport: t("noSubmissionsToExport"),
											jsonExportedSuccess: t("jsonExportedSuccess"),
										})
									}
									size="sm"
									variant="outline"
								>
									<Download className="size-4" />
									{t("exportJson")}
								</Button>
								<Button
									aria-label={t("viewDetailedAnalytics")}
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
										{t("viewDetailedAnalytics")}
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
								{t("submissions")}
							</CardTitle>
							<div className="flex items-center gap-2">
								<div className="relative max-w-md">
									<Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
									<Input
										className="pl-10"
										onChange={(e) => handleSearchChange(e.target.value)}
										placeholder={t("searchSubmissions")}
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
										? t("noMatchingSubmissions")
										: t("noSubmissionsYet")}
								</h4>
								<p className="max-w-md text-center text-muted-foreground">
									{searchTerm
										? t("adjustSearchTerms")
										: t("noSubmissionsDescription")}
								</p>
							</div>
						) : (
							<div className="overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>{t("id")}</TableHead>
											<TableHead>{t("submitted")}</TableHead>
											<TableHead>{t("ipAddress")}</TableHead>
											<TableHead>{t("fields")}</TableHead>
											<TableHead>{t("actions")}</TableHead>
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
													{submission.ip_address || commonT("na")}
												</TableCell>
												<TableCell>
													<Badge variant="outline">
														{t("fieldsCount", {
															count: Object.keys(submission.submission_data).length,
														})}
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
														{t("view")}
													</Button>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
								{totalPages > 1 && (
									<div className="flex items-center justify-between border-t px-4 py-3">
										<div className="text-muted-foreground text-sm">
											{t("showingRange", {
												start: startIndex + 1,
												end: Math.min(endIndex, filteredSubmissions.length),
												total: filteredSubmissions.length,
											})}
										</div>
										<div className="flex items-center gap-2">
											<Button
												disabled={currentPage === 1}
												onClick={() => setCurrentPage((p) => p - 1)}
												size="sm"
												variant="outline"
											>
												<ChevronLeft className="size-4" />
												{t("previous")}
											</Button>
											<span className="px-2 text-sm">
												{t("pageOf", { page: currentPage, total: totalPages })}
											</span>
											<Button
												disabled={currentPage === totalPages}
												onClick={() => setCurrentPage((p) => p + 1)}
												size="sm"
												variant="outline"
											>
												{t("next")}
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
