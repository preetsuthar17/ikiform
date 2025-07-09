"use client";

// External imports
import React, { useState } from "react";
import { Save, Settings, Eye } from "lucide-react";

// Internal imports
import { Modal, ModalContent } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useFormSettings } from "./hooks";
import {
  FormSettingsDesktopLayout,
  FormSettingsMobileLayout,
} from "./components";
import type { FormSettingsModalProps, FormSettingsSection } from "./types";
import { formsDb } from "@/lib/database";
import { toast } from "@/hooks/use-toast";

export function FormSettingsModal({
  isOpen,
  onClose,
  schema,
  onSchemaUpdate,
  userEmail,
  formId,
}: FormSettingsModalProps) {
  const {
    localSettings,
    updateSettings,
    updateRateLimit,
    updateProfanityFilter,
    updateResponseLimit,
    updatePasswordProtection,
    updateSocialMedia,
    updateNotifications,
    resetSettings,
  } = useFormSettings(schema, userEmail);

  const [activeSection, setActiveSection] =
    useState<FormSettingsSection>("basic");
  const [saving, setSaving] = useState(false);

  const sectionProps = {
    localSettings,
    updateSettings,
    updateRateLimit,
    updateProfanityFilter,
    updateResponseLimit,
    updatePasswordProtection,
    updateSocialMedia,
    updateNotifications,
  };

  const handleSave = async () => {
    if (!formId) {
      toast.error("Missing form ID. Cannot save settings.");
      return;
    }
    setSaving(true);
    try {
      const newSchema = { ...schema, settings: localSettings };
      await formsDb.updateForm(formId, { schema: newSchema });
      onSchemaUpdate({ settings: localSettings });
      toast.success("Settings saved!");
      onClose();
    } catch (e) {
      toast.error("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    resetSettings();
    onClose();
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="max-w-6xl h-[90vh] flex flex-col p-2 md:p-4">
        <div className="flex items-center justify-between  shrink-0 gap-6 md:p-4 p-2  flex-wrap md:mt-4 mt-0">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Form Settings</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              loading={saving}
              className="gap-2"
            >
              {saving ? "" : <Save className="w-4 h-4" />}
              {saving ? "Saving" : "Save Changes"}
            </Button>
          </div>
        </div>
        <div className="flex-1 min-h-0">
          <FormSettingsDesktopLayout
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            onClose={onClose}
            sectionProps={sectionProps}
          />
          <FormSettingsMobileLayout
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            onClose={onClose}
            sectionProps={sectionProps}
          />
        </div>
      </ModalContent>
    </Modal>
  );
}
