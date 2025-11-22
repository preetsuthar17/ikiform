"use client";

import { useEffect, useMemo } from "react";
import type { FormSchema } from "@/lib/database";
import { cn } from "@/lib/utils";
import { MultiStepForm } from "./multi-step-form";
import { SingleStepForm } from "./public-form/components";

interface PublicFormProps {
	formId: string;
	schema: FormSchema;
	theme?: string;
}

function useFormStyling(schema: FormSchema) {
	const stylingConfig = useMemo(() => {
		const settings = schema?.settings;
		const layout = settings?.layout;
		const colors = (settings as any)?.colors;

		const borderRadiusMap = {
			none: { radius: "0px", card: "0px" },
			sm: { radius: "4px", card: "8px" },
			md: { radius: "10px", card: "16px" },
			lg: { radius: "16px", card: "24px" },
			xl: { radius: "24px", card: "32px" },
		};

		const borderRadius = borderRadiusMap[layout?.borderRadius || "md"];

		return {
			borderRadius,
			customWidth:
				(layout as any)?.maxWidth === "custom"
					? (layout as any)?.customWidth
					: null,
			colors: {
				primary: colors?.primary,
				text: colors?.text,
				background: colors?.background,
				border: colors?.border,
			},
		};
	}, [schema?.settings]);

	useEffect(() => {
		if (typeof window === "undefined") return;

		const root = document.documentElement;
		const { borderRadius, customWidth, colors } = stylingConfig;

		root.style.setProperty("--radius", borderRadius.radius);
		root.style.setProperty("--card-radius", borderRadius.card);

		if (customWidth) {
			root.style.setProperty("--form-custom-width", customWidth);
		}

		Object.entries(colors).forEach(([key, value]) => {
			if (value) {
				root.style.setProperty(`--form-${key}-color`, value);
			}
		});

		return () => {
			root.style.setProperty("--radius", "0.7rem");
			root.style.setProperty("--card-radius", "1rem");
			root.style.removeProperty("--form-custom-width");
			Object.keys(colors).forEach((key) => {
				root.style.removeProperty(`--form-${key}-color`);
			});
		};
	}, [stylingConfig]);
}

function useFormType(schema: FormSchema) {
	return useMemo(() => {
		const isMultiStep = schema.settings.multiStep || schema.blocks?.length > 1;
		const dir = schema.settings.rtl ? "rtl" : "ltr";

		return { isMultiStep, dir };
	}, [schema.settings.multiStep, schema.blocks?.length, schema.settings.rtl]);
}

export function PublicForm({ formId, schema, theme }: PublicFormProps) {
	const { isMultiStep, dir } = useFormType(schema);

	useFormStyling(schema);

	return (
		<div
			aria-label="Form container"
			className={cn(
				"flex w-full flex-col gap-4",
				theme && `theme-${theme}`,
				dir === "rtl" && "rtl",
			)}
			dir={dir}
			role="main"
		>
			{isMultiStep ? (
				<MultiStepForm dir={dir} formId={formId} schema={schema} />
			) : (
				<SingleStepForm dir={dir} formId={formId} schema={schema} />
			)}
		</div>
	);
}

export default PublicForm;
