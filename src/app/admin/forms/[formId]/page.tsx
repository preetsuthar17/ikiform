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
				aria-label="Invalid form ID error"
				className="mx-auto w-full max-w-7xl p-6"
			>
				<Card className="p-4 shadow-none md:p-6">
					<CardContent className="p-0">
						<div className="text-center">
							<h1 className="font-bold text-2xl">Invalid Form ID</h1>
							<p className="mt-2 text-muted-foreground">
								No form ID provided in the URL.
							</p>
							<Link href="/admin">
								<Button aria-label="Return to admin dashboard" className="mt-4">
									<ArrowLeft aria-hidden="true" className="size-4" />
									Back to Admin
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
				aria-label="Form not found error"
				className="mx-auto w-full max-w-7xl p-6"
			>
				<Card className="p-4 shadow-none md:p-6">
					<CardContent className="p-0">
						<div className="text-center">
							<h1 className="font-bold text-2xl">Form Not Found</h1>
							<p className="mt-2 text-muted-foreground">
								The form you're looking for doesn't exist.
							</p>
							<Link href="/admin">
								<Button aria-label="Return to admin dashboard" className="mt-4">
									<ArrowLeft aria-hidden="true" className="size-4" />
									Back to Admin
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
			aria-label="Form details page"
			className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6"
		>
			{}
			<div className="flex items-center justify-between">
				<div className="flex flex-col items-start gap-4">
					<Link href="/admin">
						<Button
							aria-label="Return to admin dashboard"
							size="sm"
							variant="outline"
						>
							<ArrowLeft aria-hidden="true" className="size-4" />
							Back to Admin
						</Button>
					</Link>
					<div>
						<h1 className="font-bold text-3xl">{form.title}</h1>
						<p className="text-muted-foreground">
							{form.description || "No description provided"}
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
								aria-label="View form in new tab"
								size="sm"
								variant="outline"
							>
								<ExternalLink aria-hidden="true" className="size-4" />
								View Form
							</Button>
						</Link>
					)}
				</div>
			</div>

			{}
			<section
				aria-label="Form statistics"
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
								<p className="font-medium text-sm">Status</p>
								<Badge
									aria-label={`Form status: ${form.is_published ? "Published" : "Draft"}`}
									variant={form.is_published ? "default" : "secondary"}
								>
									{form.is_published ? "Published" : "Draft"}
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
								<p className="font-medium text-sm">Submissions</p>
								<p
									aria-label={`${submissions.length} submissions`}
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
								<p className="font-medium text-sm">Created</p>
								<p
									aria-label={`Created on ${new Date(form.created_at).toLocaleDateString()}`}
									className="text-sm"
								>
									{new Date(form.created_at).toLocaleDateString()}
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
								<p className="font-medium text-sm">API Status</p>
								<Badge
									aria-label={`API status: ${form.api_enabled ? "Enabled" : "Disabled"}`}
									variant={form.api_enabled ? "default" : "secondary"}
								>
									{form.api_enabled ? "Enabled" : "Disabled"}
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
						Form Details
					</CardTitle>
				</CardHeader>
				<CardContent className="p-0">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<label className="font-medium text-muted-foreground text-sm">
								Form ID
							</label>
							<p
								aria-label={`Form ID: ${form.id}`}
								className="font-mono text-sm"
							>
								{form.id}
							</p>
						</div>
						<div>
							<label className="font-medium text-muted-foreground text-sm">
								Owner
							</label>
							<p className="text-sm">
								{formOwner ? (
									<Link
										aria-label={`View owner details for ${formOwner.name}`}
										className="text-primary hover:underline"
										href={`/admin/users/${formOwner.uid}`}
									>
										{formOwner.name} ({formOwner.email})
									</Link>
								) : (
									"Unknown"
								)}
							</p>
						</div>
						<div>
							<label className="font-medium text-muted-foreground text-sm">
								Slug
							</label>
							<p
								aria-label={`Form slug: ${form.slug || "Not set"}`}
								className="text-sm"
							>
								{form.slug || "-"}
							</p>
						</div>
						<div>
							<label className="font-medium text-muted-foreground text-sm">
								Last Updated
							</label>
							<p
								aria-label={`Last updated: ${new Date(form.updated_at).toLocaleDateString()}`}
								className="text-sm"
							>
								{new Date(form.updated_at).toLocaleDateString()}
							</p>
						</div>
						{form.api_key && (
							<div className="md:col-span-2">
								<label className="font-medium text-muted-foreground text-sm">
									API Key
								</label>
								<p
									aria-label={`API Key: ${form.api_key}`}
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
						Form Schema
					</CardTitle>
				</CardHeader>
				<CardContent className="p-0">
					<pre
						aria-label="Form schema JSON"
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
						Form Submissions ({submissions.length})
					</CardTitle>
					<p className="text-muted-foreground text-sm">
						All responses submitted to this form
					</p>
				</CardHeader>
				<CardContent className="p-0">
					{submissions.length === 0 ? (
						<div
							aria-label="No form submissions"
							className="py-8 text-center text-muted-foreground"
							role="status"
						>
							<Users
								aria-hidden="true"
								className="mx-auto mb-4 size-12 opacity-50"
							/>
							<p>No submissions yet.</p>
						</div>
					) : (
						<div
							aria-label="Form submissions list"
							className="flex flex-col gap-4"
							role="region"
						>
							{submissions.map((submission, index) => (
								<Card
									aria-label={`Submission ${submissions.length - index}`}
									className="p-4 shadow-none md:p-6"
									key={submission.id}
									role="article"
								>
									<div className="mb-3 flex items-center justify-between">
										<div className="flex items-center gap-2">
											<span className="font-medium text-sm">
												Submission #{submissions.length - index}
											</span>
											<Badge
												aria-label={`Submitted on ${new Date(submission.submitted_at).toLocaleString()}`}
												variant="outline"
											>
												{new Date(submission.submitted_at).toLocaleString()}
											</Badge>
										</div>
										{submission.ip_address && (
											<span
												aria-label={`IP address: ${submission.ip_address}`}
												className="text-muted-foreground text-xs"
											>
												IP: {submission.ip_address}
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
														aria-label={`Field: ${key}`}
														className="font-medium text-sm"
													>
														{key}:
													</div>
													<div
														aria-label={`Value for ${key}: ${typeof value === "object" ? JSON.stringify(value) : String(value)}`}
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
