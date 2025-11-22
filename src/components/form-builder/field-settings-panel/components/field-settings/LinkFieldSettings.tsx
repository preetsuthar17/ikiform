import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FieldSettingsProps } from "./types";

export function LinkFieldSettings({
	field,
	onUpdateSettings,
}: FieldSettingsProps) {
	return (
		<Card className="gap-2 p-4 shadow-none">
			<CardHeader className="p-0">
				<CardTitle className="flex items-center gap-2 text-lg">
					Link Field Settings
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-4 p-0">
				<div className="flex flex-col gap-2">
					<Label className="font-medium text-sm" htmlFor="link-pattern">
						Custom Regex Pattern
					</Label>
					<Input
						aria-describedby="link-pattern-help"
						autoComplete="off"
						id="link-pattern"
						name="link-pattern"
						onChange={(e) => onUpdateSettings({ pattern: e.target.value })}
						onKeyDown={(e) => {
							if (e.key === "Escape") {
								e.currentTarget.blur();
							}
						}}
						placeholder="e.g. ^https?://.+$"
						type="text"
						value={field.settings?.pattern ?? ""}
					/>
					<p className="text-muted-foreground text-xs" id="link-pattern-help">
						Regular expression pattern for URL validation
					</p>
				</div>
				<div className="flex flex-col gap-2">
					<Label className="font-medium text-sm" htmlFor="link-message">
						Custom Error Message
					</Label>
					<Input
						aria-describedby="link-message-help"
						autoComplete="off"
						id="link-message"
						name="link-message"
						onChange={(e) =>
							onUpdateSettings({ patternMessage: e.target.value })
						}
						onKeyDown={(e) => {
							if (e.key === "Escape") {
								e.currentTarget.blur();
							}
						}}
						placeholder="Please enter a valid URL"
						type="text"
						value={field.settings?.patternMessage ?? ""}
					/>
					<p className="text-muted-foreground text-xs" id="link-message-help">
						Custom error message shown when URL validation fails
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
