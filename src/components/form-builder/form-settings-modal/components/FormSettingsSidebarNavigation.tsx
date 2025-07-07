import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FORM_SETTINGS_SECTIONS } from "../index";
import type { FormSettingsSection } from "../types";
import { Info, BarChart2, Shield, User, Mail } from "lucide-react";

const iconMap = { Info, BarChart2, Shield, User, Mail };

interface FormSettingsSidebarNavigationProps {
  activeSection: FormSettingsSection;
  onSectionChange: (section: FormSettingsSection) => void;
}

export function FormSettingsSidebarNavigation({
  activeSection,
  onSectionChange,
}: FormSettingsSidebarNavigationProps) {
  return (
    <ScrollArea className="flex-1 flex flex-col gap-4 mt-8">
      <nav className="flex flex-col gap-2">
        {FORM_SETTINGS_SECTIONS.map((section) => {
          const isActive = activeSection === section.id;
          const IconComponent =
            iconMap[section.iconName as keyof typeof iconMap];
          return (
            <Button
              key={section.id}
              variant={isActive ? "secondary" : "ghost"}
              className={
                "w-full text-left items-center justify-start transition-all gap-2" +
                (isActive
                  ? " bg-secondary text-secondary-foreground"
                  : " hover:bg-accent hover:text-accent-foreground")
              }
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
