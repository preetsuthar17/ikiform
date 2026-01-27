import clsx from "clsx";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import type { BaseFieldProps } from "../types";

const VARIANT_ICON_MAP = {
	warning: AlertTriangle,
	error: XCircle,
	info: Info,
	success: CheckCircle2,
} as const;

const VARIANT_STYLES = {
	warning: {
		iconBg: "bg-amber-500",
		iconFg: "text-white",
		titleFg: "text-amber-900",
		border: "border-amber-200",
		bg: "bg-amber-50",
		text: "text-amber-900",
	},
	error: {
		iconBg: "bg-red-500",
		iconFg: "text-white",
		titleFg: "text-red-900",
		border: "border-red-200",
		bg: "bg-red-50",
		text: "text-red-900",
	},
	info: {
		iconBg: "bg-blue-500",
		iconFg: "text-white",
		titleFg: "text-blue-900",
		border: "border-blue-200",
		bg: "bg-blue-50",
		text: "text-blue-900",
	},
	success: {
		iconBg: "bg-emerald-500",
		iconFg: "text-white",
		titleFg: "text-emerald-900",
		border: "border-emerald-200",
		bg: "bg-emerald-50",
		text: "text-emerald-900",
	},
} as const;

export function BannerField({ field, error }: BaseFieldProps) {
	const getBannerVariant = () => {
		const variant = field.settings?.bannerVariant as string;
		return variant in VARIANT_STYLES
			? (variant as keyof typeof VARIANT_STYLES)
			: "info";
	};

	const getBannerTitle = () => field.settings?.bannerTitle || "";

	const getBannerDescription = () =>
		field.settings?.bannerDescription || field.description || "";

	const getBannerStyles = () => {
		const variant = getBannerVariant();
		return VARIANT_STYLES[variant];
	};

	const getBannerIcon = () => {
		const variant = getBannerVariant();
		return VARIANT_ICON_MAP[variant];
	};

	const getBannerClassName = () => {
		const { border, bg } = getBannerStyles();
		return clsx("flex items-center gap-4 rounded-xl border p-4", border, bg);
	};

	const getIconClassName = () => {
		const { iconBg } = getBannerStyles();
		return clsx(
			"flex size-6 shrink-0 items-center justify-center rounded-full",
			iconBg
		);
	};

	const getTitleClassName = () => {
		const { titleFg } = getBannerStyles();
		return clsx("font-semibold text-base", titleFg, "w-full text-left");
	};

	const getDescriptionClassName = () => {
		const { text } = getBannerStyles();
		return clsx("whitespace-pre-line text-sm", text, "w-full text-left");
	};

	const renderBannerIcon = () => {
		const Icon = getBannerIcon();
		const { iconFg } = getBannerStyles();

		return (
			<span className={getIconClassName()}>
				<Icon aria-hidden="true" className={clsx("size-4", iconFg)} />
			</span>
		);
	};

	const renderBannerTitle = () => {
		const title = getBannerTitle();
		if (!title) return null;

		return <AlertTitle className={getTitleClassName()}>{title}</AlertTitle>;
	};

	const renderBannerDescription = () => {
		const description = getBannerDescription();
		if (!description) return null;

		return (
			<AlertDescription className={getDescriptionClassName()}>
				{description}
			</AlertDescription>
		);
	};

	const renderBannerContent = () => (
		<Card className="border-0 bg-transparent p-0 shadow-none">
			<CardContent className="p-0">
				<Alert
					aria-live={getBannerVariant() === "error" ? "assertive" : "polite"}
					className={getBannerClassName()}
					role="status"
					variant={
						getBannerVariant() === "error"
							? "destructive"
							: getBannerVariant() === "warning"
								? "default"
								: undefined
					}
				>
					{renderBannerIcon()}
					<div className="flex min-w-0 flex-1 flex-col gap-2">
						{renderBannerTitle()}
						{renderBannerDescription()}
					</div>
				</Alert>
			</CardContent>
		</Card>
	);

	return (
		<div className="flex flex-col gap-3">
			{field.label && (
				<div className="font-semibold text-base text-foreground">
					{field.label}
					{field.required && <span className="ml-1 text-destructive">*</span>}
				</div>
			)}
			{field.description && (
				<p className="w-full text-left text-muted-foreground text-sm leading-relaxed">
					{field.description}
				</p>
			)}
			{renderBannerContent()}
		</div>
	);
}
