"use client";

import { Palette, Pipette } from "lucide-react";
import { useRef, useState } from "react";
import { TRANSPARENT_PATTERN } from "@/components/form-builder/form-settings-modal/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";

interface EnhancedColorPickerProps {
	value: string;
	onChange: (color: string) => void;
	label?: string;
	allowTransparent?: boolean;
}

export function EnhancedColorPicker({
	value,
	onChange,
	label,
	allowTransparent = true,
}: EnhancedColorPickerProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [opacity, setOpacity] = useState(100);
	const [brightness, setBrightness] = useState(100);
	const colorInputRef = useRef<HTMLInputElement>(null);

	const hexColor = value === "transparent" ? "#ffffff" : value;

	const handleColorChange = (newColor: string) => {
		if (opacity < 100) {
			const alpha = Math.round((opacity / 100) * 255)
				.toString(16)
				.padStart(2, "0");
			onChange(newColor + alpha);
		} else if (brightness !== 100) {
			const brightnessAdjusted = adjustBrightness(newColor, brightness / 100);
			onChange(brightnessAdjusted);
		} else {
			onChange(newColor);
		}
	};

	const handleOpacityChange = ([newOpacity]: number[]) => {
		setOpacity(newOpacity);
		if (newOpacity === 0) {
			onChange("transparent");
		} else if (newOpacity === 100) {
			onChange(hexColor);
		} else {
			const alpha = Math.round((newOpacity / 100) * 255)
				.toString(16)
				.padStart(2, "0");
			onChange(hexColor + alpha);
		}
	};

	const handleBrightnessChange = ([newBrightness]: number[]) => {
		setBrightness(newBrightness);
		const adjustedColor = adjustBrightness(hexColor, newBrightness / 100);
		onChange(adjustedColor);
	};

	const adjustBrightness = (hex: string, factor: number): string => {
		const r = Number.parseInt(hex.slice(1, 3), 16);
		const g = Number.parseInt(hex.slice(3, 5), 16);
		const b = Number.parseInt(hex.slice(5, 7), 16);

		const newR = Math.round(Math.min(255, Math.max(0, r * factor)));
		const newG = Math.round(Math.min(255, Math.max(0, g * factor)));
		const newB = Math.round(Math.min(255, Math.max(0, b * factor)));

		return `#${newR.toString(16).padStart(2, "0")}${newG.toString(16).padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
	};

	const handleEyeDropper = async () => {
		if ("EyeDropper" in window) {
			try {
				const eyeDropper = new (window as any).EyeDropper();
				const result = await eyeDropper.open();
				onChange(result.sRGBHex);
			} catch (e) {}
		}
	};

	const displayValue = value === "transparent" ? "Transparent" : value;

	return (
		<div className="flex flex-col gap-2">
			{label && <Label className="font-medium text-sm">{label}</Label>}

			<div className="flex gap-2">
				{}
				<Popover onOpenChange={setIsOpen} open={isOpen}>
					<PopoverTrigger asChild>
						<Button
							aria-label={label ? `Pick ${label}` : "Pick color"}
							className="border-2"
							size="icon"
							style={{
								backgroundColor: value === "transparent" ? undefined : value,
								backgroundImage:
									value === "transparent"
										? `url("${TRANSPARENT_PATTERN}")`
										: undefined,
							}}
							variant="outline"
						>
							<Palette className="size-4" />
						</Button>
					</PopoverTrigger>
					<PopoverContent align="start" className="w-80 p-0 shadow-xs">
						<div className="flex flex-col gap-3 p-3">
							<div className="flex flex-col gap-2">
								<Label className="text-sm">Color</Label>
								<div className="flex items-center gap-2">
									<input
										aria-label="Pick color"
										className="h-9 w-10 cursor-pointer rounded border border-border"
										onChange={(e) => handleColorChange(e.target.value)}
										ref={colorInputRef}
										type="color"
										value={hexColor}
									/>
									<Input
										aria-label="Hex color value"
										className="flex-1"
										onChange={(e) => handleColorChange(e.target.value)}
										placeholder="#000000"
										value={hexColor}
									/>
									{"EyeDropper" in window && (
										<Button
											aria-label="Eyedropper"
											onClick={handleEyeDropper}
											size="icon"
											variant="outline"
										>
											<Pipette className="size-4" />
										</Button>
									)}
								</div>
							</div>

							{allowTransparent && (
								<div className="flex flex-col gap-2">
									<div className="flex items-center justify-between">
										<Label className="text-sm">Opacity</Label>
										<span className="text-muted-foreground text-xs">
											{opacity}%
										</span>
									</div>
									<Slider
										className="w-full"
										max={100}
										min={0}
										onValueChange={handleOpacityChange}
										step={1}
										value={[opacity]}
									/>
								</div>
							)}

							<div className="flex flex-col gap-2">
								<div className="flex items-center justify-between">
									<Label className="text-sm">Brightness</Label>
									<span className="text-muted-foreground text-xs">
										{brightness}%
									</span>
								</div>
								<Slider
									className="w-full"
									max={200}
									min={0}
									onValueChange={handleBrightnessChange}
									step={1}
									value={[brightness]}
								/>
							</div>

							{allowTransparent && (
								<div className="flex items-center justify-end gap-2">
									<Button
										onClick={() => onChange("transparent")}
										size="sm"
										variant="outline"
									>
										Transparent
									</Button>
									<Button
										onClick={() => {
											setOpacity(100);
											setBrightness(100);
											onChange("#ffffff");
										}}
										size="sm"
										variant="outline"
									>
										Reset
									</Button>
								</div>
							)}
						</div>
					</PopoverContent>
				</Popover>

				{}
				<Input
					className="flex-1"
					onChange={(e) => onChange(e.target.value)}
					placeholder="Color value"
					value={displayValue}
				/>
			</div>
		</div>
	);
}
