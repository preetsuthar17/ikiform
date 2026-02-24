import { Suspense } from "react";
import { ensureDefaultFormSettings } from "@/lib/forms";
import { createClient } from "@/utils/supabase/server";
import DashboardAuthRecovery from "./dashboard-auth-recovery";
import DashboardClient from "./dashboard-client";

// Skeleton components for streaming
function DashboardSkeleton() {
	return (
		<section className="mx-auto w-full max-w-7xl">
			<div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
				<div className="flex w-full flex-col gap-8 lg:w-80 lg:shrink-0">
					<div className="rounded-2xl border bg-card p-6 shadow-none">
						<div className="flex flex-col items-center gap-6 py-5">
							<div className="size-16 animate-pulse rounded-2xl bg-accent" />
							<div className="flex flex-col items-center gap-2">
								<div className="h-6 w-48 animate-pulse rounded bg-accent" />
								<div className="h-4 w-32 animate-pulse rounded bg-accent" />
							</div>
						</div>
					</div>
					<div className="grid grid-cols-3 gap-4">
						{["skeleton-1", "skeleton-2", "skeleton-3"].map((key) => (
							<div
								className="h-20 animate-pulse rounded-2xl border bg-card"
								key={key}
							/>
						))}
					</div>
				</div>
				<div className="flex-1">
					<div className="flex flex-col gap-6">
						<div className="flex items-center justify-between">
							<div className="h-8 w-32 animate-pulse rounded bg-accent" />
							<div className="h-10 w-28 animate-pulse rounded bg-accent" />
						</div>
						<div className="flex flex-col gap-2">
							{[
								"skeleton-1",
								"skeleton-2",
								"skeleton-3",
								"skeleton-4",
								"skeleton-5",
								"skeleton-6",
							].map((key) => (
								<div
									className="h-20 animate-pulse rounded-xl border bg-card"
									key={key}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

async function DashboardData() {
	const supabase = await createClient();

	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError || !user) {
		return <DashboardAuthRecovery />;
	}

	// Parallel fetch: forms and premium status at the same time
	const [formsResult, premiumResult] = await Promise.all([
		supabase
			.from("forms")
			.select(
				"id, title, description, is_published, created_at, updated_at, user_id, schema, slug"
			)
			.eq("user_id", user.id)
			.order("updated_at", { ascending: false }),
		supabase
			.from("users")
			.select("has_premium, polar_customer_id")
			.eq("uid", user.id)
			.single(),
	]);

	const forms = (formsResult.data || []).map((form) => ({
		...form,
		schema: ensureDefaultFormSettings(form.schema || {}),
	}));

	const hasPremium = premiumResult.data?.has_premium ?? false;
	const hasCustomerPortal = !!premiumResult.data?.polar_customer_id;

	return (
		<DashboardClient
			initialForms={forms}
			initialHasCustomerPortal={hasCustomerPortal}
			initialHasPremium={hasPremium}
			user={user}
		/>
	);
}

export default function DashboardPage() {
	return (
		<Suspense fallback={<DashboardSkeleton />}>
			<DashboardData />
		</Suspense>
	);
}
