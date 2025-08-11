import React from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { SETTINGS_SECTIONS } from "../constants";
import type { SettingsSection } from "../types";
import { getMobileLayoutStyles } from "../utils";
import { ModalHeader } from "./ModalHeader";
import { SettingsContent } from "./SettingsContent";

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
      <div className="flex flex-shrink-0 items-center gap-4 border-0 border-border p-2 md:border-b md:p-4">
        <ModalHeader onClose={onClose} />
      </div>

      <div className="flex flex-shrink-0 items-center gap-4 border-0 border-border p-2 md:border-b md:p-4">
        <Tabs
          items={SETTINGS_SECTIONS}
          onValueChange={(value) => onSectionChange(value as SettingsSection)}
          size="sm"
          value={activeSection}
          variant="underline"
        />
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-4 p-0 md:p-4">
            {SETTINGS_SECTIONS.map((section) => (
              <TabsContent
                activeValue={activeSection}
                key={section.id}
                value={section.id}
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
