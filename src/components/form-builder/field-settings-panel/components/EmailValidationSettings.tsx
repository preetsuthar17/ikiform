// External imports
import React, { useState } from "react";

// Component imports
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

// Type imports
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
    <Card className="p-4 bg-background flex flex-col gap-4 rounded-card">
      <h3 className="font-medium text-card-foreground">Email Validation</h3>

      <div className="flex flex-col gap-4">
        {/* Auto-complete Domain */}
        <div className="flex flex-col gap-2">
          <Label className="text-card-foreground">Auto-complete Domain</Label>
          <div className="flex gap-2">
            <Input
              placeholder="e.g., business.com"
              value={newAutoCompleteDomain}
              onChange={(e) => setNewAutoCompleteDomain(e.target.value)}
              className="bg-input border-border"
            />
            <Button
              size="sm"
              onClick={setAutoCompleteDomain}
              disabled={!newAutoCompleteDomain.trim()}
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
                size="sm"
                variant="ghost"
                onClick={removeAutoCompleteDomain}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Users can enter just their username and the domain will be
            auto-completed
          </p>
        </div>

        {/* Allowed Domains */}
        <div className="flex flex-col gap-2">
          <Label className="text-card-foreground">Allowed Domains</Label>
          <div className="flex gap-2">
            <Input
              placeholder="e.g., company.com"
              value={newAllowedDomain}
              onChange={(e) => setNewAllowedDomain(e.target.value)}
              className="bg-input border-border"
            />
            <Button
              size="sm"
              onClick={addAllowedDomain}
              disabled={!newAllowedDomain.trim()}
            >
              Add
            </Button>
          </div>
          {emailSettings?.allowedDomains &&
            emailSettings.allowedDomains.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {emailSettings.allowedDomains.map((domain, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    @{domain}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeAllowedDomain(domain)}
                      className="h-4 w-4 p-0 hover:bg-transparent"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          <p className="text-xs text-muted-foreground">
            Only emails from these domains will be accepted
          </p>
        </div>

        {/* Blocked Domains */}
        <div className="flex flex-col gap-2">
          <Label className="text-card-foreground">Blocked Domains</Label>
          <div className="flex gap-2">
            <Input
              placeholder="e.g., temp-mail.org"
              value={newBlockedDomain}
              onChange={(e) => setNewBlockedDomain(e.target.value)}
              className="bg-input border-border"
            />
            <Button
              size="sm"
              onClick={addBlockedDomain}
              disabled={!newBlockedDomain.trim()}
            >
              Add
            </Button>
          </div>
          {emailSettings.blockedDomains?.length && (
            <div className="flex flex-wrap gap-1">
              {emailSettings.blockedDomains.map((domain, index) => (
                <Badge
                  key={index}
                  variant="destructive"
                  className="flex items-center gap-1"
                >
                  @{domain}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeBlockedDomain(domain)}
                    className="h-4 w-4 p-0 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Emails from these domains will be rejected (temporary email services
            are blocked by default)
          </p>
        </div>

        {/* Business Email Requirement */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <Label className="text-card-foreground">
              Require Business Email
            </Label>
            <p className="text-xs text-muted-foreground">
              Only allow business domains (blocks Gmail, Yahoo, etc.)
            </p>
          </div>
          <Switch
            size={"sm"}
            checked={emailSettings.requireBusinessEmail || false}
            onCheckedChange={(checked) =>
              updateEmailSettings({ requireBusinessEmail: checked })
            }
          />
        </div>

        {/* Custom Validation Message */}
        <div className="flex flex-col gap-2">
          <Label className="text-card-foreground">
            Custom Validation Message
          </Label>
          <Input
            placeholder="Custom error message for email validation"
            value={emailSettings.customValidationMessage || ""}
            onChange={(e) =>
              updateEmailSettings({
                customValidationMessage: e.target.value || undefined,
              })
            }
            className="bg-input border-border"
          />
          <p className="text-xs text-muted-foreground">
            Leave empty to use default messages
          </p>
        </div>
      </div>
    </Card>
  );
}
