"use client";

// External imports
import React, { useState } from "react";

// Internal imports
import { Modal, ModalContent, ModalTitle } from "@/components/ui/modal";
import { DesktopLayout, MobileLayout } from "./components";
import { SettingsModalProps, SettingsSection } from "./types";
import { getModalContentStyles } from "./utils";

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("appearance");

  const handleClose = () => onOpenChange(false);

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className={getModalContentStyles()}>
        <ModalTitle className="sr-only">Settings</ModalTitle>
        <div className="flex flex-col gap-4">
          <DesktopLayout
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            onClose={handleClose}
          />
          <MobileLayout
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            onClose={handleClose}
          />
        </div>
      </ModalContent>
    </Modal>
  );
}
