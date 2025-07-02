"use client";

import React, { useState } from "react";
import { Modal, ModalContent } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings, Save } from "lucide-react";
import type { FormSchema } from "@/lib/database.types";

interface FormSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  schema: FormSchema;
  onSchemaUpdate: (updates: Partial<FormSchema>) => void;
}

export function FormSettingsModal({
  isOpen,
  onClose,
  schema,
  onSchemaUpdate,
}: FormSettingsModalProps) {
  const [localSettings, setLocalSettings] = useState(schema.settings);

  const updateSettings = (updates: Partial<typeof schema.settings>) => {
    const newSettings = { ...localSettings, ...updates };
    setLocalSettings(newSettings);
  };

  const handleSave = () => {
    onSchemaUpdate({ settings: localSettings });
    onClose();
  };

  const handleCancel = () => {
    setLocalSettings(schema.settings);
    onClose();
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="max-w-4xl max-h-[90vh]">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Form Settings</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1 px-6 pb-6">
            <div className="mt-6 space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Basic Information</h3>
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="form-title">Form Title</Label>
                    <Input
                      id="form-title"
                      value={localSettings.title}
                      onChange={(e) =>
                        updateSettings({ title: e.target.value })
                      }
                      placeholder="Enter form title"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="form-description">Form Description</Label>
                    <Textarea
                      id="form-description"
                      value={localSettings.description || ""}
                      onChange={(e) =>
                        updateSettings({ description: e.target.value })
                      }
                      placeholder="Enter form description"
                      rows={3}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="submit-text">Submit Button Text</Label>
                    <Input
                      id="submit-text"
                      value={localSettings.submitText || "Submit"}
                      onChange={(e) =>
                        updateSettings({ submitText: e.target.value })
                      }
                      placeholder="Submit"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="success-message">Success Message</Label>
                    <Textarea
                      id="success-message"
                      value={localSettings.successMessage || ""}
                      onChange={(e) =>
                        updateSettings({ successMessage: e.target.value })
                      }
                      placeholder="Thank you for your submission!"
                      rows={2}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="redirect-url">
                      Redirect URL (optional)
                    </Label>
                    <Input
                      id="redirect-url"
                      value={localSettings.redirectUrl || ""}
                      onChange={(e) =>
                        updateSettings({ redirectUrl: e.target.value })
                      }
                      placeholder="https://example.com/thank-you"
                    />
                  </div>
                </div>
              </Card>
            </div>
          </ScrollArea>
        </div>
      </ModalContent>
    </Modal>
  );
}
