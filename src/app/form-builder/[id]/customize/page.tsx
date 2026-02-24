import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { FormCustomizePage } from "@/components/form-builder/form-customize";
import { ensureDefaultFormSettings } from "@/lib/forms";
import { createClient } from "@/utils/supabase/server";

interface PageProps {
	params: Promise<{
		id: string;
	}>;
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

export default async function CustomizePage({ params }: PageProps) {
	const { id } = await params;
	const t = await getTranslations("product.formBuilder.customize.page");

	try {
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
			redirect("/dashboard");
		}

		if (formResult.error || !formResult.data) {
			notFound();
		}

		const form = {
			...formResult.data,
			schema: ensureDefaultFormSettings(formResult.data.schema),
		};

		return (
			<Suspense fallback={<div>{t("loadingCustomization")}</div>}>
				<FormCustomizePage formId={id} schema={form.schema} />
			</Suspense>
		);
	} catch (error) {
		console.error("Error loading form for customization:", error);
		redirect("/dashboard");
	}
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { id } = await params;

	try {
		const { user, supabase } = await getAuthenticatedUser();

		const { data: formData, error } = await supabase
			.from("forms")
			.select("schema")
			.eq("id", id)
			.eq("user_id", user.id)
			.single();

		if (error || !formData) {
			return {
				title: "Customize Form",
				description: "Customize the design and appearance of your form",
			};
		}

		const schema = ensureDefaultFormSettings(formData.schema);

		return {
			title: `Customize ${schema.settings.title}`,
			description: "Customize the design and appearance of your form",
		};
	} catch {
		return {
			title: "Customize Form",
			description: "Customize the design and appearance of your form",
		};
	}
}
