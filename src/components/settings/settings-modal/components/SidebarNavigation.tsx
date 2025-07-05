// External imports
import React from "react";
import { Palette, Bell } from "lucide-react";

// Internal imports
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SettingsSection } from "../types";
import { SETTINGS_SECTIONS } from "../constants";
import { getNavigationItemStyles } from "../utils";

interface SidebarNavigationProps {
  activeSection: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
}

const iconMap = {
  Palette,
  Bell,
};

export function SidebarNavigation({
  activeSection,
  onSectionChange,
}: SidebarNavigationProps) {
  return (
    <ScrollArea className="flex-1 flex flex-col gap-4">
      <nav className="flex flex-col gap-2">
        {SETTINGS_SECTIONS.map((section) => {
          const isActive = activeSection === section.id;
          const IconComponent = iconMap[section.iconName];

          return (
            <Button
              key={section.id}
              variant={isActive ? "secondary" : "ghost"}
              className={getNavigationItemStyles(isActive)}
              onClick={() => onSectionChange(section.id)}
            >
              <IconComponent className="w-4 h-4" />
              <span className="font-medium text-sm">{section.label}</span>
            </Button>
          );
        })}
      </nav>
    </ScrollArea>
  );
}
