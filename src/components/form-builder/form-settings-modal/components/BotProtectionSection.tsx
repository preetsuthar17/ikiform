import { Shield } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import type { BotProtectionSectionProps } from "../types";

export function BotProtectionSection({
  localSettings,
  updateBotProtection,
}: BotProtectionSectionProps) {
  const botProtection = localSettings.botProtection || {};

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center gap-3">
        <Shield className="h-5 w-5 text-primary" />
        <h3 className="font-medium text-lg">Bot Protection</h3>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Switch
            checked={botProtection.enabled}
            id="bot-protection-enabled"
            onCheckedChange={(checked) =>
              updateBotProtection({ enabled: checked })
            }
            size="sm"
          />
          <Label
            className="font-medium text-sm"
            htmlFor="bot-protection-enabled"
          >
            Enable Bot Protection
          </Label>
        </div>

        {botProtection.enabled ? (
          <div className="flex flex-col gap-4 border-muted border-l-2 pl-6">
            <div className="flex flex-col gap-2">
              <Label className="font-medium text-sm" htmlFor="bot-message">
                Bot Detection Message
              </Label>
              <Textarea
                className="text-sm"
                id="bot-message"
                onChange={(e) =>
                  updateBotProtection({ message: e.target.value })
                }
                placeholder="Enter a custom message to show when a bot is detected"
                rows={2}
                value={botProtection.message || ""}
              />
              <p className="text-muted-foreground text-xs">
                This message will be shown to users when bot activity is
                detected.
              </p>
            </div>

            <div className="rounded-2xl bg-blue-50 p-4 dark:bg-blue-950/20">
              <div className="flex items-start gap-3">
                <Shield className="mt-0.5 h-4 w-4 text-blue-600 dark:text-blue-400" />
                <div className="flex flex-col gap-1">
                  <p className="font-medium text-blue-900 text-sm dark:text-blue-100">
                    Powered by Vercel BotID
                  </p>
                  <p className="text-blue-700 text-xs dark:text-blue-300">
                    Uses advanced machine learning to detect and block automated
                    bots while allowing legitimate users through. No CAPTCHAs
                    required.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-muted/30 p-4">
            <p className="text-muted-foreground text-sm">
              Bot protection uses Vercel's BotID to automatically detect and
              block automated submissions while allowing legitimate users
              through. This helps prevent spam and abuse without requiring
              CAPTCHAs.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
