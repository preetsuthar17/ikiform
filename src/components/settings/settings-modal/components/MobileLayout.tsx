// External imports
import React from "react";

// Internal imports
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ModalHeader } from "./ModalHeader";
import { SettingsContent } from "./SettingsContent";
import { SettingsSection } from "../types";
import { SETTINGS_SECTIONS } from "../constants";
import { getMobileLayoutStyles } from "../utils";

interface MobileLayoutProps {
  activeSection: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
  onClose: () => void;
}

export function MobileLayout({
  activeSection,
  onSectionChange,
  onClose,
}: MobileLayoutProps) {
  return (
    <div className={getMobileLayoutStyles()}>
      <div className="flex items-center gap-4 md:border-b border-0 border-border md:p-4 p-2 flex-shrink-0">
        <ModalHeader onClose={onClose} />
      </div>

      <div className="flex items-center gap-4 md:border-b border-0 border-border md:p-4 p-2 flex-shrink-0">
        <Tabs
          items={SETTINGS_SECTIONS}
          value={activeSection}
          onValueChange={(value) => onSectionChange(value as SettingsSection)}
          variant="underline"
          size="sm"
        />
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-4 md:p-4 p-0">
            {SETTINGS_SECTIONS.map((section) => (
              <TabsContent
                key={section.id}
                value={section.id}
                activeValue={activeSection}
              >
                <SettingsContent section={section.id} />
              </TabsContent>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
