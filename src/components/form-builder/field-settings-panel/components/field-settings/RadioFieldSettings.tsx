import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import type { FieldSettingsProps } from "./types";

export function RadioFieldSettings({
	field,
	onUpdateSettings,
}: FieldSettingsProps) {
	return (
		<Card className="flex flex-col gap-4 p-4 shadow-none">
			<h3 className="font-medium text-card-foreground">Quiz Settings</h3>

			{}
			<div className="flex items-center gap-2">
				<Switch
					checked={!!field.settings?.isQuizField}
					id="quiz-field-enabled"
					onCheckedChange={(checked) =>
						onUpdateSettings({ isQuizField: checked })
					}
				/>
				<Label className="text-card-foreground" htmlFor="quiz-field-enabled">
					Enable as Quiz Question
				</Label>
			</div>

			{field.settings?.isQuizField && (
				<>
					<Separator />

					{}
					<div className="flex flex-col gap-2">
						<Label className="text-card-foreground" htmlFor="correct-answer">
							Correct Answer
						</Label>
						<Select
							onValueChange={(value) =>
								onUpdateSettings({ correctAnswer: value })
							}
							value={
								Array.isArray(field.settings?.correctAnswer)
									? field.settings?.correctAnswer[0] || ""
									: field.settings?.correctAnswer || ""
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select the correct answer" />
							</SelectTrigger>
							<SelectContent>
								{(field.options || [])
									.filter((option) => {
										const value =
											typeof option === "string" ? option : option.value;
										return value && value.trim() !== "";
									})
									.map((option, idx) => {
										const value =
											typeof option === "string" ? option : option.value;
										const label =
											typeof option === "string"
												? option
												: option.label || option.value;
										return (
											<SelectItem key={idx} value={value}>
												{label}
											</SelectItem>
										);
									})}
							</SelectContent>
						</Select>
					</div>

					{}
					<div className="flex flex-col gap-2">
						<Label className="text-card-foreground" htmlFor="quiz-points">
							Points for Correct Answer
						</Label>
						<Input
							id="quiz-points"
							max="100"
							min="1"
							onChange={(e) =>
								onUpdateSettings({
									points: Number.parseInt(e.target.value) || 1,
								})
							}
							type="number"
							value={field.settings?.points || 1}
						/>
					</div>

					{}
					<div className="flex items-center gap-2">
						<Switch
							checked={field.settings?.showCorrectAnswer !== false}
							id="show-correct-answer"
							onCheckedChange={(checked) =>
								onUpdateSettings({ showCorrectAnswer: checked })
							}
						/>
						<Label
							className="text-card-foreground"
							htmlFor="show-correct-answer"
						>
							Show correct answer after submission
						</Label>
					</div>

					{}
					<div className="flex flex-col gap-2">
						<Label className="text-card-foreground" htmlFor="quiz-explanation">
							Explanation (Optional)
						</Label>
						<Input
							id="quiz-explanation"
							onChange={(e) =>
								onUpdateSettings({ explanation: e.target.value })
							}
							placeholder="Explain why this is the correct answer..."
							value={field.settings?.explanation || ""}
						/>
					</div>
				</>
			)}
		</Card>
	);
}
