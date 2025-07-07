import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormSettingsSidebarNavigation } from "./FormSettingsSidebarNavigation";
import { FormSettingsContent } from "./FormSettingsContent";
import type { FormSettingsSection } from "../types";

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
    <div className="hidden md:flex h-full gap-4">
      <div className="w-52 border-border flex flex-col gap-2">
        <FormSettingsSidebarNavigation
          activeSection={activeSection}
          onSectionChange={onSectionChange}
        />
      </div>
      <div className="flex-1 flex flex-col gap-4">
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
