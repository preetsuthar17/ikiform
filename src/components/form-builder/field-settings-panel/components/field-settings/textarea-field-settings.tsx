import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FieldSettingsProps } from "./types";

export function TextareaFieldSettings({
	field,
	onUpdateSettings,
}: FieldSettingsProps) {
	return (
		<Card className="gap-2 p-4 shadow-none">
			<CardHeader className="p-0">
				<CardTitle className="flex items-center gap-2 text-lg">
					Textarea Field Settings
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-4 p-0">
				<div className="flex flex-col gap-2">
					<Label className="font-medium text-sm" htmlFor="textarea-rows">
						Number of Rows
					</Label>
					<Input
						aria-describedby="textarea-rows-help"
						autoComplete="off"
						id="textarea-rows"
						max="20"
						min="2"
						name="textarea-rows"
						onChange={(e) =>
							onUpdateSettings({
								rows: Number.parseInt(e.target.value) || 4,
							})
						}
						onKeyDown={(e) => {
							if (e.key === "Escape") {
								e.currentTarget.blur();
							}
						}}
						type="number"
						value={field.settings?.rows || 4}
					/>
					<p className="text-muted-foreground text-xs" id="textarea-rows-help">
						Initial height of the textarea (2-20 rows)
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
