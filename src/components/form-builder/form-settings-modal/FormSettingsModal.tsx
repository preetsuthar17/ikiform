"use client";

import { Settings } from "lucide-react";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FormSettingsDesktopLayout,
  FormSettingsMobileLayout,
} from "./components";
import { useFormSettings } from "./hooks";
import type { FormSettingsModalProps, FormSettingsSection } from "./types";

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
    updateDuplicatePrevention,
    updateProfanityFilter,
    updateBotProtection,
    updateResponseLimit,
    updatePasswordProtection,
    updateSocialMedia,
    updateNotifications,
    updateApi,
    resetSettings,
  } = useFormSettings(schema, userEmail);

  const [activeSection, setActiveSection] =
    useState<FormSettingsSection>("basic");

  const sectionProps = {
    localSettings,
    updateSettings,
    updateRateLimit,
    updateDuplicatePrevention,
    updateProfanityFilter,
    updateBotProtection,
    updateResponseLimit,
    updatePasswordProtection,
    updateSocialMedia,
    updateNotifications,
    updateApi,
    formId,
    schema,
    onSchemaUpdate,
  };

  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent className="b-5 flex h-[90vh] w-full grow flex-col gap-0 overflow-hidden p-0 sm:max-w-6xl">
        <DialogHeader className="flex shrink-0 flex-row items-center gap-6 p-4">
          <div className="flex items-center gap-3">
            <Settings className="size-5 text-primary" />
            <DialogTitle className="font-semibold text-xl">
              Form Settings
            </DialogTitle>
          </div>
        </DialogHeader>
        <div className="mb-12 min-h-0 p-4 md:mb-0">
          {formId && (
            <>
              <FormSettingsDesktopLayout
                activeSection={activeSection}
                onClose={onClose}
                onSectionChange={setActiveSection}
                sectionProps={sectionProps}
              />
              <FormSettingsMobileLayout
                activeSection={activeSection}
                onClose={onClose}
                onSectionChange={setActiveSection}
                sectionProps={sectionProps}
              />
            </>
          )}
          {!formId && (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <p className="text-muted-foreground">
                Please save the form first to access the settings.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
