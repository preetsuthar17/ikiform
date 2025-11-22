"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useFormsManagement } from "@/components/dashboard/forms-management/hooks";

const ProfileCard = dynamic(
	() => import("@/components/dashboard/profile-card/ProfileCard"),
	{
		loading: () => (
			<div className="shadow-none">
				<div className="flex flex-col gap-6">
					<div className="flex items-center gap-4">
						<div className="size-16 animate-pulse rounded-2xl bg-accent" />
						<div className="flex flex-col gap-2">
							<div className="h-6 w-48 animate-pulse rounded bg-accent" />
							<div className="h-4 w-32 animate-pulse rounded bg-accent" />
						</div>
					</div>
					<div className="flex gap-2">
						<div className="h-9 w-24 animate-pulse rounded bg-accent" />
						<div className="h-9 w-24 animate-pulse rounded bg-accent" />
					</div>
				</div>
			</div>
		),
	},
);

const FormsSidebar = dynamic(
	() =>
		import(
			"@/components/dashboard/forms-management/components/FormsSidebar"
		).then((mod) => ({
			default: mod.FormsSidebar,
		})),
	{
		loading: () => (
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
				{Array.from({ length: 3 }).map((_, i) => (
					<div
						className="h-20 animate-pulse rounded-2xl border bg-card"
						key={i}
					/>
				))}
			</div>
		),
	},
);

const FormsManagement = dynamic(
	() =>
		import("@/components/dashboard/forms-management").then((mod) => ({
			default: mod.FormsManagement,
		})),
	{
		loading: () => (
			<div className="flex flex-col gap-6">
				<div className="flex items-center justify-between">
					<div className="h-8 w-32 animate-pulse rounded bg-accent" />
					<div className="h-10 w-28 animate-pulse rounded bg-accent" />
				</div>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{Array.from({ length: 6 }).map((_, i) => (
						<div
							className="h-48 animate-pulse rounded-2xl border bg-card"
							key={i}
						/>
					))}
				</div>
			</div>
		),
	},
);

export default function DashboardClient() {
	const { forms, loading } = useFormsManagement();

	return (
		<section className="mx-auto w-full max-w-7xl">
			<div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
				{}
				<div className="flex w-full flex-col gap-8 lg:w-80 lg:flex-shrink-0">
					<Suspense
						fallback={
							<div className="rounded-2xl border bg-card p-6 shadow-none">
								<div className="flex flex-col gap-6">
									<div className="flex items-center gap-4">
										<div className="size-16 animate-pulse rounded-2xl bg-accent" />
										<div className="flex flex-col gap-2">
											<div className="h-6 w-48 animate-pulse rounded bg-accent" />
											<div className="h-4 w-32 animate-pulse rounded bg-accent" />
										</div>
									</div>
									<div className="flex gap-2">
										<div className="h-9 w-24 animate-pulse rounded bg-accent" />
										<div className="h-9 w-24 animate-pulse rounded bg-accent" />
									</div>
								</div>
							</div>
						}
					>
						<ProfileCard />
					</Suspense>

					<Suspense
						fallback={
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
								{Array.from({ length: 3 }).map((_, i) => (
									<div
										className="h-20 animate-pulse rounded-2xl border bg-card"
										key={i}
									/>
								))}
							</div>
						}
					>
						<FormsSidebar forms={forms} loading={loading} />
					</Suspense>
				</div>

				{}
				<div className="flex-1">
					<Suspense
						fallback={
							<div className="flex flex-col gap-6 bg-card">
								<div className="flex items-center justify-between">
									<div className="h-8 w-32 animate-pulse rounded bg-accent" />
									<div className="h-10 w-28 animate-pulse rounded bg-accent" />
								</div>
								<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
									{Array.from({ length: 6 }).map((_, i) => (
										<div
											className="h-48 animate-pulse rounded-2xl border bg-card"
											key={i}
										/>
									))}
								</div>
							</div>
						}
					>
						<FormsManagement />
					</Suspense>
				</div>
			</div>
		</section>
	);
}
