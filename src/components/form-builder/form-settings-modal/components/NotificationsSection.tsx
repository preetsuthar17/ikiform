import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import type { LocalSettings, NotificationSettings } from "../types";
import { Bell } from "lucide-react";

interface NotificationsSectionProps {
  localSettings: LocalSettings;
  updateNotifications: (updates: Partial<NotificationSettings>) => void;
}

export function NotificationsSection({
  localSettings,
  updateNotifications,
}: NotificationsSectionProps) {
  const notifications = localSettings.notifications || {};
  const customLinks = notifications.customLinks || [];
  const [newLink, setNewLink] = useState({ label: "", url: "" });

  const handleAddLink = () => {
    if (newLink.label && newLink.url) {
      updateNotifications({ customLinks: [...customLinks, newLink] });
      setNewLink({ label: "", url: "" });
    }
  };

  const handleRemoveLink = (idx: number) => {
    const updated = customLinks.filter((_, i) => i !== idx);
    updateNotifications({ customLinks: updated });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Bell className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-medium">Notifications</h3>
      </div>
      <div className="flex flex-col gap-4 border-l-2 border-muted pl-6">
        <div className="flex items-center gap-3">
          <Switch
            size={"sm"}
            id="notifications-enabled"
            checked={!!notifications.enabled}
            onCheckedChange={(checked) =>
              updateNotifications({ enabled: checked })
            }
          />
          <Label
            htmlFor="notifications-enabled"
            className="cursor-pointer select-none"
          >
            Enable email notifications for new submissions
          </Label>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="notification-email">Notification Email</Label>
          <Input
            id="notification-email"
            type="email"
            value={notifications.email || ""}
            onChange={(e) => updateNotifications({ email: e.target.value })}
            placeholder="owner@email.com"
            disabled={!notifications.enabled}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="notification-subject">Email Subject</Label>
          <Input
            id="notification-subject"
            value={notifications.subject || "New Form Submission"}
            onChange={(e) => updateNotifications({ subject: e.target.value })}
            placeholder="New Form Submission"
            disabled={!notifications.enabled}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="notification-message">Email Message</Label>
          <Textarea
            id="notification-message"
            value={
              notifications.message ||
              "You have received a new submission on your form."
            }
            onChange={(e) => updateNotifications({ message: e.target.value })}
            placeholder="You have received a new submission on your form."
            rows={3}
            disabled={!notifications.enabled}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Custom Links</Label>
          <div className="flex flex-col gap-2">
            {customLinks.map((link, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Input
                  value={link.label}
                  onChange={(e) => {
                    const updated = [...customLinks];
                    updated[idx] = { ...updated[idx], label: e.target.value };
                    updateNotifications({ customLinks: updated });
                  }}
                  placeholder="Label"
                  disabled={!notifications.enabled}
                />
                <Input
                  value={link.url}
                  onChange={(e) => {
                    const updated = [...customLinks];
                    updated[idx] = { ...updated[idx], url: e.target.value };
                    updateNotifications({ customLinks: updated });
                  }}
                  placeholder="https://example.com"
                  disabled={!notifications.enabled}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => handleRemoveLink(idx)}
                  disabled={!notifications.enabled}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <Input
              value={newLink.label}
              onChange={(e) =>
                setNewLink((l) => ({ ...l, label: e.target.value }))
              }
              placeholder="Label"
              disabled={!notifications.enabled}
            />
            <Input
              value={newLink.url}
              onChange={(e) =>
                setNewLink((l) => ({ ...l, url: e.target.value }))
              }
              placeholder="https://example.com"
              disabled={!notifications.enabled}
            />
            <Button
              type="button"
              size="sm"
              onClick={handleAddLink}
              disabled={!notifications.enabled}
            >
              Add
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
