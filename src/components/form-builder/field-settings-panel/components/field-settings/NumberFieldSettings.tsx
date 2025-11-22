import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FieldSettingsProps } from "./types";

export function NumberFieldSettings({
	field,
	onUpdateSettings,
}: FieldSettingsProps) {
	return (
		<Card className="gap-2 p-4 shadow-none">
			<CardHeader className="p-0">
				<CardTitle className="flex items-center gap-2 text-lg">
					Number Field Settings
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-4 p-0">
				<div className="flex flex-col gap-2">
					<Label className="font-medium text-sm" htmlFor="number-min">
						Minimum Value
					</Label>
					<Input
						aria-describedby="number-min-help"
						autoComplete="off"
						id="number-min"
						name="number-min"
						onChange={(e) =>
							onUpdateSettings({
								min: Number.parseFloat(e.target.value) || undefined,
							})
						}
						onKeyDown={(e) => {
							if (e.key === "Escape") {
								e.currentTarget.blur();
							}
						}}
						placeholder="No minimum"
						type="number"
						value={field.settings?.min || ""}
					/>
					<p className="text-muted-foreground text-xs" id="number-min-help">
						Minimum numeric value allowed
					</p>
				</div>
				<div className="flex flex-col gap-2">
					<Label className="font-medium text-sm" htmlFor="number-max">
						Maximum Value
					</Label>
					<Input
						aria-describedby="number-max-help"
						autoComplete="off"
						id="number-max"
						name="number-max"
						onChange={(e) =>
							onUpdateSettings({
								max: Number.parseFloat(e.target.value) || undefined,
							})
						}
						onKeyDown={(e) => {
							if (e.key === "Escape") {
								e.currentTarget.blur();
							}
						}}
						placeholder="No maximum"
						type="number"
						value={field.settings?.max || ""}
					/>
					<p className="text-muted-foreground text-xs" id="number-max-help">
						Maximum numeric value allowed
					</p>
				</div>
				<div className="flex flex-col gap-2">
					<Label className="font-medium text-sm" htmlFor="number-step">
						Step Size
					</Label>
					<Input
						aria-describedby="number-step-help"
						autoComplete="off"
						id="number-step"
						min="0.01"
						name="number-step"
						onChange={(e) =>
							onUpdateSettings({
								step: Number.parseFloat(e.target.value) || 1,
							})
						}
						onKeyDown={(e) => {
							if (e.key === "Escape") {
								e.currentTarget.blur();
							}
						}}
						placeholder="1"
						type="number"
						value={field.settings?.step || 1}
					/>
					<p className="text-muted-foreground text-xs" id="number-step-help">
						Increment/decrement step size for the number input
					</p>
				</div>
				<div className="flex flex-col gap-2">
					<Label className="font-medium text-sm" htmlFor="number-default">
						Default Value
					</Label>
					<Input
						aria-describedby="number-default-help"
						autoComplete="off"
						id="number-default"
						name="number-default"
						onChange={(e) =>
							onUpdateSettings({
								defaultValue: Number.parseFloat(e.target.value) || undefined,
							})
						}
						onKeyDown={(e) => {
							if (e.key === "Escape") {
								e.currentTarget.blur();
							}
						}}
						placeholder="No default"
						type="number"
						value={field.settings?.defaultValue || ""}
					/>
					<p className="text-muted-foreground text-xs" id="number-default-help">
						Pre-filled value when the form loads
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
