import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FieldSettingsProps } from "./types";

export function TextFieldSettings({
	field,
	onUpdateSettings,
	onFieldUpdate,
}: FieldSettingsProps) {
	return (
		<Card className="gap-2 p-4 shadow-none">
			<CardHeader className="p-0">
				<CardTitle className="flex items-center gap-2 text-lg">
					Text Field Settings
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-4 p-0">
				<div className="flex flex-col gap-2">
					<Label className="font-medium text-sm" htmlFor="text-max-length">
						Maximum Length
					</Label>
					<Input
						aria-describedby="text-max-length-help"
						autoComplete="off"
						id="text-max-length"
						max="1000"
						min="1"
						name="text-max-length"
						onChange={(e) =>
							onFieldUpdate({
								...field,
								validation: {
									...field.validation,
									maxLength: Number.parseInt(e.target.value) || undefined,
								},
							})
						}
						onKeyDown={(e) => {
							if (e.key === "Escape") {
								e.currentTarget.blur();
							}
						}}
						placeholder="No limit"
						type="number"
						value={field.validation?.maxLength || ""}
					/>
					<p
						className="text-muted-foreground text-xs"
						id="text-max-length-help"
					>
						Maximum number of characters allowed (1-1000)
					</p>
				</div>
				<div className="flex flex-col gap-2">
					<Label className="font-medium text-sm" htmlFor="text-min-length">
						Minimum Length
					</Label>
					<Input
						aria-describedby="text-min-length-help"
						autoComplete="off"
						id="text-min-length"
						max="1000"
						min="0"
						name="text-min-length"
						onChange={(e) =>
							onFieldUpdate({
								...field,
								validation: {
									...field.validation,
									minLength: Number.parseInt(e.target.value) || undefined,
								},
							})
						}
						onKeyDown={(e) => {
							if (e.key === "Escape") {
								e.currentTarget.blur();
							}
						}}
						placeholder="No minimum"
						type="number"
						value={field.validation?.minLength || ""}
					/>
					<p
						className="text-muted-foreground text-xs"
						id="text-min-length-help"
					>
						Minimum number of characters required (0-1000)
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
