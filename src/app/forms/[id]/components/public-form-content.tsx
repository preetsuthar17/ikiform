import dynamic from "next/dynamic";
import { Suspense, useEffect } from "react";
import { CSSPropertiesProvider } from "./css-properties-provider";
import { FormSkeleton } from "./form-skeletons";

function hexToHsl(hex: string): string {
	hex = hex.replace("#", "");

	const r = Number.parseInt(hex.substring(0, 2), 16) / 255;
	const g = Number.parseInt(hex.substring(2, 4), 16) / 255;
	const b = Number.parseInt(hex.substring(4, 6), 16) / 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	let h = 0;
	let s = 0;
	const l = (max + min) / 2;

	if (max !== min) {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}
		h /= 6;
	}

	return `${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
}

const MultiStepForm = dynamic(
	() =>
		import("@/components/forms/multi-step-form").then((mod) => ({
			default: mod.MultiStepForm,
		})),
	{
		loading: () => <FormSkeleton showProgress={true} variant="multi-step" />,
	},
);

const SingleStepForm = dynamic(
	() =>
		import("@/components/forms/public-form/components").then((mod) => ({
			default: mod.SingleStepForm,
		})),
	{
		loading: () => <FormSkeleton variant="single-step" />,
	},
);

interface PublicFormContentProps {
	formId: string;
	schema: any;
}

export default function PublicFormContent({
	formId,
	schema,
}: PublicFormContentProps) {
	const isMultiStep = schema.settings?.multiStep || schema.blocks?.length > 1;
	const dir = schema.settings?.rtl ? "rtl" : "ltr";
	const borderRadius = schema?.settings?.layout?.borderRadius || "md";

	useEffect(() => {
		if (typeof window === "undefined") return;

		const colors = schema.settings?.colors;
		if (colors?.websiteBackground) {
			const root = document.documentElement;
			const hslValues = hexToHsl(colors.websiteBackground);
			root.style.setProperty("--hu-background", hslValues);
			root.style.setProperty("--color-background", `hsl(${hslValues})`);

			return () => {
				root.style.removeProperty("--hu-background");
				root.style.removeProperty("--color-background");
			};
		}
	}, [schema.settings?.colors?.websiteBackground]);

	return (
		<CSSPropertiesProvider borderRadius={borderRadius}>
			<div className="light">
				<div
					className="flex h-full min-h-screen w-full flex-col items-center justify-center gap-4"
					dir={dir}
				>
					<Suspense
						fallback={
							<FormSkeleton
								showProgress={isMultiStep}
								variant={isMultiStep ? "multi-step" : "single-step"}
							/>
						}
					>
						{isMultiStep ? (
							<MultiStepForm dir={dir} formId={formId} schema={schema} />
						) : (
							<SingleStepForm dir={dir} formId={formId} schema={schema} />
						)}
					</Suspense>
				</div>
			</div>
		</CSSPropertiesProvider>
	);
}
