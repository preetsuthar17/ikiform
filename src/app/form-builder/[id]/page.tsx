export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { FormBuilder } from "@/components/form-builder/form-builder";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { createClient } from "@/utils/supabase/server";

interface FormBuilderPageProps {
	params: Promise<{ id: string }>;
}

async function getAuthenticatedUser() {
	const supabase = await createClient();

	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError || !user) {
		redirect("/login");
	}

	return { user, supabase };
}

async function PremiumRequired() {
	const tPremium = await getTranslations("product.common.premium");

	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-6">
			<div className="font-semibold text-2xl">{tPremium("title")}</div>
			<div className="max-w-md text-center text-muted-foreground">
				{tPremium("formBuilderDescription")}
			</div>
			<Link href="/#pricing">
				<Button size="lg">{tPremium("viewPricing")}</Button>
			</Link>
		</div>
	);
}

export default async function FormBuilderPage({
	params,
}: FormBuilderPageProps) {
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
		return <>{await PremiumRequired()}</>;
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
			<FormBuilder formId={id} />
		</Suspense>
	);
}
