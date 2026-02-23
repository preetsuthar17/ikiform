"use client";

import { Monitor, Ruler } from "lucide-react";
import { useEffect, useState } from "react";
import {
	DEFAULT_FORM_DESIGN,
	FORM_BORDER_RADIUS_OPTIONS,
	FORM_PADDING_OPTIONS,
	FORM_WIDTH_OPTIONS,
} from "@/components/form-builder/form-settings-modal/constants";
import type { LocalSettings } from "@/components/form-builder/form-settings-modal/types";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

const FORM_MARGIN_OPTIONS = [
	{ value: "none", label: "None", preview: "", description: "No margin" },
	{ value: "sm", label: "Small", preview: "", description: "8px" },
	{ value: "md", label: "Medium", preview: "", description: "16px" },
	{ value: "lg", label: "Large", preview: "", description: "32px" },
];

interface LayoutCustomizationSectionProps {
	localSettings: LocalSettings;
	updateSettings: (updates: Partial<LocalSettings>) => void;
}

export function LayoutCustomizationSection({
	localSettings,
	updateSettings,
}: LayoutCustomizationSectionProps) {
	const currentWidth =
		localSettings.layout?.maxWidth || DEFAULT_FORM_DESIGN.maxWidth;
	const currentPadding =
		localSettings.layout?.padding || DEFAULT_FORM_DESIGN.padding;
	const currentMargin = localSettings.layout?.margin || "none";
	const currentBorderRadius =
		localSettings.layout?.borderRadius || DEFAULT_FORM_DESIGN.borderRadius;

	const customWidth = localSettings.layout?.customWidth || "600px";

	const getWidthSliderValue = (width: string) => {
		const index = FORM_WIDTH_OPTIONS.findIndex(
			(option) => option.value === width
		);
		return index >= 0 ? index : 1;
	};

	const getWidthFromSlider = (value: number) =>
		FORM_WIDTH_OPTIONS[
			Math.max(0, Math.min(value, FORM_WIDTH_OPTIONS.length - 1))
		].value;

	const getPaddingSliderValue = (padding: string) => {
		const index = FORM_PADDING_OPTIONS.findIndex(
			(option) => option.value === padding
		);
		return index >= 0 ? index : 2;
	};

	const getPaddingFromSlider = (value: number) =>
		FORM_PADDING_OPTIONS[
			Math.max(0, Math.min(value, FORM_PADDING_OPTIONS.length - 1))
		].value;

	const getMarginSliderValue = (margin: string) => {
		const index = FORM_MARGIN_OPTIONS.findIndex(
			(option) => option.value === margin
		);
		return index >= 0 ? index : 0;
	};

	const getMarginFromSlider = (value: number) =>
		FORM_MARGIN_OPTIONS[
			Math.max(0, Math.min(value, FORM_MARGIN_OPTIONS.length - 1))
		].value;

	const getBorderRadiusSliderValue = (radius: string) => {
		const index = FORM_BORDER_RADIUS_OPTIONS.findIndex(
			(option) => option.value === radius
		);
		return index >= 0 ? index : 2;
	};

	const getBorderRadiusFromSlider = (value: number) =>
		FORM_BORDER_RADIUS_OPTIONS[
			Math.max(0, Math.min(value, FORM_BORDER_RADIUS_OPTIONS.length - 1))
		].value;

	const [widthSliderValue, setWidthSliderValue] = useState<number>(() =>
		getWidthSliderValue(currentWidth)
	);
	const [paddingSliderValue, setPaddingSliderValue] = useState<number>(() =>
		getPaddingSliderValue(currentPadding)
	);
	const [marginSliderValue, setMarginSliderValue] = useState<number>(() =>
		getMarginSliderValue(currentMargin)
	);
	const [borderRadiusSliderValue, setBorderRadiusSliderValue] = useState<number>(
		() => getBorderRadiusSliderValue(currentBorderRadius)
	);

	useEffect(() => {
		setWidthSliderValue(getWidthSliderValue(currentWidth));
	}, [currentWidth]);

	useEffect(() => {
		setPaddingSliderValue(getPaddingSliderValue(currentPadding));
	}, [currentPadding]);

	useEffect(() => {
		setMarginSliderValue(getMarginSliderValue(currentMargin));
	}, [currentMargin]);

	useEffect(() => {
		setBorderRadiusSliderValue(getBorderRadiusSliderValue(currentBorderRadius));
	}, [currentBorderRadius]);

	const handleBorderRadiusChange = (values: number[]) => {
		setBorderRadiusSliderValue(values[0] ?? 0);
	};

	const handleBorderRadiusCommit = (values: number[]) => {
		const nextSliderValue = values[0] ?? borderRadiusSliderValue;
		const newRadius = getBorderRadiusFromSlider(nextSliderValue);
		if (newRadius === currentBorderRadius) {
			return;
		}
		updateSettings({
			layout: {
				...localSettings.layout,
				borderRadius: newRadius as "none" | "sm" | "md" | "lg" | "xl",
			},
		});
	};

	const handleWidthChange = (values: number[]) => {
		setWidthSliderValue(values[0] ?? 0);
	};

	const handleWidthCommit = (values: number[]) => {
		const nextSliderValue = values[0] ?? widthSliderValue;
		const newWidth = getWidthFromSlider(nextSliderValue);
		if (newWidth === currentWidth) {
			return;
		}
		updateSettings({
			layout: {
				...localSettings.layout,
				maxWidth: newWidth as "sm" | "md" | "lg" | "xl" | "full" | "custom",
			},
		});
	};

	const handleCustomWidthChange = (value: string) => {
		updateSettings({
			layout: {
				...localSettings.layout,
				customWidth: value,
			},
		});
	};

	const handlePaddingChange = (values: number[]) => {
		setPaddingSliderValue(values[0] ?? 0);
	};

	const handlePaddingCommit = (values: number[]) => {
		const nextSliderValue = values[0] ?? paddingSliderValue;
		const newPadding = getPaddingFromSlider(nextSliderValue);
		if (newPadding === currentPadding) {
			return;
		}
		updateSettings({
			layout: {
				...localSettings.layout,
				padding: newPadding as "none" | "sm" | "md" | "lg",
			},
		});
	};

	const handleMarginChange = (values: number[]) => {
		setMarginSliderValue(values[0] ?? 0);
	};

	const handleMarginCommit = (values: number[]) => {
		const nextSliderValue = values[0] ?? marginSliderValue;
		const newMargin = getMarginFromSlider(nextSliderValue);
		if (newMargin === currentMargin) {
			return;
		}
		updateSettings({
			layout: {
				...localSettings.layout,
				margin: newMargin as "none" | "sm" | "md" | "lg",
			},
		});
	};

	return (
		<div className="flex flex-col gap-4">
			<div>
				<div className="mb-2 flex items-center gap-2">
					<Monitor className="size-4 text-primary" />
					<h2 className="font-semibold text-lg">Layout Settings</h2>
				</div>
				<p className="text-muted-foreground text-xs">
					Configure spacing and structure
				</p>
			</div>

			<ScrollArea className="max-h-[calc(100vh-200px)]">
				<div className="flex flex-col gap-4">
					<Card className="p-4 shadow-none">
						<CardContent className="p-0">
							<div className="flex items-center gap-3">
								<Switch
									checked={!!localSettings.showProgress}
									id="show-progress-toggle"
									onCheckedChange={(checked) =>
										updateSettings({ showProgress: checked })
									}
								/>
								<Label
									className="cursor-pointer select-none"
									htmlFor="show-progress-toggle"
								>
									Show Progress Bar
								</Label>
							</div>
						</CardContent>
					</Card>

					<Card className="p-4 shadow-none">
						<CardContent className="flex flex-col gap-3 p-0">
							<Label className="flex items-center gap-2 font-medium">
								<Ruler className="size-4" />
								Form Width
							</Label>
							<p className="text-muted-foreground text-xs">
								Controls the maximum width of the form container
							</p>
							<div>
								<Slider
									aria-labelledby="form-width-label"
									max={FORM_WIDTH_OPTIONS.length - 1}
									min={0}
									onValueChange={handleWidthChange}
									onValueCommitted={handleWidthCommit}
									step={1}
									value={[widthSliderValue]}
								/>
							</div>
							{currentWidth === "custom" && (
								<div className="flex flex-col gap-2">
									<Label className="text-muted-foreground text-sm">
										Custom Width (e.g., 600px, 80%, 50rem)
									</Label>
									<Input
										className="max-w-xs"
										onChange={(e) => handleCustomWidthChange(e.target.value)}
										placeholder="Enter custom width"
										value={customWidth}
									/>
								</div>
							)}
							<p className="text-muted-foreground text-xs">
								{(() => {
									const idx = widthSliderValue;
									const opt = FORM_WIDTH_OPTIONS[idx];
									return opt ? `${opt.label} (${opt.description})` : "";
								})()}
							</p>
						</CardContent>
					</Card>

					<Card className="p-4 shadow-none">
						<CardContent className="flex flex-col gap-3 p-0">
							<Label className="font-medium">Internal Padding</Label>
							<p className="text-muted-foreground text-xs">
								Controls the space inside the form container
							</p>
							<div>
								<Slider
									aria-labelledby="internal-padding-label"
									max={FORM_PADDING_OPTIONS.length - 1}
									min={0}
									onValueChange={handlePaddingChange}
									onValueCommitted={handlePaddingCommit}
									step={1}
									value={[paddingSliderValue]}
								/>
							</div>
							<p className="text-muted-foreground text-xs">
								{(() => {
									const idx = paddingSliderValue;
									const opt = FORM_PADDING_OPTIONS[idx];
									return opt ? `${opt.label} (${opt.description})` : "";
								})()}
							</p>
						</CardContent>
					</Card>

					<Card className="p-4 shadow-none">
						<CardContent className="flex flex-col gap-3 p-0">
							<Label className="font-medium">External Margin</Label>
							<p className="text-muted-foreground text-xs">
								Controls the space around the form container
							</p>
							<div>
								<Slider
									aria-labelledby="external-margin-label"
									max={FORM_MARGIN_OPTIONS.length - 1}
									min={0}
									onValueChange={handleMarginChange}
									onValueCommitted={handleMarginCommit}
									step={1}
									value={[marginSliderValue]}
								/>
							</div>
							<p className="text-muted-foreground text-xs">
								{(() => {
									const idx = marginSliderValue;
									const opt = FORM_MARGIN_OPTIONS[idx];
									return opt ? `${opt.label} (${opt.description})` : "";
								})()}
							</p>
						</CardContent>
					</Card>

					<Card className="p-4 shadow-none">
						<CardContent className="flex flex-col gap-3 p-0">
							<Label className="font-medium">Corner Radius</Label>
							<p className="text-muted-foreground text-xs">
								Controls how rounded the form corners appear
							</p>
							<div>
								<Slider
									aria-labelledby="corner-radius-label"
									max={FORM_BORDER_RADIUS_OPTIONS.length - 1}
									min={0}
									onValueChange={handleBorderRadiusChange}
									onValueCommitted={handleBorderRadiusCommit}
									step={1}
									value={[borderRadiusSliderValue]}
								/>
							</div>
							<p className="text-muted-foreground text-xs">
								{(() => {
									const idx = borderRadiusSliderValue;
									const opt = FORM_BORDER_RADIUS_OPTIONS[idx];
									return opt ? `${opt.label} (${opt.description})` : "";
								})()}
							</p>
						</CardContent>
					</Card>
				</div>
			</ScrollArea>
		</div>
	);
}
