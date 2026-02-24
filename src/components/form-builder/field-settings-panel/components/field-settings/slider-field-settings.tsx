import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
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
	const t = useTranslations("product.formBuilder.fieldSettings.slider");
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
					{t("title")}
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-4 p-0">
				<div className="flex flex-col gap-2">
					<Label className="font-medium text-sm" htmlFor="slider-mode">
						{t("mode")}
					</Label>
					<Select
						onValueChange={(value) =>
							updateSliderSettings({ sliderMode: value as SliderMode })
						}
						value={sliderSettings.sliderMode}
					>
						<SelectTrigger aria-describedby="slider-mode-help" id="slider-mode">
							<SelectValue placeholder={t("modePlaceholder")} />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="single">{t("modeSingle")}</SelectItem>
							<SelectItem value="range">{t("modeRange")}</SelectItem>
						</SelectContent>
					</Select>
					<p className="text-muted-foreground text-xs" id="slider-mode-help">
						{t("modeHelp")}
					</p>
				</div>
				<div className="flex flex-col gap-2">
					<Label className="font-medium text-sm" htmlFor="slider-min">
						{t("min")}
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
						{t("minHelp")}
					</p>
				</div>
				<div className="flex flex-col gap-2">
					<Label className="font-medium text-sm" htmlFor="slider-max">
						{t("max")}
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
						{t("maxHelp")}
					</p>
				</div>
				<div className="flex flex-col gap-2">
					<Label className="font-medium text-sm" htmlFor="slider-step">
						{t("step")}
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
						{t("stepHelp")}
					</p>
				</div>
				{sliderSettings.sliderMode === "range" ? (
					<>
						<div className="flex flex-col gap-2">
							<Label className="font-medium text-sm" htmlFor="slider-default-min">
								{t("defaultMin")}
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
								{t("defaultMinHelp")}
							</p>
						</div>
						<div className="flex flex-col gap-2">
							<Label className="font-medium text-sm" htmlFor="slider-default-max">
								{t("defaultMax")}
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
								{t("defaultMaxHelp")}
							</p>
						</div>
					</>
				) : (
					<div className="flex flex-col gap-2">
						<Label className="font-medium text-sm" htmlFor="slider-default">
							{t("defaultValue")}
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
							{t("defaultValueHelp")}
						</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
