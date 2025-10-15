import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { formsDb } from "@/lib/database";

export function ResponseLimitSection({
  localSettings,
  updateResponseLimit,
  formId,
  schema,
}: {
  localSettings: any;
  updateResponseLimit: (updates: Partial<any>) => void;
  formId?: string;
  schema?: any;
}) {
  const [settings, setSettings] = useState({
    enabled: !!localSettings.responseLimit?.enabled,
    maxResponses: localSettings.responseLimit?.maxResponses || 100,
    message:
      localSettings.responseLimit?.message ||
      "This form is no longer accepting responses.",
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);

  const handleChange = (field: string, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
    setHasChanges(true);
  };

  const reset = () => {
    setSettings({
      enabled: !!localSettings.responseLimit?.enabled,
      maxResponses: localSettings.responseLimit?.maxResponses || 100,
      message:
        localSettings.responseLimit?.message ||
        "This form is no longer accepting responses.",
    });
    setHasChanges(false);
  };

  const save = async () => {
    if (!formId) {
      toast.error("Form ID is required to save settings");
      return;
    }
    setSaving(true);
    try {
      const newSchema = {
        ...schema,
        settings: {
          ...schema.settings,
          responseLimit: settings,
        },
      };
      await formsDb.updateForm(formId, { schema: newSchema as any });
      updateResponseLimit(settings);
      setSaved(true);
      setHasChanges(false);
      toast.success("Response limit saved successfully");

      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Error saving response limit:", error);
      toast.error("Failed to save response limit");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (sectionRef.current) {
      const firstInput = sectionRef.current.querySelector(
        "input, textarea"
      ) as HTMLElement;
      firstInput?.focus();
    }
  }, []);

  useEffect(() => {
    if (saved) {
      const announcement = document.createElement("div");
      announcement.setAttribute("aria-live", "polite");
      announcement.setAttribute("aria-atomic", "true");
      announcement.className = "sr-only";
      announcement.textContent = "Response limit saved successfully";
      document.body.appendChild(announcement);

      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }
  }, [saved]);

  return (
    <Card
      aria-labelledby="response-limit-title"
      className="shadow-none"
      ref={sectionRef}
      role="region"
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg" id="response-limit-title">
              Response Limit
            </CardTitle>
            <CardDescription>
              Stop accepting submissions after a set total count
            </CardDescription>
          </div>
          {hasChanges && (
            <Badge className="gap-2" variant="secondary">
              <div className="size-2 rounded-full bg-orange-500" />
              Unsaved changes
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <Label
              className="font-medium text-sm"
              htmlFor="response-limit-enabled"
            >
              Enable Response Limit
            </Label>
            <p className="text-muted-foreground text-xs">
              Limit the total number of submissions this form accepts
            </p>
          </div>
          <Switch
            aria-describedby="response-limit-enabled-description"
            checked={settings.enabled}
            id="response-limit-enabled"
            onCheckedChange={(checked) => handleChange("enabled", checked)}
          />
        </div>

        {settings.enabled && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <ResponseLimitField
                description="Maximum total responses allowed"
                id="max-responses"
                label="Max Responses"
                max={1_000_000}
                min={1}
                onChange={(value) => handleChange("maxResponses", value)}
                placeholder="100"
                required
                value={settings.maxResponses}
              />
            </div>

            <div
              aria-labelledby="response-limit-message-label"
              className="flex flex-col gap-2"
              role="group"
            >
              <Label
                className="font-medium text-sm"
                htmlFor="response-limit-message"
                id="response-limit-message-label"
              >
                Limit Reached Message
              </Label>
              <Textarea
                className="resize-none shadow-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                id="response-limit-message"
                onChange={(e) => handleChange("message", e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    (e.target as HTMLElement).blur();
                  }
                }}
                placeholder="This form is no longer accepting responses."
                rows={2}
                value={settings.message}
              />
              <p className="text-muted-foreground text-xs">
                Message shown once the limit is reached
              </p>
            </div>
          </div>
        )}

        {!settings.enabled && (
          <div className="rounded-lg bg-muted/30 p-4">
            <p className="text-muted-foreground text-sm">
              Limit the total number of responses this form can accept. Once the
              limit is reached, new submissions will be blocked.
            </p>
          </div>
        )}

        <div
          aria-label="Response limit actions"
          className="flex items-center justify-between"
          role="group"
        >
          <div className="flex items-center gap-2">
            {hasChanges && (
              <Button
                className="gap-2 text-muted-foreground hover:text-foreground"
                onClick={reset}
                size="sm"
                variant="ghost"
              >
                Reset
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              aria-label="Save response limit settings"
              disabled={saving || !hasChanges}
              loading={saving}
              onClick={save}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  save();
                }
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ResponseLimitField({
  id,
  label,
  value,
  min,
  max,
  placeholder,
  description,
  onChange,
  required = false,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  placeholder: string;
  description: string;
  onChange: (value: number) => void;
  required?: boolean;
}) {
  const fieldId = `${id}-field`;
  const descriptionId = `${id}-description`;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      (e.target as HTMLElement).blur();
    }
  };

  return (
    <div
      aria-labelledby={`${fieldId}-label`}
      className="flex flex-col gap-2"
      role="group"
    >
      <Label
        className="font-medium text-sm"
        htmlFor={fieldId}
        id={`${fieldId}-label`}
      >
        {label}
        {required && (
          <span aria-label="required" className="ml-1 text-destructive">
            *
          </span>
        )}
      </Label>
      <Input
        aria-describedby={descriptionId}
        aria-invalid={required && (!value || value < min || value > max)}
        aria-required={required}
        className="shadow-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
        id={fieldId}
        max={max}
        min={min}
        onChange={(e) => onChange(Number.parseInt(e.target.value) || min)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        required={required}
        type="number"
        value={value}
      />
      <p className="text-muted-foreground text-xs" id={descriptionId}>
        {description}
      </p>
      {required && (!value || value < min || value > max) && (
        <p className="text-destructive text-xs" role="alert">
          Please enter a valid value between {min} and {max}
        </p>
      )}
    </div>
  );
}
