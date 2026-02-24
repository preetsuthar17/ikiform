"use client";

import { Type } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import {
	FONT_SIZE_OPTIONS,
	FONT_WEIGHT_OPTIONS,
} from "@/components/form-builder/form-settings-modal/constants";
import type { LocalSettings } from "@/components/form-builder/form-settings-modal/types";
import { Card, CardContent } from "@/components/ui/card";
import { GoogleFontPicker } from "@/components/ui/google-font-picker";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import {
	generateFontPreviewStyles,
	loadGoogleFont,
} from "@/lib/utils/google-fonts";

interface TypographyCustomizationSectionProps {
	localSettings: LocalSettings;
	updateSettings: (updates: Partial<LocalSettings>) => void;
}

export function TypographyCustomizationSection({
	localSettings,
	updateSettings,
}: TypographyCustomizationSectionProps) {
	const t = useTranslations("product.formBuilder.customize.typography");
	const fontFamily = localSettings.typography?.fontFamily || "Inter";
	const fontSize = localSettings.typography?.fontSize || "base";
	const fontWeight = localSettings.typography?.fontWeight || "normal";

	const getFontSizeSliderValue = (size: string) => {
		const index = FONT_SIZE_OPTIONS.findIndex(
			(option) => option.value === size
		);
		return index >= 0 ? index : 1;
	};

	const getFontSizeFromSlider = (value: number) =>
		FONT_SIZE_OPTIONS[
			Math.max(0, Math.min(value, FONT_SIZE_OPTIONS.length - 1))
		].value;

	const getFontWeightSliderValue = (weight: string) => {
		const index = FONT_WEIGHT_OPTIONS.findIndex(
			(option) => option.value === weight
		);
		return index >= 0 ? index : 1;
	};

	const getFontWeightFromSlider = (value: number) =>
		FONT_WEIGHT_OPTIONS[
			Math.max(0, Math.min(value, FONT_WEIGHT_OPTIONS.length - 1))
		].value;

	const [fontSizeSliderValue, setFontSizeSliderValue] = useState<number>(() =>
		getFontSizeSliderValue(fontSize)
	);
	const [fontWeightSliderValue, setFontWeightSliderValue] = useState<number>(
		() => getFontWeightSliderValue(fontWeight)
	);

	useEffect(() => {
		setFontSizeSliderValue(getFontSizeSliderValue(fontSize));
	}, [fontSize]);

	useEffect(() => {
		setFontWeightSliderValue(getFontWeightSliderValue(fontWeight));
	}, [fontWeight]);

	const handleFontFamilyChange = (value: string) => {
		if (typeof window !== "undefined") {
			loadGoogleFont(value).catch((error) =>
				console.error("Failed to load font:", value, error)
			);
		}

		updateSettings({
			typography: {
				...localSettings.typography,
				fontFamily: value,
			},
		});
	};

	const handleFontSizeChange = (values: number[]) => {
		setFontSizeSliderValue(values[0] ?? 0);
	};

	const handleFontSizeCommit = (values: number[]) => {
		const nextSliderValue = values[0] ?? fontSizeSliderValue;
		const newSize = getFontSizeFromSlider(nextSliderValue);
		if (newSize === fontSize) {
			return;
		}
		updateSettings({
			typography: {
				...localSettings.typography,
				fontSize: newSize as "xs" | "sm" | "base" | "lg" | "xl",
			},
		});
	};

	const handleFontWeightChange = (values: number[]) => {
		setFontWeightSliderValue(values[0] ?? 0);
	};

	const handleFontWeightCommit = (values: number[]) => {
		const nextSliderValue = values[0] ?? fontWeightSliderValue;
		const newWeight = getFontWeightFromSlider(nextSliderValue);
		if (newWeight === fontWeight) {
			return;
		}
		updateSettings({
			typography: {
				...localSettings.typography,
				fontWeight: newWeight as
					| "light"
					| "normal"
					| "medium"
					| "semibold"
					| "bold",
			},
		});
	};

	return (
		<div className="flex flex-col gap-4">
			<div>
				<div className="mb-2 flex items-center gap-2">
					<Type className="size-4 text-primary" />
					<h2 className="font-semibold text-lg">{t("title")}</h2>
				</div>
				<p className="text-muted-foreground text-xs">
					{t("description")}
				</p>
			</div>

			<ScrollArea className="max-h-[calc(100vh-200px)]">
				<div className="flex flex-col gap-4">
					<Card className="p-4 shadow-none">
						<CardContent className="flex flex-col gap-3 p-0">
							<GoogleFontPicker
								label={t("fontFamily")}
								onChange={handleFontFamilyChange}
								placeholder={t("fontFamilyPlaceholder")}
								showPreview={true}
								value={fontFamily}
							/>
							<div className="rounded-lg border border-border bg-muted/30 p-4">
								<Label className="mb-2 block text-muted-foreground text-xs">
									{t("fontPreview")}
								</Label>
								<p
									className="text-lg"
									style={generateFontPreviewStyles(fontFamily)}
								>
									{t("previewLine1")}
								</p>
								<p
									className="mt-2 text-muted-foreground text-sm"
									style={generateFontPreviewStyles(fontFamily)}
								>
									{t("previewLine2")}
								</p>
							</div>
							<p className="text-muted-foreground text-xs">
								{t("fontHelp")}
							</p>
						</CardContent>
					</Card>

					<Card className="p-4 shadow-none">
						<CardContent className="flex flex-col gap-3 p-0">
							<Label className="font-medium" id="font-size-label">
								{t("fontSize")}
							</Label>
							<div className="px-2">
								<Slider
									aria-labelledby="font-size-label"
									max={FONT_SIZE_OPTIONS.length - 1}
									min={0}
									onValueChange={handleFontSizeChange}
									onValueCommitted={handleFontSizeCommit}
									step={1}
									value={[fontSizeSliderValue]}
								/>
							</div>
							<p className="text-muted-foreground text-xs">
								{t("selected")} {(() => {
									const idx = fontSizeSliderValue;
									const opt = FONT_SIZE_OPTIONS[idx];
									if (!opt) return "";
									return `${t(`fontSizeOptions.${opt.value}.label`)} (${t(
										`fontSizeOptions.${opt.value}.description`
									)})`;
								})()}
							</p>
						</CardContent>
					</Card>

					<Card className="p-4 shadow-none">
						<CardContent className="flex flex-col gap-3 p-0">
							<Label className="font-medium" id="font-weight-label">
								{t("fontWeight")}
							</Label>
							<div className="px-2">
								<Slider
									aria-labelledby="font-weight-label"
									max={FONT_WEIGHT_OPTIONS.length - 1}
									min={0}
									onValueChange={handleFontWeightChange}
									onValueCommitted={handleFontWeightCommit}
									step={1}
									value={[fontWeightSliderValue]}
								/>
							</div>
							<p className="text-muted-foreground text-xs">
								{t("selected")} {(() => {
									const idx = fontWeightSliderValue;
									const opt = FONT_WEIGHT_OPTIONS[idx];
									if (!opt) return "";
									return `${t(`fontWeightOptions.${opt.value}.label`)} (${t(
										`fontWeightOptions.${opt.value}.description`
									)})`;
								})()}
							</p>
						</CardContent>
					</Card>
				</div>
			</ScrollArea>
		</div>
	);
}
