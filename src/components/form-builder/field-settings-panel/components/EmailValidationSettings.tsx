import { X } from "lucide-react";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import type { FormField } from "@/lib/database";

interface EmailValidationSettingsProps {
  field: FormField;
  onUpdateSettings: (settings: any) => void;
}

export function EmailValidationSettings({
  field,
  onUpdateSettings,
}: EmailValidationSettingsProps) {
  const [newAllowedDomain, setNewAllowedDomain] = useState("");
  const [newBlockedDomain, setNewBlockedDomain] = useState("");
  const [newAutoCompleteDomain, setNewAutoCompleteDomain] = useState("");

  const emailSettings = field.settings?.emailValidation || {};

  const updateEmailSettings = (updates: any) => {
    onUpdateSettings({
      ...field.settings,
      emailValidation: {
        ...emailSettings,
        ...updates,
      },
    });
  };

  const addAllowedDomain = () => {
    if (newAllowedDomain.trim()) {
      const domains = [
        ...(emailSettings.allowedDomains || []),
        newAllowedDomain.trim(),
      ];
      updateEmailSettings({ allowedDomains: domains });
      setNewAllowedDomain("");
    }
  };

  const removeAllowedDomain = (domain: string) => {
    const domains = (emailSettings.allowedDomains || []).filter(
      (d) => d !== domain,
    );
    updateEmailSettings({ allowedDomains: domains });
  };

  const addBlockedDomain = () => {
    if (newBlockedDomain.trim()) {
      const domains = [
        ...(emailSettings.blockedDomains || []),
        newBlockedDomain.trim(),
      ];
      updateEmailSettings({ blockedDomains: domains });
      setNewBlockedDomain("");
    }
  };

  const removeBlockedDomain = (domain: string) => {
    const domains = (emailSettings.blockedDomains || []).filter(
      (d) => d !== domain,
    );
    updateEmailSettings({ blockedDomains: domains });
  };

  const setAutoCompleteDomain = () => {
    if (newAutoCompleteDomain.trim()) {
      updateEmailSettings({ autoCompleteDomain: newAutoCompleteDomain.trim() });
      setNewAutoCompleteDomain("");
    }
  };

  const removeAutoCompleteDomain = () => {
    updateEmailSettings({ autoCompleteDomain: undefined });
  };

  return (
    <Card className="flex flex-col gap-4 rounded-card bg-background p-4">
      <h3 className="font-medium text-card-foreground">Email Validation</h3>

      <div className="flex flex-col gap-4">
        {}
        <div className="flex flex-col gap-2">
          <Label className="text-card-foreground">Auto-complete Domain</Label>
          <div className="flex gap-2">
            <Input
              className="border-border bg-input"
              onChange={(e) => setNewAutoCompleteDomain(e.target.value)}
              placeholder="e.g., business.com"
              value={newAutoCompleteDomain}
            />
            <Button
              disabled={!newAutoCompleteDomain.trim()}
              onClick={setAutoCompleteDomain}
              size="sm"
            >
              Set
            </Button>
          </div>
          {emailSettings.autoCompleteDomain && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                @{emailSettings.autoCompleteDomain}
              </Badge>
              <Button
                className="h-6 w-6 p-0"
                onClick={removeAutoCompleteDomain}
                size="sm"
                variant="ghost"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          <p className="text-muted-foreground text-xs">
            Users can enter just their username and the domain will be
            auto-completed
          </p>
        </div>

        {}
        <div className="flex flex-col gap-2">
          <Label className="text-card-foreground">Allowed Domains</Label>
          <div className="flex gap-2">
            <Input
              className="border-border bg-input"
              onChange={(e) => setNewAllowedDomain(e.target.value)}
              placeholder="e.g., company.com"
              value={newAllowedDomain}
            />
            <Button
              disabled={!newAllowedDomain.trim()}
              onClick={addAllowedDomain}
              size="sm"
            >
              Add
            </Button>
          </div>
          {emailSettings?.allowedDomains &&
            emailSettings.allowedDomains.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {emailSettings.allowedDomains.map((domain, index) => (
                  <Badge
                    className="flex items-center gap-1"
                    key={index}
                    variant="outline"
                  >
                    @{domain}
                    <Button
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => removeAllowedDomain(domain)}
                      size="sm"
                      variant="ghost"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          <p className="text-muted-foreground text-xs">
            Only emails from these domains will be accepted
          </p>
        </div>

        {}
        <div className="flex flex-col gap-2">
          <Label className="text-card-foreground">Blocked Domains</Label>
          <div className="flex gap-2">
            <Input
              className="border-border bg-input"
              onChange={(e) => setNewBlockedDomain(e.target.value)}
              placeholder="e.g., temp-mail.org"
              value={newBlockedDomain}
            />
            <Button
              disabled={!newBlockedDomain.trim()}
              onClick={addBlockedDomain}
              size="sm"
            >
              Add
            </Button>
          </div>
          {emailSettings.blockedDomains?.length && (
            <div className="flex flex-wrap gap-1">
              {emailSettings.blockedDomains.map((domain, index) => (
                <Badge
                  className="flex items-center gap-1"
                  key={index}
                  variant="destructive"
                >
                  @{domain}
                  <Button
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => removeBlockedDomain(domain)}
                    size="sm"
                    variant="ghost"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
          <p className="text-muted-foreground text-xs">
            Emails from these domains will be rejected (temporary email services
            are blocked by default)
          </p>
        </div>

        {}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <Label className="text-card-foreground">
              Require Business Email
            </Label>
            <p className="text-muted-foreground text-xs">
              Only allow business domains (blocks Gmail, Yahoo, etc.)
            </p>
          </div>
          <Switch
            checked={emailSettings.requireBusinessEmail}
            onCheckedChange={(checked) =>
              updateEmailSettings({ requireBusinessEmail: checked })
            }
            size={"sm"}
          />
        </div>

        {}
        <div className="flex flex-col gap-2">
          <Label className="text-card-foreground">
            Custom Validation Message
          </Label>
          <Input
            className="border-border bg-input"
            onChange={(e) =>
              updateEmailSettings({
                customValidationMessage: e.target.value || undefined,
              })
            }
            placeholder="Custom error message for email validation"
            value={emailSettings.customValidationMessage || ""}
          />
          <p className="text-muted-foreground text-xs">
            Leave empty to use default messages
          </p>
        </div>
      </div>
    </Card>
  );
}
