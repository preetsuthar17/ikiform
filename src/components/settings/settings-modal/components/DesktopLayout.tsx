// External imports
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

// components
import { ModalHeader } from "./ModalHeader";
import { SidebarNavigation } from "./SidebarNavigation";
import { SettingsContent } from "./SettingsContent";

// types and utilities
import { SettingsSection } from "../types";
import {
  getSidebarStyles,
  getDesktopLayoutStyles,
  getContentAreaStyles,
} from "../utils";

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
        <div className="flex items-center gap-4 border-b border-border p-4 sr-only">
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
