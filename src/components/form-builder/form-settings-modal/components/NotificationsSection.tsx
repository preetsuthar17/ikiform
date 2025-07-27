import { Bell } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { LocalSettings, NotificationSettings } from '../types';

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
  const [newLink, setNewLink] = useState({ label: '', url: '' });

  const handleAddLink = () => {
    if (newLink.label && newLink.url) {
      updateNotifications({ customLinks: [...customLinks, newLink] });
      setNewLink({ label: '', url: '' });
    }
  };

  const handleRemoveLink = (idx: number) => {
    const updated = customLinks.filter((_, i) => i !== idx);
    updateNotifications({ customLinks: updated });
  };

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center gap-3">
        <Bell className="h-5 w-5 text-primary" />
        <h3 className="font-medium text-lg">Notifications</h3>
      </div>
      <div className="flex flex-col gap-4 border-muted border-l-2 pl-6">
        <div className="flex items-center gap-3">
          <Switch
            checked={!!notifications.enabled}
            id="notifications-enabled"
            onCheckedChange={(checked) =>
              updateNotifications({ enabled: checked })
            }
            size={'sm'}
          />
          <Label
            className="cursor-pointer select-none"
            htmlFor="notifications-enabled"
          >
            Enable email notifications for new submissions
          </Label>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="notification-email">Notification Email</Label>
          <Input
            disabled={!notifications.enabled}
            id="notification-email"
            onChange={(e) => updateNotifications({ email: e.target.value })}
            placeholder="owner@email.com"
            type="email"
            value={notifications.email || ''}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="notification-subject">Email Subject</Label>
          <Input
            disabled={!notifications.enabled}
            id="notification-subject"
            onChange={(e) => updateNotifications({ subject: e.target.value })}
            placeholder="New Form Submission"
            value={notifications.subject || 'New Form Submission'}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="notification-message">Email Message</Label>
          <Textarea
            disabled={!notifications.enabled}
            id="notification-message"
            onChange={(e) => updateNotifications({ message: e.target.value })}
            placeholder="You have received a new submission on your form."
            rows={3}
            value={
              notifications.message ||
              'You have received a new submission on your form.'
            }
          />
        </div>
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
                    updateNotifications({ customLinks: updated });
                  }}
                  placeholder="Label"
                  value={link.label}
                />
                <Input
                  disabled={!notifications.enabled}
                  onChange={(e) => {
                    const updated = [...customLinks];
                    updated[idx] = { ...updated[idx], url: e.target.value };
                    updateNotifications({ customLinks: updated });
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
          <div className="mt-2 flex gap-2">
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
              size="sm"
              type="button"
            >
              Add
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
