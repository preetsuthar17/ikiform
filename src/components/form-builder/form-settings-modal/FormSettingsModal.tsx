"use client";

// External imports
import React, { useState } from "react";
import { Save, Settings, Eye } from "lucide-react";

// Internal imports
import { Modal, ModalContent } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFormSettings } from "./hooks";
import {
  BasicInfoSection,
  RateLimitSection,
  ProfanityFilterSection,
  ResponseLimitSection,
} from "./components";
import type { FormSettingsModalProps } from "./types";

export function FormSettingsModal({
  isOpen,
  onClose,
  schema,
  onSchemaUpdate,
}: FormSettingsModalProps) {
  const {
    localSettings,
    updateSettings,
    updateRateLimit,
    updateProfanityFilter,
    updateResponseLimit,
    resetSettings,
  } = useFormSettings(schema);

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
        <div className="flex items-center justify-between border-b border-border shrink-0 gap-6 p-6">
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
          <ScrollArea className="h-full">
            <div className="flex flex-col gap-6 p-6">
              <BasicInfoSection
                localSettings={localSettings}
                updateSettings={updateSettings}
              />
              <RateLimitSection
                localSettings={localSettings}
                updateRateLimit={updateRateLimit}
              />
              <ResponseLimitSection
                localSettings={localSettings}
                updateResponseLimit={updateResponseLimit}
              />
              <ProfanityFilterSection
                localSettings={localSettings}
                updateProfanityFilter={updateProfanityFilter}
              />
            </div>
          </ScrollArea>
        </div>
      </ModalContent>
    </Modal>
  );
}
