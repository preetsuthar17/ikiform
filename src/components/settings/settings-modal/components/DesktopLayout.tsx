// External imports
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
// types and utilities
import type { SettingsSection } from '../types';
import {
  getContentAreaStyles,
  getDesktopLayoutStyles,
  getSidebarStyles,
} from '../utils';
// components
import { ModalHeader } from './ModalHeader';
import { SettingsContent } from './SettingsContent';
import { SidebarNavigation } from './SidebarNavigation';

interface DesktopLayoutProps {
  activeSection: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
  onClose: () => void;
}

export function DesktopLayout({
  activeSection,
  onSectionChange,
  onClose,
}: DesktopLayoutProps) {
  return (
    <div className={getDesktopLayoutStyles()}>
      <div className={`${getSidebarStyles()} gap-4`}>
        <div className="sr-only flex items-center gap-4 border-border border-b p-4">
          <ModalHeader onClose={onClose} />
        </div>
        <SidebarNavigation
          activeSection={activeSection}
          onSectionChange={onSectionChange}
        />
      </div>

      <div className={`${getContentAreaStyles()} gap-4`}>
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-4 p-8">
            <SettingsContent section={activeSection} />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
