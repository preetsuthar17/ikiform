"use client";

import React from "react";
import { Separator } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea-base";
import {
	getBorderRadiusValue,
	getMarginValue,
	getMaxWidthValue,
	getPaddingValue,
} from "@/lib/utils/form-styles";
import type { LocalSettings } from "../types";

interface FormDesignPreviewProps {
	localSettings: LocalSettings;
	className?: string;
}

export function FormDesignPreview({
	localSettings,
	className,
}: FormDesignPreviewProps) {
	const layout = localSettings.layout || {};
	const colors = localSettings.colors || {};
	const typography = localSettings.typography || {};

	const formWidth =
		layout.maxWidth === "custom" && layout.customWidth
			? layout.customWidth
			: getMaxWidthValue(layout.maxWidth);

	const formPadding = getPaddingValue(layout.padding);
	const formMargin = getMarginValue(layout.margin);
	const formBorderRadius = getBorderRadiusValue(layout.borderRadius);

	const containerStyle: React.CSSProperties = {
		maxWidth: formWidth,
		margin: `${formMargin} auto`,
	};

	const cardStyle: React.CSSProperties = {
		backgroundColor: colors.background || undefined,
		color: colors.text || undefined,
		padding: formPadding,
		borderRadius: formBorderRadius,
		borderColor: colors.border || undefined,
		fontFamily: typography.fontFamily
			? `"${typography.fontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
			: undefined,
	};

	React.useEffect(() => {
		const styleId = "form-preview-styles";
		const existingStyle = document.getElementById(styleId);

		if (existingStyle) {
			existingStyle.remove();
		}

		const borderColor = colors.border || "#e2e8f0";
		const isMinimal = true;

		const fontSize = typography.fontSize || "base";
		const fontWeight = typography.fontWeight || "normal";
		const fontFamily = typography.fontFamily;

		const fontSizeMap = {
			xs: "12px",
			sm: "14px",
			base: "16px",
			lg: "18px",
			xl: "20px",
		};

		const fontWeightMap = {
			light: "300",
			normal: "400",
			medium: "500",
			semibold: "600",
			bold: "700",
		};

		const style = document.createElement("style");
		style.id = styleId;
		style.textContent = `
      .form-preview-container {
        border-radius: ${formBorderRadius} !important;
        border-top-left-radius: ${formBorderRadius} !important;
        border-top-right-radius: ${formBorderRadius} !important;
        border-bottom-left-radius: ${formBorderRadius} !important;
        border-bottom-right-radius: ${formBorderRadius} !important;
        overflow: hidden;
        ${isMinimal ? "border: none !important;" : `border: 1px solid ${borderColor} !important;`}
        ${fontFamily ? `font-family: "${fontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;` : ""}
        font-size: ${fontSizeMap[fontSize]} !important;
        font-weight: ${fontWeightMap[fontWeight]} !important;
      }
      .form-preview-container * {
        ${fontFamily ? "font-family: inherit !important;" : ""}
        font-size: inherit !important;
        font-weight: inherit !important;
      }
      .form-preview-container .form-field {
        border-color: ${borderColor} !important;
        font-size: inherit !important;
        font-weight: inherit !important;
      }
      .form-preview-container .form-field:focus {
        border-color: ${borderColor} !important;
        box-shadow: 0 0 0 2px ${colors.primary || "#2563eb"}40 !important;
      }
      .form-preview-container .form-button-primary {
        background-color: ${colors.primary || "#2563eb"} !important;
        border-color: ${colors.primary || "#2563eb"} !important;
        font-size: inherit !important;
        font-weight: inherit !important;
      }
      .form-preview-container h1, .form-preview-container h2, .form-preview-container h3, 
      .form-preview-container h4, .form-preview-container h5, .form-preview-container h6 {
        font-weight: ${fontWeightMap[fontWeight === "normal" ? "semibold" : fontWeight]} !important;
      }
    `;
		document.head.appendChild(style);

		return () => {
			const cleanup = document.getElementById(styleId);
			if (cleanup) {
				cleanup.remove();
			}
		};
	}, [
		formBorderRadius,
		colors.border,
		colors.primary,
		typography.fontSize,
		typography.fontWeight,
		typography.fontFamily,
	]);

	return (
		<Card className={`p-4 ${className}`}>
			<div className="mb-4">
				<h4 className="mb-2 font-medium text-muted-foreground text-sm">
					Live Preview
				</h4>
				<p className="text-muted-foreground text-xs">
					See how your form will look with the applied customizations
				</p>
			</div>

			{}
			<div style={containerStyle}>
				<div
					className={`form-preview-container ikiform-customized transition-all duration-200 ${
						true ? "bg-transparent" : ""
					}`}
					style={cardStyle}
				>
					<div className="flex flex-col gap-6">
						{}
						<div className="flex flex-col gap-2">
							<h3 className="font-semibold text-lg">Sample Form</h3>
							<p className="text-sm opacity-80">
								This is how your form will appear with the current design
								settings.
							</p>
						</div>
						<Separator />
						{}
						<div className="flex flex-col gap-4">
							<div className="flex flex-col gap-2">
								<Label htmlFor="preview-name">Name *</Label>
								<Input
									className="form-field"
									id="preview-name"
									placeholder="Enter your name"
									style={{
										fontFamily: "inherit",
									}}
								/>
							</div>

							<div className="flex flex-col gap-2">
								<Label htmlFor="preview-email">Email *</Label>
								<Input
									className="form-field"
									id="preview-email"
									placeholder="Enter your email"
									style={{
										fontFamily: "inherit",
									}}
									type="email"
								/>
							</div>

							<div className="flex flex-col gap-2">
								<Label htmlFor="preview-category">Category</Label>
								<Select>
									<SelectTrigger
										className="form-field"
										style={{
											fontFamily: "inherit",
										}}
									>
										<SelectValue placeholder="Select a category" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="general">General Inquiry</SelectItem>
										<SelectItem value="support">Support</SelectItem>
										<SelectItem value="sales">Sales</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="flex flex-col gap-2">
								<Label htmlFor="preview-message">Message</Label>
								<Textarea
									className="form-field"
									id="preview-message"
									placeholder="Enter your message"
									rows={3}
									style={{
										fontFamily: "inherit",
									}}
								/>
							</div>

							<Button
								className="form-button-primary w-full"
								style={{
									color: "#ffffff",
								}}
							>
								{localSettings.submitText || "Submit Form"}
							</Button>
						</div>
					</div>
				</div>
			</div>
		</Card>
	);
}
