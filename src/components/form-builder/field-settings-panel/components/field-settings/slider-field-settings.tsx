import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	normalizeSliderSettings,
	type SliderMode,
} from "@/lib/fields/slider-utils";
import type { FieldSettingsProps } from "./types";

export function SliderFieldSettings({
	field,
	onUpdateSettings,
}: FieldSettingsProps) {
	const sliderSettings = normalizeSliderSettings(field.settings);

	const updateSliderSettings = (updates: Partial<typeof sliderSettings>) => {
		const nextSettings = normalizeSliderSettings({
			...field.settings,
			...updates,
		});

		onUpdateSettings(nextSettings);
	};

	return (
		<Card className="gap-2 p-4 shadow-none">
			<CardHeader className="p-0">
				<CardTitle className="flex items-center gap-2 text-lg">
					Slider Settings
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-4 p-0">
				<div className="flex flex-col gap-2">
					<Label className="font-medium text-sm" htmlFor="slider-mode">
						Slider Mode
					</Label>
					<Select
						onValueChange={(value) =>
							updateSliderSettings({ sliderMode: value as SliderMode })
						}
						value={sliderSettings.sliderMode}
					>
						<SelectTrigger aria-describedby="slider-mode-help" id="slider-mode">
							<SelectValue placeholder="Select slider mode" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="single">Single value</SelectItem>
							<SelectItem value="range">Range (min + max)</SelectItem>
						</SelectContent>
					</Select>
					<p className="text-muted-foreground text-xs" id="slider-mode-help">
						Choose one value or let users pick a minimum and maximum
					</p>
				</div>
				<div className="flex flex-col gap-2">
					<Label className="font-medium text-sm" htmlFor="slider-min">
						Minimum Value
					</Label>
					<Input
						aria-describedby="slider-min-help"
						autoComplete="off"
						id="slider-min"
						name="slider-min"
						onChange={(e) =>
							updateSliderSettings({
								min: Number.parseFloat(e.target.value) || 0,
							})
						}
						onKeyDown={(e) => {
							if (e.key === "Escape") {
								e.currentTarget.blur();
							}
						}}
						type="number"
						value={sliderSettings.min}
					/>
					<p className="text-muted-foreground text-xs" id="slider-min-help">
						Minimum value for the slider
					</p>
				</div>
				<div className="flex flex-col gap-2">
					<Label className="font-medium text-sm" htmlFor="slider-max">
						Maximum Value
					</Label>
					<Input
						aria-describedby="slider-max-help"
						autoComplete="off"
						id="slider-max"
						name="slider-max"
						onChange={(e) =>
							updateSliderSettings({
								max: Number.parseFloat(e.target.value) || 100,
							})
						}
						onKeyDown={(e) => {
							if (e.key === "Escape") {
								e.currentTarget.blur();
							}
						}}
						type="number"
						value={sliderSettings.max}
					/>
					<p className="text-muted-foreground text-xs" id="slider-max-help">
						Maximum value for the slider
					</p>
				</div>
				<div className="flex flex-col gap-2">
					<Label className="font-medium text-sm" htmlFor="slider-step">
						Step Size
					</Label>
					<Input
						aria-describedby="slider-step-help"
						autoComplete="off"
						id="slider-step"
						min="1"
						name="slider-step"
						onChange={(e) =>
							updateSliderSettings({
								step: Number.parseFloat(e.target.value) || 1,
							})
						}
						onKeyDown={(e) => {
							if (e.key === "Escape") {
								e.currentTarget.blur();
							}
						}}
						type="number"
						value={sliderSettings.step}
					/>
					<p className="text-muted-foreground text-xs" id="slider-step-help">
						Increment/decrement step size for the slider
					</p>
				</div>
				{sliderSettings.sliderMode === "range" ? (
					<>
						<div className="flex flex-col gap-2">
							<Label className="font-medium text-sm" htmlFor="slider-default-min">
								Default Minimum
							</Label>
							<Input
								aria-describedby="slider-default-min-help"
								autoComplete="off"
								id="slider-default-min"
								name="slider-default-min"
								onChange={(e) =>
									updateSliderSettings({
										defaultRangeMin: Number.parseFloat(e.target.value) || 0,
									})
								}
								onKeyDown={(e) => {
									if (e.key === "Escape") {
										e.currentTarget.blur();
									}
								}}
								type="number"
								value={sliderSettings.defaultRangeMin}
							/>
							<p
								className="text-muted-foreground text-xs"
								id="slider-default-min-help"
							>
								Pre-filled minimum value when the form loads
							</p>
						</div>
						<div className="flex flex-col gap-2">
							<Label className="font-medium text-sm" htmlFor="slider-default-max">
								Default Maximum
							</Label>
							<Input
								aria-describedby="slider-default-max-help"
								autoComplete="off"
								id="slider-default-max"
								name="slider-default-max"
								onChange={(e) =>
									updateSliderSettings({
										defaultRangeMax: Number.parseFloat(e.target.value) || 0,
									})
								}
								onKeyDown={(e) => {
									if (e.key === "Escape") {
										e.currentTarget.blur();
									}
								}}
								type="number"
								value={sliderSettings.defaultRangeMax}
							/>
							<p
								className="text-muted-foreground text-xs"
								id="slider-default-max-help"
							>
								Pre-filled maximum value when the form loads
							</p>
						</div>
					</>
				) : (
					<div className="flex flex-col gap-2">
						<Label className="font-medium text-sm" htmlFor="slider-default">
							Default Value
						</Label>
						<Input
							aria-describedby="slider-default-help"
							autoComplete="off"
							id="slider-default"
							name="slider-default"
							onChange={(e) =>
								updateSliderSettings({
									defaultValue: Number.parseFloat(e.target.value) || 50,
								})
							}
							onKeyDown={(e) => {
								if (e.key === "Escape") {
									e.currentTarget.blur();
								}
							}}
							type="number"
							value={sliderSettings.defaultValue}
						/>
						<p className="text-muted-foreground text-xs" id="slider-default-help">
							Pre-filled value when the form loads
						</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
