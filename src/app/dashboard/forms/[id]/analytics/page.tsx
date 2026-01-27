import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { FormAnalytics } from "@/components/forms/form-analytics/form-analytics";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { createClient } from "@/utils/supabase/server";

interface FormAnalyticsPageProps {
	params: Promise<{ id: string }>;
}

async function getAuthenticatedUser() {
	const supabase = await createClient();

	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError || !user) {
		redirect("/auth/signin");
	}

	return { user, supabase };
}

function PremiumRequired() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-6">
			<div className="font-semibold text-2xl">Requires Premium</div>
			<div className="max-w-md text-center text-muted-foreground">
				You need a premium subscription to access form analytics. Upgrade to
				unlock all features.
			</div>
			<Link href="/#pricing">
				<Button size="lg">View Pricing</Button>
			</Link>
		</div>
	);
}

export default async function FormAnalyticsPage({
	params,
}: FormAnalyticsPageProps) {
	const { id } = await params;
	const { user, supabase } = await getAuthenticatedUser();

	const [subscriptionResult, formResult] = await Promise.all([
		supabase.from("users").select("has_premium").eq("uid", user.id).single(),
		supabase
			.from("forms")
			.select("*")
			.eq("id", id)
			.eq("user_id", user.id)
			.single(),
	]);

	const hasPremium = subscriptionResult.data?.has_premium;

	if (!hasPremium) {
		return <PremiumRequired />;
	}

	if (formResult.error || !formResult.data) {
		notFound();
	}

	return (
		<Suspense
			fallback={
				<div className="flex min-h-screen items-center justify-center">
					<Loader />
				</div>
			}
		>
			<FormAnalytics form={formResult.data} />
		</Suspense>
	);
}
