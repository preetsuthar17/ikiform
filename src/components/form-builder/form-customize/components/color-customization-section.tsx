"use client";

import { Paintbrush } from "lucide-react";
import { useTranslations } from "next-intl";
import type { LocalSettings } from "@/components/form-builder/form-settings-modal/types";
import { Card, CardContent } from "@/components/ui/card";
import { EnhancedColorPicker } from "@/components/ui/enhanced-color-picker";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ColorCustomizationSectionProps {
	localSettings: LocalSettings;
	updateSettings: (updates: Partial<LocalSettings>) => void;
}

export function ColorCustomizationSection({
	localSettings,
	updateSettings,
}: ColorCustomizationSectionProps) {
	const t = useTranslations("product.formBuilder.customize.colors");
	const backgroundColor = localSettings.colors?.background || "#ffffff";
	const textColor = localSettings.colors?.text || "#000000";
	const primaryColor = localSettings.colors?.primary || "#2563eb";
	const borderColor = localSettings.colors?.border || "#e2e8f0";
	const websiteBackgroundColor =
		localSettings.colors?.websiteBackground || "#ffffff";

	const handleBackgroundColorChange = (color: string) => {
		updateSettings({
			colors: {
				...localSettings.colors,
				background: color,
			},
		});
	};

	const handleTextColorChange = (color: string) => {
		updateSettings({
			colors: {
				...localSettings.colors,
				text: color,
			},
		});
	};

	const handlePrimaryColorChange = (color: string) => {
		updateSettings({
			colors: {
				...localSettings.colors,
				primary: color,
			},
		});
	};

	const handleBorderColorChange = (color: string) => {
		updateSettings({
			colors: {
				...localSettings.colors,
				border: color,
			},
		});
	};

	const handleWebsiteBackgroundColorChange = (color: string) => {
		updateSettings({
			colors: {
				...localSettings.colors,
				websiteBackground: color,
			},
		});
	};

	return (
		<div className="flex flex-col gap-4">
			<div>
				<div className="mb-2 flex items-center gap-2">
					<Paintbrush className="size-4 text-primary" />
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
							<EnhancedColorPicker
								allowTransparent={true}
								label={t("backgroundColorLabel")}
								onChange={handleBackgroundColorChange}
								value={backgroundColor}
							/>
							<p className="text-muted-foreground text-xs">
								{t("backgroundColorHelp")}
							</p>
						</CardContent>
					</Card>

					<Card className="p-4 shadow-none">
						<CardContent className="flex flex-col gap-3 p-0">
							<EnhancedColorPicker
								allowTransparent={false}
								label={t("textColorLabel")}
								onChange={handleTextColorChange}
								value={textColor}
							/>
							<p className="text-muted-foreground text-xs">
								{t("textColorHelp")}
							</p>
						</CardContent>
					</Card>

					<Card className="p-4 shadow-none">
						<CardContent className="flex flex-col gap-3 p-0">
							<EnhancedColorPicker
								allowTransparent={false}
								label={t("primaryColorLabel")}
								onChange={handlePrimaryColorChange}
								value={primaryColor}
							/>
							<p className="text-muted-foreground text-xs">
								{t("primaryColorHelp")}
							</p>
						</CardContent>
					</Card>

					<Card className="p-4 shadow-none">
						<CardContent className="flex flex-col gap-3 p-0">
							<EnhancedColorPicker
								allowTransparent={true}
								label={t("borderColorLabel")}
								onChange={handleBorderColorChange}
								value={borderColor}
							/>
							<p className="text-muted-foreground text-xs">
								{t("borderColorHelp")}
							</p>
						</CardContent>
					</Card>

					<Card className="p-4 shadow-none">
						<CardContent className="flex flex-col gap-3 p-0">
							<EnhancedColorPicker
								allowTransparent={false}
								label={t("websiteBackgroundColorLabel")}
								onChange={handleWebsiteBackgroundColorChange}
								value={websiteBackgroundColor}
							/>
							<p className="text-muted-foreground text-xs">
								{t("websiteBackgroundColorHelp")}
							</p>
						</CardContent>
					</Card>
				</div>
			</ScrollArea>
		</div>
	);
}
