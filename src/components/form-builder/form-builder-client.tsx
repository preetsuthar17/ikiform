"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Suspense } from "react";
import { FormBuilderSkeleton } from "@/components/form-builder/form-builder-skeleton";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { usePremiumStatus } from "@/hooks/use-premium-status";

const FormBuilder = dynamic(
	() =>
		import("@/components/form-builder/form-builder").then((mod) => ({
			default: mod.FormBuilder,
		})),
	{
		ssr: false,
		loading: () => <FormBuilderSkeleton />,
	}
);

function PremiumRequired() {
	const locale = useLocale();
	const t = useTranslations("product.common.premium");

	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-6">
			<div className="font-semibold text-2xl">{t("title")}</div>
			<div className="max-w-md text-center text-muted-foreground">
				{t("formBuilderDescription")}
			</div>
			<Link href={`/${locale}#pricing`}>
				<Button size="lg">{t("viewPricing")}</Button>
			</Link>
		</div>
	);
}

export default function FormBuilderClient() {
	const { user, loading } = useAuth();
	const { hasPremium, checkingPremium: checking } = usePremiumStatus(user);

	if (loading || checking) {
		return <FormBuilderSkeleton />;
	}

	if (!(user && hasPremium)) {
		return <PremiumRequired />;
	}

	return (
		<Suspense fallback={<FormBuilderSkeleton />}>
			<FormBuilder />
		</Suspense>
	);
}
