import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { FormSettingsSection } from '../types';
import { FormSettingsContent } from './FormSettingsContent';
import { FormSettingsSidebarNavigation } from './FormSettingsSidebarNavigation';

interface FormSettingsDesktopLayoutProps {
  activeSection: FormSettingsSection;
  onSectionChange: (section: FormSettingsSection) => void;
  onClose: () => void;
  sectionProps: any;
}

export function FormSettingsDesktopLayout({
  activeSection,
  onSectionChange,
  onClose,
  sectionProps,
}: FormSettingsDesktopLayoutProps) {
  return (
    <div className="hidden h-full gap-4 md:flex">
      <div className="flex w-52 flex-col gap-2 border-border">
        <FormSettingsSidebarNavigation
          activeSection={activeSection}
          onSectionChange={onSectionChange}
        />
      </div>
      <div className="flex flex-1 flex-col gap-4">
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-4 p-8">
            <FormSettingsContent
              section={activeSection}
              {...sectionProps}
              updateNotifications={sectionProps.updateNotifications}
            />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
