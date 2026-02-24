"use client";

import type { User } from "@supabase/supabase-js";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Suspense, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Form } from "@/lib/database";

const ProfileLoadingStatus = ({ className }: { className: string }) => {
	const t = useTranslations("dashboard.common");

	return (
		<div aria-label={t("loadingProfile")} className={className} role="status">
			<div className="flex flex-col gap-6">
				<div className="flex items-center gap-4">
					<Skeleton className="size-16 rounded-2xl" />
					<div className="flex flex-col gap-2">
						<Skeleton className="h-6 w-48" />
						<Skeleton className="h-4 w-32" />
					</div>
				</div>
				{className.includes("shadow-none") && (
					<div className="flex gap-2">
						<Skeleton className="h-9 w-24" />
						<Skeleton className="h-9 w-24" />
					</div>
				)}
			</div>
		</div>
	);
};

const FormsSidebarLoadingStatus = ({ className }: { className: string }) => {
	const t = useTranslations("dashboard.common");

	return (
		<div
			aria-label={t("loadingFormsSidebar")}
			className={className}
			role="status"
		>
			{Array.from({ length: 3 }).map((_, i) => (
				<Skeleton className="h-20 rounded-2xl" key={i} />
			))}
		</div>
	);
};

const FormsManagementLoadingStatus = ({ className }: { className: string }) => {
	const t = useTranslations("dashboard.common");

	return (
		<div
			aria-label={t("loadingFormsManagement")}
			className={className}
			role="status"
		>
			<div className="flex items-center justify-between">
				<Skeleton className="h-8 w-32" />
				<Skeleton className="h-10 w-28" />
			</div>
			<div className="flex flex-col gap-2">
				{Array.from({ length: 6 }).map((_, i) => (
					<Skeleton className="h-20 rounded-xl" key={i} />
				))}
			</div>
		</div>
	);
};

const ProfileCard = dynamic(
	() => import("@/components/dashboard/profile-card/profile-card-client"),
	{
		loading: () => <ProfileLoadingStatus className="shadow-none" />,
	}
);

const FormsSidebar = dynamic(
	() =>
		import(
			"@/components/dashboard/forms-management/components/forms-sidebar"
		).then((mod) => ({
			default: mod.FormsSidebar,
		})),
	{
		loading: () => <FormsSidebarLoadingStatus className="grid grid-cols-3 gap-4" />,
	}
);

const FormsManagement = dynamic(
	() =>
		import(
			"@/components/dashboard/forms-management/forms-management-client"
		).then((mod) => ({
			default: mod.FormsManagementClient,
		})),
	{
		loading: () => <FormsManagementLoadingStatus className="flex flex-col gap-6" />,
	}
);

const ProfileCardSkeleton = () => (
	<ProfileLoadingStatus className="rounded-2xl border p-6 shadow-none" />
);

const FormsSidebarSkeleton = () => (
	<FormsSidebarLoadingStatus className="grid grid-cols-3 gap-4" />
);

const FormsManagementSkeleton = () => (
	<FormsManagementLoadingStatus className="relative flex flex-col gap-6 overflow-hidden" />
);

interface DashboardClientProps {
	initialForms: Form[];
	initialHasPremium: boolean;
	initialHasCustomerPortal: boolean;
	user: User;
}

export default function DashboardClient({
	initialForms,
	initialHasPremium,
	initialHasCustomerPortal,
	user,
}: DashboardClientProps) {
	const sidebarProps = useMemo(
		() => ({ forms: initialForms, loading: false }),
		[initialForms]
	);

	return (
		<main className="mx-auto w-full max-w-7xl">
			<div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
				<aside className="flex w-full flex-col gap-8 lg:w-80 lg:shrink-0">
					<Suspense fallback={<ProfileCardSkeleton />}>
						<ProfileCard
							hasCustomerPortal={initialHasCustomerPortal}
							hasPremium={initialHasPremium}
							user={user}
						/>
					</Suspense>

					<Suspense fallback={<FormsSidebarSkeleton />}>
						<FormsSidebar {...sidebarProps} />
					</Suspense>
				</aside>

				<section className="flex-1">
					<Suspense fallback={<FormsManagementSkeleton />}>
						<FormsManagement initialForms={initialForms} user={user} />
					</Suspense>
				</section>
			</div>
		</main>
	);
}
