import { Plus, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      (d) => d !== domain
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
      (d) => d !== domain
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

  const renderBadgeWithRemove = ({
    domain,
    key,
    variant = "outline",
    onRemove,
  }: {
    domain: string;
    key: React.Key;
    variant?: "outline" | "destructive";
    onRemove: () => void;
  }) => (
    <div className="flex items-center gap-2" key={key}>
      <Badge
        className={
          variant === "outline"
            ? "flex h-6 items-center gap-0 rounded-full pr-0 pl-3"
            : "flex h-6 items-center gap-0 rounded-full bg-destructive/10 pr-0 pl-3 text-destructive"
        }
        variant={variant}
      >
        @{domain}
        <Button
          aria-label={`Remove ${domain}${variant === "destructive" ? " from blocked domains" : " from allowed domains"}`}
          className="ml-1 size-6 rounded-none p-0"
          onClick={onRemove}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onRemove();
            }
          }}
          size="icon-sm"
          variant={variant === "outline" ? "secondary" : "destructive"}
        >
          <X aria-hidden="true" className="size-3" />
        </Button>
      </Badge>
    </div>
  );

  return (
    <Card className="gap-2 p-4 shadow-none">
      <CardHeader className="p-0">
        <CardTitle className="text-lg">Email Validation</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-0">
        {}
        <div className="flex flex-col gap-2">
          <Label className="font-medium text-sm" htmlFor="auto-complete-domain">
            Auto-complete Domain
          </Label>
          <div className="flex gap-2">
            <Input
              aria-describedby="auto-complete-domain-help"
              autoComplete="off"
              id="auto-complete-domain"
              name="auto-complete-domain"
              onChange={(e) => setNewAutoCompleteDomain(e.target.value.trim())}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  e.currentTarget.blur();
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  setAutoCompleteDomain();
                }
              }}
              placeholder="e.g., business.com"
              type="text"
              value={newAutoCompleteDomain}
            />
            <Button
              aria-label="Set auto-complete domain"
              className=""
              disabled={!newAutoCompleteDomain.trim()}
              onClick={setAutoCompleteDomain}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setAutoCompleteDomain();
                }
              }}
            >
              Set
            </Button>
          </div>
          {emailSettings.autoCompleteDomain && (
            <div className="flex items-center gap-2">
              <Badge
                className="flex h-6 items-center gap-0 rounded-full pr-0 pl-3"
                variant="secondary"
              >
                @{emailSettings.autoCompleteDomain}
                <Button
                  aria-label={`Remove ${emailSettings.autoCompleteDomain} domain`}
                  className="ml-1 size-6 p-0"
                  onClick={removeAutoCompleteDomain}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      removeAutoCompleteDomain();
                    }
                  }}
                  size="icon-sm"
                  variant="secondary"
                >
                  <X aria-hidden="true" className="size-3" />
                </Button>
              </Badge>
            </div>
          )}
          <p
            className="text-muted-foreground text-xs"
            id="auto-complete-domain-help"
          >
            Users can enter just their username and the domain will be
            auto-completed
          </p>
        </div>

        {}
        <div className="flex flex-col gap-2">
          <Label className="font-medium text-sm" htmlFor="allowed-domains">
            Allowed Domains
          </Label>
          <div className="flex gap-2">
            <Input
              aria-describedby="allowed-domains-help"
              autoComplete="off"
              id="allowed-domains"
              name="allowed-domains"
              onChange={(e) => setNewAllowedDomain(e.target.value.trim())}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  e.currentTarget.blur();
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  addAllowedDomain();
                }
              }}
              placeholder="e.g., company.com"
              type="text"
              value={newAllowedDomain}
            />
            <Button
              aria-label="Add allowed domain"
              className=""
              disabled={!newAllowedDomain.trim()}
              onClick={addAllowedDomain}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  addAllowedDomain();
                }
              }}
              size="icon"
            >
              <Plus aria-hidden="true" className="size-4" />
            </Button>
          </div>
          {emailSettings?.allowedDomains &&
            emailSettings.allowedDomains.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {emailSettings.allowedDomains.map((domain, index) =>
                  renderBadgeWithRemove({
                    domain,
                    key: index,
                    variant: "outline",
                    onRemove: () => removeAllowedDomain(domain),
                  })
                )}
              </div>
            )}
          <p
            className="text-muted-foreground text-xs"
            id="allowed-domains-help"
          >
            Only emails from these domains will be accepted
          </p>
        </div>

        {}
        <div className="flex flex-col gap-2">
          <Label className="font-medium text-sm" htmlFor="blocked-domains">
            Blocked Domains
          </Label>
          <div className="flex gap-2">
            <Input
              aria-describedby="blocked-domains-help"
              autoComplete="off"
              id="blocked-domains"
              name="blocked-domains"
              onChange={(e) => setNewBlockedDomain(e.target.value.trim())}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  e.currentTarget.blur();
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  addBlockedDomain();
                }
              }}
              placeholder="e.g., temp-mail.org"
              type="text"
              value={newBlockedDomain}
            />
            <Button
              aria-label="Add blocked domain"
              className=""
              disabled={!newBlockedDomain.trim()}
              onClick={addBlockedDomain}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  addBlockedDomain();
                }
              }}
              size="icon"
            >
              <Plus aria-hidden="true" className="size-4" />
            </Button>
          </div>
          {emailSettings.blockedDomains?.length && (
            <div className="flex flex-wrap gap-1">
              {emailSettings.blockedDomains.map((domain, index) =>
                renderBadgeWithRemove({
                  domain,
                  key: index,
                  variant: "destructive",
                  onRemove: () => removeBlockedDomain(domain),
                })
              )}
            </div>
          )}
          <p
            className="text-muted-foreground text-xs"
            id="blocked-domains-help"
          >
            Emails from these domains will be rejected (temporary email services
            are blocked by default)
          </p>
        </div>

        {}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <Label
              className="font-medium text-sm"
              htmlFor="require-business-email"
            >
              Require Business Email
            </Label>
            <p className="text-muted-foreground text-xs">
              Only allow business domains (blocks Gmail, Yahoo, etc.)
            </p>
          </div>
          <Switch
            aria-describedby="require-business-email-help"
            checked={emailSettings.requireBusinessEmail}
            id="require-business-email"
            name="require-business-email"
            onCheckedChange={(checked) =>
              updateEmailSettings({ requireBusinessEmail: checked })
            }
          />
        </div>

        {}
        <div className="flex flex-col gap-2">
          <Label
            className="font-medium text-sm"
            htmlFor="custom-validation-message"
          >
            Custom Validation Message
          </Label>
          <Input
            aria-describedby="custom-validation-message-help"
            autoComplete="off"
            id="custom-validation-message"
            name="custom-validation-message"
            onChange={(e) =>
              updateEmailSettings({
                customValidationMessage: e.target.value.trim() || undefined,
              })
            }
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.currentTarget.blur();
              }
            }}
            placeholder="Custom error message for email validation"
            type="text"
            value={emailSettings.customValidationMessage || ""}
          />
          <p
            className="text-muted-foreground text-xs"
            id="custom-validation-message-help"
          >
            Leave empty to use default messages
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
