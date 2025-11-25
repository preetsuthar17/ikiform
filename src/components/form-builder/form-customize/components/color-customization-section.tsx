"use client";

import { Paintbrush } from "lucide-react";
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
					<h2 className="font-semibold text-lg">Color Settings</h2>
				</div>
				<p className="text-muted-foreground text-xs">
					Customize colors and theme
				</p>
			</div>

			<ScrollArea className="max-h-[calc(100vh-200px)]">
				<div className="flex flex-col gap-4">
					<Card className="p-4 shadow-none">
						<CardContent className="flex flex-col gap-3 p-0">
							<EnhancedColorPicker
								allowTransparent={true}
								label="Background Color"
								onChange={handleBackgroundColorChange}
								value={backgroundColor}
							/>
							<p className="text-muted-foreground text-xs">
								Sets the background color of the form container
							</p>
						</CardContent>
					</Card>

					<Card className="p-4 shadow-none">
						<CardContent className="flex flex-col gap-3 p-0">
							<EnhancedColorPicker
								allowTransparent={false}
								label="Text Color"
								onChange={handleTextColorChange}
								value={textColor}
							/>
							<p className="text-muted-foreground text-xs">
								Sets the color of all text elements in the form
							</p>
						</CardContent>
					</Card>

					<Card className="p-4 shadow-none">
						<CardContent className="flex flex-col gap-3 p-0">
							<EnhancedColorPicker
								allowTransparent={false}
								label="Primary Color (Buttons & Accent)"
								onChange={handlePrimaryColorChange}
								value={primaryColor}
							/>
							<p className="text-muted-foreground text-xs">
								Sets the color for buttons, focus states, and accent elements
							</p>
						</CardContent>
					</Card>

					<Card className="p-4 shadow-none">
						<CardContent className="flex flex-col gap-3 p-0">
							<EnhancedColorPicker
								allowTransparent={true}
								label="Border Color"
								onChange={handleBorderColorChange}
								value={borderColor}
							/>
							<p className="text-muted-foreground text-xs">
								Sets the color for input field borders and dividers
							</p>
						</CardContent>
					</Card>

					<Card className="p-4 shadow-none">
						<CardContent className="flex flex-col gap-3 p-0">
							<EnhancedColorPicker
								allowTransparent={false}
								label="Website Background Color"
								onChange={handleWebsiteBackgroundColorChange}
								value={websiteBackgroundColor}
							/>
							<p className="text-muted-foreground text-xs">
								Sets the background color of the entire website/page
							</p>
						</CardContent>
					</Card>
				</div>
			</ScrollArea>
		</div>
	);
}
