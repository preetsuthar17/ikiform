import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { FORM_SETTINGS_SECTIONS } from "../index";
import { FormSettingsContent } from "./FormSettingsContent";
import type { FormSettingsSection } from "../types";

interface FormSettingsMobileLayoutProps {
  activeSection: FormSettingsSection;
  onSectionChange: (section: FormSettingsSection) => void;
  onClose: () => void;
  sectionProps: any;
}

export function FormSettingsMobileLayout({
  activeSection,
  onSectionChange,
  onClose,
  sectionProps,
}: FormSettingsMobileLayoutProps) {
  return (
    <div className="md:hidden flex flex-col h-full gap-4">
      <div className="flex items-center gap-4 md:border-b border-0 border-border md:p-4 p-2 flex-shrink-0">
        <Tabs
          items={FORM_SETTINGS_SECTIONS}
          value={activeSection}
          onValueChange={(value) =>
            onSectionChange(value as FormSettingsSection)
          }
          variant="underline"
          size="sm"
        />
      </div>
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-4 md:p-4 p-0">
            {FORM_SETTINGS_SECTIONS.map((section) => (
              <TabsContent
                key={section.id}
                value={section.id}
                activeValue={activeSection}
              >
                <FormSettingsContent
                  section={section.id}
                  {...sectionProps}
                  updateNotifications={sectionProps.updateNotifications}
                />
              </TabsContent>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
