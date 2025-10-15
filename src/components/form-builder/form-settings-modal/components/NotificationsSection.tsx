import { useEffect, useState } from "react";
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
import type { LocalSettings, NotificationSettings } from "../types";

interface NotificationsSectionProps {
  localSettings: LocalSettings;
  updateNotifications: (updates: Partial<NotificationSettings>) => void;
  formId?: string;
  schema?: any;
}

export function NotificationsSection({
  localSettings,
  updateNotifications,
  formId,
  schema,
}: NotificationsSectionProps) {
  const notifications = localSettings.notifications || {};
  const customLinks = notifications.customLinks || [];
  const [newLink, setNewLink] = useState({ label: "", url: "" });
  const [hasChanges, setHasChanges] = useState(false as boolean);
  const [saving, setSaving] = useState(false as boolean);
  const [saved, setSaved] = useState(false as boolean);

  const wrappedUpdate = (updates: Partial<NotificationSettings>) => {
    updateNotifications(updates);
    setHasChanges(true);
    setSaved(false);
  };

  const handleAddLink = () => {
    if (newLink.label && newLink.url) {
      wrappedUpdate({ customLinks: [...customLinks, newLink] });
      setNewLink({ label: "", url: "" });
    }
  };

  const handleRemoveLink = (idx: number) => {
    const updated = customLinks.filter((_, i) => i !== idx);
    wrappedUpdate({ customLinks: updated });
  };

  const resetNotifications = () => {
    const original = (schema?.settings as any)?.notifications || {};
    updateNotifications(original);
    setHasChanges(false);
  };

  const saveNotifications = async () => {
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
          notifications: {
            ...localSettings.notifications,
          },
        },
      };
      await formsDb.updateForm(formId, { schema: newSchema as any });
      setSaved(true);
      setHasChanges(false);
      toast.success("Notification settings saved successfully");
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error(e);
      toast.error("Failed to save notification settings");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (saved) {
      const announcement = document.createElement("div");
      announcement.setAttribute("aria-live", "polite");
      announcement.setAttribute("aria-atomic", "true");
      announcement.className = "sr-only";
      announcement.textContent = "Notification settings saved successfully";
      document.body.appendChild(announcement);
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }
  }, [saved]);

  return (
    <Card
      aria-labelledby="notifications-title"
      className="shadow-none"
      role="region"
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle
              className="flex items-center gap-2 text-lg tracking-tight"
              id="notifications-title"
            >
              Notifications
            </CardTitle>
            <CardDescription id="notifications-description">
              Configure email alerts for new form submissions
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
              htmlFor="notifications-enabled"
            >
              Email Notifications
            </Label>
            <p className="text-muted-foreground text-xs">
              Enable email notifications for new submissions
            </p>
          </div>
          <Switch
            checked={!!notifications.enabled}
            id="notifications-enabled"
            onCheckedChange={(checked) => wrappedUpdate({ enabled: checked })}
          />
        </div>
        {notifications.enabled && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="notification-email">Notification Email</Label>
            <Input
              disabled={!notifications.enabled}
              id="notification-email"
              onChange={(e) => wrappedUpdate({ email: e.target.value })}
              placeholder="owner@email.com"
              type="email"
              value={notifications.email || ""}
            />
          </div>
        )}
        {notifications.enabled && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="notification-subject">Email Subject</Label>
            <Input
              disabled={!notifications.enabled}
              id="notification-subject"
              onChange={(e) => wrappedUpdate({ subject: e.target.value })}
              placeholder="New Form Submission"
              value={notifications.subject || "New Form Submission"}
            />
          </div>
        )}
        {notifications.enabled && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="notification-message">Email Message</Label>
            <Textarea
              disabled={!notifications.enabled}
              id="notification-message"
              onChange={(e) => wrappedUpdate({ message: e.target.value })}
              placeholder="You have received a new submission on your form."
              rows={3}
              value={
                notifications.message ||
                "You have received a new submission on your form."
              }
            />
          </div>
        )}
        {notifications.enabled && (
          <div className="flex flex-col gap-2">
            <Label>Custom Links</Label>
            <div className="flex flex-col gap-2">
              {customLinks.map((link, idx) => (
                <div className="flex items-center gap-2" key={idx}>
                  <Input
                    disabled={!notifications.enabled}
                    onChange={(e) => {
                      const updated = [...customLinks];
                      updated[idx] = { ...updated[idx], label: e.target.value };
                      wrappedUpdate({ customLinks: updated });
                    }}
                    placeholder="Label"
                    value={link.label}
                  />
                  <Input
                    disabled={!notifications.enabled}
                    onChange={(e) => {
                      const updated = [...customLinks];
                      updated[idx] = { ...updated[idx], url: e.target.value };
                      wrappedUpdate({ customLinks: updated });
                    }}
                    placeholder="https://example.com"
                    value={link.url}
                  />
                  <Button
                    disabled={!notifications.enabled}
                    onClick={() => handleRemoveLink(idx)}
                    size="sm"
                    type="button"
                    variant="destructive"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                disabled={!notifications.enabled}
                onChange={(e) =>
                  setNewLink((l) => ({ ...l, label: e.target.value }))
                }
                placeholder="Label"
                value={newLink.label}
              />
              <Input
                disabled={!notifications.enabled}
                onChange={(e) =>
                  setNewLink((l) => ({ ...l, url: e.target.value }))
                }
                placeholder="https://example.com"
                value={newLink.url}
              />
              <Button
                disabled={!notifications.enabled}
                onClick={handleAddLink}
                type="button"
              >
                Add
              </Button>
            </div>
          </div>
        )}

        <div
          aria-label="Notification settings actions"
          className="flex items-center justify-between"
          role="group"
        >
          <div className="flex items-center gap-2">
            {hasChanges && (
              <Button
                className="gap-2 text-muted-foreground hover:text-foreground"
                onClick={resetNotifications}
                size="sm"
                variant="ghost"
              >
                Reset
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              aria-describedby="notifications-description"
              aria-label="Save notification settings"
              disabled={saving || !hasChanges}
              loading={saving}
              onClick={saveNotifications}
            >
              Save
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
