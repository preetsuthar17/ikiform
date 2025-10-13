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
    <Card className="flex flex-col gap-4 rounded-2xl bg-background p-4">
      <h3 className="font-medium text-card-foreground">Quiz Settings</h3>

      {/* Enable Quiz Mode */}
      <div className="flex items-center gap-2">
        <Switch
          checked={!!field.settings?.isQuizField}
          id="quiz-field-enabled"
          onCheckedChange={(checked) =>
            onUpdateSettings({ isQuizField: checked })
          }
          size="sm"
        />
        <Label className="text-card-foreground" htmlFor="quiz-field-enabled">
          Enable as Quiz Question
        </Label>
      </div>

      {field.settings?.isQuizField && (
        <>
          <Separator />

          {/* Correct Answer */}
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
                {(field.options || []).map((option, idx) => {
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

          {/* Points */}
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

          {/* Show Correct Answer */}
          <div className="flex items-center gap-2">
            <Switch
              checked={field.settings?.showCorrectAnswer !== false}
              id="show-correct-answer"
              onCheckedChange={(checked) =>
                onUpdateSettings({ showCorrectAnswer: checked })
              }
              size="sm"
            />
            <Label
              className="text-card-foreground"
              htmlFor="show-correct-answer"
            >
              Show correct answer after submission
            </Label>
          </div>

          {/* Explanation */}
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
