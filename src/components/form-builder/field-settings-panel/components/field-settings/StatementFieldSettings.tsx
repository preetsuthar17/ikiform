import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { FieldSettingsProps } from "./types";

export function StatementFieldSettings({
  field,
  onUpdateSettings,
  onFieldUpdate,
}: FieldSettingsProps) {
  const updateStatementHeading = (heading: string) => {
    onUpdateSettings({ statementHeading: heading });
  };

  const updateStatementDescription = (description: string) => {
    onUpdateSettings({ statementDescription: description });
  };

  const updateStatementAlign = (align: "left" | "center" | "right") => {
    onUpdateSettings({ statementAlign: align });
  };

  const updateStatementSize = (size: "sm" | "md" | "lg") => {
    onUpdateSettings({ statementSize: size });
  };

  return (
    <Card className="gap-2 p-4 shadow-none">
      <CardHeader className="p-0">
        <CardTitle className="text-lg">Statement Field Settings</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-0">
        <div className="flex flex-col gap-2">
          <Label className="font-medium text-sm" htmlFor="statement-heading">
            Heading
          </Label>
          <Textarea
            aria-describedby="statement-heading-help"
            className="resize-none"
            id="statement-heading"
            name="statement-heading"
            onChange={(e) => updateStatementHeading(e.target.value.trim())}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.currentTarget.blur();
              } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                e.currentTarget.blur();
              }
            }}
            placeholder="Enter statement heading"
            rows={2}
            value={field.settings?.statementHeading || ""}
          />
          <p
            className="text-muted-foreground text-xs"
            id="statement-heading-help"
          >
            Main heading for the statement
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label
            className="font-medium text-sm"
            htmlFor="statement-description"
          >
            Description
          </Label>
          <Textarea
            aria-describedby="statement-description-help"
            className="resize-none"
            id="statement-description"
            name="statement-description"
            onChange={(e) => updateStatementDescription(e.target.value.trim())}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.currentTarget.blur();
              } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                e.currentTarget.blur();
              }
            }}
            placeholder="Enter statement description"
            rows={3}
            value={field.settings?.statementDescription || ""}
          />
          <p
            className="text-muted-foreground text-xs"
            id="statement-description-help"
          >
            Detailed description for the statement
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="font-medium text-sm" htmlFor="statement-align">
            Alignment
          </Label>
          <Select
            onValueChange={updateStatementAlign}
            value={field.settings?.statementAlign || "left"}
          >
            <SelectTrigger className="w-full" id="statement-align">
              <SelectValue placeholder="Select alignment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
          <p
            className="text-muted-foreground text-xs"
            id="statement-align-help"
          >
            Text alignment for the statement
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="font-medium text-sm" htmlFor="statement-size">
            Size
          </Label>
          <Select
            onValueChange={updateStatementSize}
            value={field.settings?.statementSize || "md"}
          >
            <SelectTrigger className="w-full" id="statement-size">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sm">Small</SelectItem>
              <SelectItem value="md">Medium</SelectItem>
              <SelectItem value="lg">Large</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-muted-foreground text-xs" id="statement-size-help">
            Font size for the statement
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
