import {
  BarChart2,
  Info,
  Key,
  Link2,
  Mail,
  Palette,
  Shield,
  Trophy,
  User,
} from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FORM_SETTINGS_SECTIONS } from "../index";
import type { FormSettingsSection } from "../types";

const iconMap = {
  Info,
  BarChart2,
  Shield,
  Trophy,
  User,
  Mail,
  Key,
  Palette,
  Link2,
};

interface FormSettingsSidebarNavigationProps {
  activeSection: FormSettingsSection;
  onSectionChange: (section: FormSettingsSection) => void;
}

export function FormSettingsSidebarNavigation({
  activeSection,
  onSectionChange,
}: FormSettingsSidebarNavigationProps) {
  return (
    <ScrollArea className="mt-8 flex flex-1 flex-col gap-4">
      <nav className="flex flex-col gap-2">
        {FORM_SETTINGS_SECTIONS.map((section) => {
          const isActive = activeSection === section.id;
          const IconComponent =
            iconMap[section.iconName as keyof typeof iconMap];
          return (
            <Button
              className={
                "w-full items-center justify-start gap-2 text-left transition-all" +
                (isActive
                  ? "bg-secondary text-secondary-foreground"
                  : "hover:bg-accent hover:text-accent-foreground")
              }
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              variant={isActive ? "secondary" : "ghost"}
            >
              <IconComponent className="h-4 w-4" />
              <span className="font-medium text-sm">{section.label}</span>
            </Button>
          );
        })}
      </nav>
    </ScrollArea>
  );
}
