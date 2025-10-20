import { Shield } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { formsDb } from "@/lib/database";

import type { BotProtectionSectionProps } from "../types";

export function BotProtectionSection({
  localSettings,
  updateBotProtection,
  formId,
  schema,
}: BotProtectionSectionProps) {
  const [botProtectionSettings, setBotProtectionSettings] = useState({
    enabled: localSettings.botProtection?.enabled,
    message: localSettings.botProtection?.message || "",
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const botProtectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () =>
      window.removeEventListener(
        "beforeunload",
        onBeforeUnload as unknown as EventListener
      );
  }, [hasChanges]);

  const handleBotProtectionChange = (field: string, value: any) => {
    setBotProtectionSettings((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
    setHasChanges(true);
  };

  const resetSettings = () => {
    setBotProtectionSettings({
      enabled: localSettings.botProtection?.enabled,
      message: localSettings.botProtection?.message || "",
    });
    setHasChanges(false);
  };

  const saveBotProtection = async () => {
    if (!formId) {
      toast.error("Form ID is required to save settings");
      return;
    }

    setSaving(true);
    try {
      const trimmed = {
        enabled: botProtectionSettings.enabled,
        message: (botProtectionSettings.message || "").trim(),
      };
      const newSchema = {
        ...schema,
        settings: {
          ...schema.settings,
          botProtection: trimmed,
        },
      };
      await formsDb.updateForm(formId, { schema: newSchema as any });
      updateBotProtection(trimmed);
      setSaved(true);
      setHasChanges(false);
      toast.success("Bot protection settings saved successfully");

      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Error saving bot protection:", error);
      toast.error("Failed to save bot protection settings");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (botProtectionRef.current) {
      const firstInput = botProtectionRef.current.querySelector(
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
      announcement.textContent = "Bot protection settings saved successfully";
      document.body.appendChild(announcement);

      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }
  }, [saved]);

  return (
    <div
      aria-label="Bot protection settings"
      className="flex flex-col gap-4"
      onKeyDown={(e) => {
        const target = e.target as HTMLElement;
        const isTextarea = target.tagName === "TEXTAREA";
        if (isTextarea && e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          saveBotProtection();
        }
      }}
      role="main"
      style={{
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent",
        overscrollBehavior: "contain",
      }}
    >
      <Card
        aria-labelledby="bot-protection-title"
        className="shadow-none"
        ref={botProtectionRef}
        role="region"
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle
                className="flex items-center gap-2 text-lg tracking-tight"
                id="bot-protection-title"
              >
                Bot Protection
              </CardTitle>
              <CardDescription id="bot-protection-description">
                Automatically detect and block automated submissions
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
                htmlFor="bot-protection-enabled"
              >
                Enable Bot Protection
              </Label>
              <p
                className="text-muted-foreground text-xs"
                id="bot-protection-enabled-description"
              >
                Automatically detect and block automated submissions
              </p>
            </div>
            <Switch
              aria-describedby="bot-protection-enabled-description"
              checked={botProtectionSettings.enabled}
              id="bot-protection-enabled"
              onCheckedChange={(checked) =>
                handleBotProtectionChange("enabled", checked)
              }
            />
          </div>

          {botProtectionSettings.enabled && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="font-medium text-sm" htmlFor="bot-message">
                    Bot Detection Message
                  </Label>
                  <Textarea
                    autoComplete="off"
                    className="resize-none shadow-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                    id="bot-message"
                    name="bot-message"
                    onChange={(e) =>
                      handleBotProtectionChange("message", e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        (e.target as HTMLElement).blur();
                      }
                    }}
                    placeholder="Enter a custom message to show when a bot is detected"
                    rows={2}
                    value={botProtectionSettings.message}
                  />
                  <p className="text-muted-foreground text-xs">
                    This message will be shown to users when bot activity is
                    detected
                  </p>
                </div>
              </div>

              <div
                aria-live="polite"
                className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/20"
                role="status"
              >
                <div className="flex items-center gap-3">
                  <Shield
                    aria-hidden="true"
                    className="size-4 text-blue-600 dark:text-blue-400"
                  />
                  <div className="flex flex-col gap-2">
                    <h4 className="font-medium text-blue-900 text-sm dark:text-blue-100">
                      Powered by Vercel BotID
                    </h4>
                    <p className="text-blue-700 text-xs dark:text-blue-300">
                      Uses advanced machine learning to detect and block
                      automated bots while allowing legitimate users through. No
                      CAPTCHAs required.
                    </p>
                  </div>
                </div>
              </div>

              <div
                aria-live="polite"
                className="rounded-lg border border-muted bg-muted/50 p-4"
                role="status"
              >
                <div className="flex flex-col gap-2">
                  <h4 className="font-medium text-foreground text-sm">
                    Current Configuration
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Bot protection is{" "}
                    <span className="font-semibold text-foreground">
                      enabled
                    </span>
                    . Automated submissions will be automatically detected and
                    blocked.
                  </p>
                </div>
              </div>
            </div>
          )}

          {!botProtectionSettings.enabled && (
            <div className="rounded-lg bg-muted/30 p-4">
              <p className="text-muted-foreground text-sm">
                Bot protection uses Vercel's BotID to automatically detect and
                block automated submissions while allowing legitimate users
                through. This helps prevent spam and abuse without requiring
                CAPTCHAs.
              </p>
            </div>
          )}

          <div
            aria-label="Bot protection actions"
            className="flex items-center justify-between"
            role="group"
          >
            <div className="flex items-center gap-2">
              {hasChanges && (
                <Button
                  className="min-h-10 gap-2 text-muted-foreground hover:text-foreground"
                  onClick={resetSettings}
                  size="sm"
                  variant="ghost"
                >
                  Reset
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                aria-describedby="bot-protection-description"
                aria-label="Save bot protection settings"
                className="min-h-10"
                disabled={saving || !hasChanges}
                loading={saving}
                onClick={saveBotProtection}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    saveBotProtection();
                  }
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
