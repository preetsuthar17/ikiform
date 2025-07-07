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

export function FormSettingsModal({
  isOpen,
  onClose,
  schema,
  onSchemaUpdate,
  userEmail,
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

  const handleSave = () => {
    onSchemaUpdate({ settings: localSettings });
    onClose();
  };

  const handleCancel = () => {
    resetSettings();
    onClose();
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="max-w-6xl h-[90vh] flex flex-col">
        <div className="flex items-center justify-between  shrink-0 gap-6 md:p-4 p-2  flex-wrap md:mt-4 mt-0">
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
