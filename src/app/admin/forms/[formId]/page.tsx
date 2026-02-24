import {
	ArrowLeft,
	BarChart3,
	Calendar,
	ExternalLink,
	FileText,
	Users,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FormSchema } from "@/lib/database/database.types";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

interface Form {
	id: string;
	user_id: string;
	title: string;
	description: string | null;
	slug: string | null;
	schema: FormSchema;
	is_published: boolean;
	created_at: string;
	updated_at: string;
	api_key: string | null;
	api_enabled: boolean;
}

interface FormSubmission {
	id: string;
	form_id: string;
	submission_data: Record<string, unknown>;
	submitted_at: string;
	ip_address: string | null;
}

interface User {
	uid: string;
	name: string;
	email: string;
}

async function getForm(formId: string): Promise<Form | null> {
	const supabase = createAdminClient();

	const { data: form, error } = await supabase
		.from("forms")
		.select("*")
		.eq("id", formId)
		.single();

	if (error) {
		console.error("Error fetching form:", error);
		return null;
	}

	return form;
}

async function getFormSubmissions(formId: string): Promise<FormSubmission[]> {
	const supabase = createAdminClient();

	const { data: submissions, error } = await supabase
		.from("form_submissions")
		.select("*")
		.eq("form_id", formId)
		.order("submitted_at", { ascending: false });

	if (error) {
		console.error("Error fetching form submissions:", error);
		return [];
	}

	return submissions || [];
}

async function getFormOwner(userId: string): Promise<User | null> {
	const supabase = createAdminClient();

	const { data: user, error } = await supabase
		.from("users")
		.select("uid, name, email")
		.eq("uid", userId)
		.single();

	if (error) {
		console.error("Error fetching form owner:", error);
		return null;
	}

	return user;
}

const FormDetailPage = async function FormDetailPage({
	params,
}: {
	params: Promise<{ formId: string }>;
}) {
	const t = await getTranslations("dashboard.admin.formDetails");
	const locale = await getLocale();
	const dateLocale = locale === "es" ? "es-ES" : "en-US";
	const { formId } = await params;

	console.log("FormDetailPage formId:", formId);

	const supabase = await createClient();
	const { data } = await supabase.auth.getUser();
	const user = data.user;

	if (!user || user.email !== "preetsutharxd@gmail.com") {
		redirect("/");
	}

	if (!formId) {
		console.error("No formId provided");
		return (
			<main
				aria-label={t("invalidFormId.aria")}
				className="mx-auto w-full max-w-7xl p-6"
			>
				<Card className="p-4 shadow-none md:p-6">
					<CardContent className="p-0">
						<div className="text-center">
							<h1 className="font-bold text-2xl">{t("invalidFormId.title")}</h1>
							<p className="mt-2 text-muted-foreground">
								{t("invalidFormId.description")}
							</p>
							<Link href="/admin">
								<Button aria-label={t("backToAdminAria")} className="mt-4">
									<ArrowLeft aria-hidden="true" className="size-4" />
									{t("backToAdmin")}
								</Button>
							</Link>
						</div>
					</CardContent>
				</Card>
			</main>
		);
	}

	console.log("Looking up form with formId:", formId);

	const [form, submissions, formOwner] = await Promise.all([
		getForm(formId),
		getFormSubmissions(formId),
		getForm(formId).then((form) => (form ? getFormOwner(form.user_id) : null)),
	]);

	if (!form) {
		return (
			<main
				aria-label={t("notFound.aria")}
				className="mx-auto w-full max-w-7xl p-6"
			>
				<Card className="p-4 shadow-none md:p-6">
					<CardContent className="p-0">
						<div className="text-center">
							<h1 className="font-bold text-2xl">{t("notFound.title")}</h1>
							<p className="mt-2 text-muted-foreground">
								{t("notFound.description")}
							</p>
							<Link href="/admin">
								<Button aria-label={t("backToAdminAria")} className="mt-4">
									<ArrowLeft aria-hidden="true" className="size-4" />
									{t("backToAdmin")}
								</Button>
							</Link>
						</div>
					</CardContent>
				</Card>
			</main>
		);
	}

	return (
		<main
			aria-label={t("pageAria")}
			className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6"
		>
			{}
			<div className="flex items-center justify-between">
				<div className="flex flex-col items-start gap-4">
					<Link href="/admin">
						<Button
							aria-label={t("backToAdminAria")}
							size="sm"
							variant="outline"
						>
							<ArrowLeft aria-hidden="true" className="size-4" />
							{t("backToAdmin")}
						</Button>
					</Link>
					<div>
						<h1 className="font-bold text-3xl">{form.title}</h1>
						<p className="text-muted-foreground">
							{form.description || t("noDescription")}
						</p>
					</div>
				</div>
				<div className="flex items-center gap-2">
					{form.slug && (
						<Link
							href={`/f/${form.slug}`}
							rel="noopener noreferrer"
							target="_blank"
						>
							<Button
								aria-label={t("viewFormAria")}
								size="sm"
								variant="outline"
							>
								<ExternalLink aria-hidden="true" className="size-4" />
								{t("viewForm")}
							</Button>
						</Link>
					)}
				</div>
			</div>

			{}
			<section
				aria-label={t("statistics.aria")}
				className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
			>
				<Card className="p-4 shadow-none md:p-6">
					<CardContent className="p-0">
						<div className="flex items-center gap-2">
							<FileText
								aria-hidden="true"
								className="size-5 text-muted-foreground"
							/>
							<div>
								<p className="font-medium text-sm">{t("statistics.status")}</p>
								<Badge
									aria-label={t("statistics.formStatusAria", {
										status: form.is_published
											? t("badges.published")
											: t("badges.draft"),
									})}
									variant={form.is_published ? "default" : "secondary"}
								>
									{form.is_published
										? t("badges.published")
										: t("badges.draft")}
								</Badge>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="p-4 shadow-none md:p-6">
					<CardContent className="p-0">
						<div className="flex items-center gap-2">
							<Users
								aria-hidden="true"
								className="size-5 text-muted-foreground"
							/>
							<div>
								<p className="font-medium text-sm">
									{t("statistics.submissions")}
								</p>
								<p
									aria-label={t("statistics.submissionsCountAria", {
										count: submissions.length,
									})}
									className="font-bold text-2xl"
								>
									{submissions.length}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="p-4 shadow-none md:p-6">
					<CardContent className="p-0">
						<div className="flex items-center gap-2">
							<Calendar
								aria-hidden="true"
								className="size-5 text-muted-foreground"
							/>
							<div>
								<p className="font-medium text-sm">{t("statistics.created")}</p>
								<p
									aria-label={t("statistics.createdOnAria", {
										date: new Date(form.created_at).toLocaleDateString(dateLocale),
									})}
									className="text-sm"
								>
									{new Date(form.created_at).toLocaleDateString(dateLocale)}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="p-4 shadow-none md:p-6">
					<CardContent className="p-0">
						<div className="flex items-center gap-2">
							<BarChart3
								aria-hidden="true"
								className="size-5 text-muted-foreground"
							/>
							<div>
								<p className="font-medium text-sm">
									{t("statistics.apiStatus")}
								</p>
								<Badge
									aria-label={t("statistics.apiStatusAria", {
										status: form.api_enabled
											? t("badges.enabled")
											: t("badges.disabled"),
									})}
									variant={form.api_enabled ? "default" : "secondary"}
								>
									{form.api_enabled
										? t("badges.enabled")
										: t("badges.disabled")}
								</Badge>
							</div>
						</div>
					</CardContent>
				</Card>
			</section>

			{}
			<Card className="p-4 shadow-none md:p-6">
				<CardHeader className="p-0">
					<CardTitle className="flex items-center gap-2">
						<FileText aria-hidden="true" className="size-5" />
						{t("details.title")}
					</CardTitle>
				</CardHeader>
				<CardContent className="p-0">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<label className="font-medium text-muted-foreground text-sm">
								{t("details.formId")}
							</label>
							<p
								aria-label={t("details.formIdAria", { id: form.id })}
								className="font-mono text-sm"
							>
								{form.id}
							</p>
						</div>
						<div>
							<label className="font-medium text-muted-foreground text-sm">
								{t("details.owner")}
							</label>
							<p className="text-sm">
								{formOwner ? (
									<Link
										aria-label={t("details.viewOwnerAria", {
											name: formOwner.name,
										})}
										className="text-primary hover:underline"
										href={`/admin/users/${formOwner.uid}`}
									>
										{formOwner.name} ({formOwner.email})
									</Link>
								) : (
									t("details.unknown")
								)}
							</p>
						</div>
						<div>
							<label className="font-medium text-muted-foreground text-sm">
								{t("details.slug")}
							</label>
							<p
								aria-label={t("details.slugAria", {
									slug: form.slug || t("details.notSet"),
								})}
								className="text-sm"
							>
								{form.slug || "-"}
							</p>
						</div>
						<div>
							<label className="font-medium text-muted-foreground text-sm">
								{t("details.lastUpdated")}
							</label>
							<p
								aria-label={t("details.lastUpdatedAria", {
									date: new Date(form.updated_at).toLocaleDateString(dateLocale),
								})}
								className="text-sm"
							>
								{new Date(form.updated_at).toLocaleDateString(dateLocale)}
							</p>
						</div>
						{form.api_key && (
							<div className="md:col-span-2">
								<label className="font-medium text-muted-foreground text-sm">
									{t("details.apiKey")}
								</label>
								<p
									aria-label={t("details.apiKeyAria", { key: form.api_key })}
									className="mt-1 rounded bg-muted px-2 py-1 font-mono text-xs"
								>
									{form.api_key}
								</p>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{}
			<Card className="p-4 shadow-none md:p-6">
				<CardHeader className="p-0">
					<CardTitle className="flex items-center gap-2">
						<BarChart3 aria-hidden="true" className="size-5" />
						{t("schema.title")}
					</CardTitle>
				</CardHeader>
				<CardContent className="p-0">
					<pre
						aria-label={t("schema.aria")}
						className="overflow-x-auto rounded-md bg-muted p-4 font-mono text-xs"
					>
						{JSON.stringify(form.schema, null, 2)}
					</pre>
				</CardContent>
			</Card>

			{}
			<Card className="p-4 shadow-none md:p-6">
				<CardHeader className="p-0">
					<CardTitle className="flex items-center gap-2">
						<Users aria-hidden="true" className="size-5" />
						{t("submissions.title", { count: submissions.length })}
					</CardTitle>
					<p className="text-muted-foreground text-sm">
						{t("submissions.description")}
					</p>
				</CardHeader>
				<CardContent className="p-0">
					{submissions.length === 0 ? (
						<div
							aria-label={t("submissions.emptyAria")}
							className="py-8 text-center text-muted-foreground"
							role="status"
						>
							<Users
								aria-hidden="true"
								className="mx-auto mb-4 size-12 opacity-50"
							/>
							<p>{t("submissions.empty")}</p>
						</div>
					) : (
						<div
							aria-label={t("submissions.listAria")}
							className="flex flex-col gap-4"
							role="region"
						>
							{submissions.map((submission, index) => (
								<Card
									aria-label={t("submissions.itemAria", {
										number: submissions.length - index,
									})}
									className="p-4 shadow-none md:p-6"
									key={submission.id}
									role="article"
								>
									<div className="mb-3 flex items-center justify-between">
										<div className="flex items-center gap-2">
											<span className="font-medium text-sm">
												{t("submissions.itemLabel", {
													number: submissions.length - index,
												})}
											</span>
											<Badge
												aria-label={t("submissions.submittedOnAria", {
													date: new Date(
														submission.submitted_at
													).toLocaleString(dateLocale),
												})}
												variant="outline"
											>
												{new Date(submission.submitted_at).toLocaleString(
													dateLocale
												)}
											</Badge>
										</div>
										{submission.ip_address && (
											<span
												aria-label={t("submissions.ipAria", {
													ip: submission.ip_address,
												})}
												className="text-muted-foreground text-xs"
											>
												{t("submissions.ipLabel", { ip: submission.ip_address })}
											</span>
										)}
									</div>
									<div className="flex flex-col gap-2">
										{Object.entries(submission.submission_data).map(
											([key, value]) => (
												<div
													className="grid grid-cols-1 gap-2 md:grid-cols-3"
													key={key}
												>
													<div
														aria-label={t("submissions.fieldAria", { key })}
														className="font-medium text-sm"
													>
														{key}:
													</div>
													<div
														aria-label={t("submissions.valueAria", {
															key,
															value:
																typeof value === "object"
																	? JSON.stringify(value)
																	: String(value),
														})}
														className="text-sm md:col-span-2"
													>
														{typeof value === "object"
															? JSON.stringify(value)
															: String(value)}
													</div>
												</div>
											)
										)}
									</div>
								</Card>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</main>
	);
};

export default FormDetailPage;
