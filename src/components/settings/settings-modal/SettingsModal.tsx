'use client';

import React, { useState } from 'react';

import { Modal, ModalContent, ModalTitle } from '@/components/ui/modal';
import { DesktopLayout, MobileLayout } from './components';
import type { SettingsModalProps, SettingsSection } from './types';
import { getModalContentStyles } from './utils';

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const [activeSection, setActiveSection] =
    useState<SettingsSection>('appearance');

  const handleClose = () => onOpenChange(false);

  return (
    <Modal onOpenChange={onOpenChange} open={open}>
      <ModalContent className={getModalContentStyles()}>
        <ModalTitle className="sr-only">Settings</ModalTitle>
        <div className="flex flex-col gap-4">
          <DesktopLayout
            activeSection={activeSection}
            onClose={handleClose}
            onSectionChange={setActiveSection}
          />
          <MobileLayout
            activeSection={activeSection}
            onClose={handleClose}
            onSectionChange={setActiveSection}
          />
        </div>
      </ModalContent>
    </Modal>
  );
}
